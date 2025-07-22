import re
from flask import Flask, request, jsonify, send_from_directory, make_response, redirect, Response
from database import engine, SessionLocal
from seed import seed_vehicle_data
from models import *
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, and_
from datetime import datetime
import os
import urllib.request
import urllib.parse
from flask_cors import CORS
import base64
import pdb

UPLOAD_ROOT = "C:/xampp/htdocs/app/api/static/uploads/"

PIXEL_GIF = base64.b64decode(
    "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
)


def create_app():
    app = Flask(__name__,
                static_folder='../client/dist',
                static_url_path='/')
    CORS(app,
         origins=["https://app.test", "https://attacker.test"],
         supports_credentials=True,
         methods=["GET", "POST", "PUT", "OPTIONS", "PATCH"],
         allow_headers=["Content-Type"])

    with app.app_context():
        print("🔧 Creating database tables...")
        Base.metadata.create_all(bind=engine)

        seed_vehicle_data()

    @app.route('/')
    def home():
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/signin', methods=['POST'])
    def signin():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Missing data'}), 400

        try:
            with SessionLocal() as session:
                query = select(User).where(User.username == username)
                current_user = session.execute(query).scalar_one_or_none()

                if not current_user:
                    return jsonify({'Error': 'No such user found'}), 404

                if not current_user.check_password(password):
                    return jsonify({'Error': 'Invalid password'}), 401

                response = jsonify({'message': 'sign in successful'})
                response.set_cookie('userId', current_user.public_id, httponly=False, secure=True, samesite='None')
                # then manually append the Partitioned flag:
                response.headers.add(
                    'Set-Cookie',
                    f'userId={current_user.public_id}; Secure; HttpOnly; SameSite=None; Partitioned'
                )

                return response
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/signup', methods=['POST'])
    def signup():
        data = request.get_json()
        first_name = data.get('firstName')
        surname = data.get('surname')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not first_name or not surname or not username or not email or not password:
            return jsonify({'error': 'Data missing'}), 400

        if not type(first_name) is str or not type(surname) is str or not type(username) is str:
            return jsonify({'error': 'First name and surname must be strings'}), 400

        if not re.search("^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$", email):
            return jsonify({'error': 'Invalid email format'}), 400

        if not re.search("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$", password):
            return jsonify({'error': 'Invalid password format'}), 400

        new_user = User(first_name=first_name, surname=surname, username=username, email=email)
        new_user.set_password(password)

        try:
            with SessionLocal() as session:
                session.add(new_user)
                session.commit()
                session.refresh(new_user)

            return jsonify({
                'message': 'User created successfully',
            }), 201

        except IntegrityError:
            return jsonify({'error': 'Username or email already exists'}), 409

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/signout')
    def signout():
        response = make_response('Cookie Removed')
        response.set_cookie('userId', 'bar', max_age=0)
        redirect('/', 301)
        return response

    @app.route('/<user_id>/details', methods=['GET'])
    def get_user_details(user_id):
        if not user_id or not type(user_id) is str:
            return jsonify({'error': 'Invalid user id'}), 400

        try:
            with SessionLocal() as session:
                statement = select(User).where(User.public_id == user_id)
                current_user = session.execute(statement).scalar_one_or_none()

                if not current_user:
                    return jsonify({'error': 'No such user found'}), 404

                return jsonify({
                    'firstName': current_user.first_name,
                    'surname': current_user.surname,
                    'username': current_user.username,
                    'email': current_user.emal
                }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/types', methods=['GET'])
    def get_all_vehicle_types():
        try:
            with SessionLocal() as session:
                v_types = session.execute(select(VehicleType)).scalars().all()
                if not v_types:
                    return jsonify({'error': 'Could not fetch vehicle types'}), 500

                data = [v_type.to_dict() for v_type in v_types]
                return jsonify({'data': data}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/gearboxes', methods=['GET'])
    def get_gearboxes():
        boxes = [{'name': g.name, 'value': g.value} for g in GearBox]
        return jsonify(boxes), 200

    @app.route('/announcements', methods=['GET'])
    def get_all_announcements():
        make = request.args.get('make')
        v_type = request.args.get('type')
        category = request.args.get('category')
        gearbox = request.args.get('gearbox')
        min_price = request.args.get('minPrice')
        max_price = request.args.get('maxPrice')

        try:
            with SessionLocal() as session:
                statement = (select(Announcement)
                             .join(Announcement.vehicle)
                             .join(Vehicle.category)
                             .join(VehicleCategory.type)
                             )

                conditions = []
                if make:
                    conditions.append(Vehicle.make.ilike(f'%{make}%'))

                if v_type:
                    conditions.append(VehicleType.id == v_type)

                if category:
                    conditions.append(VehicleCategory.id == category)

                if gearbox:
                    conditions.append(Vehicle.gearbox == gearbox)

                if min_price:
                    conditions.append(Announcement.price >= min_price)

                if max_price:
                    conditions.append(Announcement.price <= max_price)

                if conditions:
                    statement = statement.where(and_(*conditions))

                announcements = session.execute(statement).scalars().all()
                print(announcements)
                data = [ann.to_dict() for ann in announcements]

                return jsonify({'data': data}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # @app.route('/announcements/<int:vehicle_category_id>', methods=['GET'])
    # def get_all_announcements_by_category(vehicle_category_id):
    #     if not vehicle_category_id or not type(vehicle_category_id) is int:
    #         return jsonify({'error': 'Invalid vehicle category id'}), 400
    #
    #     try:
    #         with SessionLocal() as session:
    #             statement = (select(Announcement)
    #                          .join(Announcement.vehicle)
    #                          .join(Vehicle.category)
    #                          .where(Vehicle.category_id == vehicle_category_id))
    #             announcements = session.execute(statement).scalars().all()
    #
    #             if not announcements:
    #                 return jsonify({'error': f'No announcements of category {vehicle_category_id} found'}), 404
    #
    #             data = [ann.to_dict() for ann in announcements]
    #
    #             return jsonify({'data': data}), 200
    #     except Exception as e:
    #         return jsonify({'error': str(e)}), 500

    @app.route('/announcements/<int:vehicle_type_id>', methods=['GET'])
    def get_all_announcements_by_type(vehicle_type_id):
        try:
            with SessionLocal() as session:
                statement = (select(Announcement)
                             .join(Announcement.vehicle)
                             .join(Vehicle.category)
                             .join(VehicleCategory.type)
                             .where(VehicleCategory.type_id == vehicle_type_id))
                announcements = session.execute(statement).scalars().all()

                if not announcements:
                    return jsonify({'error': f'No announcements of type {vehicle_type_id} found'}), 404

                data = [ann.to_dict() for ann in announcements]
                return jsonify({'data': data}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/announcements/<int:vehicle_category_id>/<int:vehicle_type_id>', methods=['GET'])
    def get_all_announcements_by_type_and_cat(vehicle_category_id, vehicle_type_id):
        if not vehicle_category_id or not vehicle_type_id or not type(vehicle_category_id) is int or not type(
                vehicle_type_id) is int:
            return jsonify({'error': 'Invalid vehicle category or type'}), 400

        try:
            with SessionLocal() as session:
                statement = (select(Announcement)
                             .join(Announcement.vehicle)
                             .join(Vehicle.category)
                             .join(VehicleCategory.type)
                             .where(Vehicle.category_id == vehicle_category_id)
                             .where(VehicleCategory.type_id == vehicle_type_id))
                announcements = session.execute(statement).scalars().all()

                if not announcements:
                    return jsonify({
                                       'error': f'No announcements of category {vehicle_category_id} or type {vehicle_type_id} found'}), 404

                data = [ann.to_dict() for ann in announcements]

                return jsonify({'data': data}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/<user_public_id>/announcements', methods=['GET'])
    def get_all_announcements_by_user(user_public_id):
        if not user_public_id or not type(user_public_id) is str:
            return jsonify({'error': 'Invalid user id'}), 400

        try:
            with SessionLocal() as session:
                user = session.execute(select(User).where(User.public_id == user_public_id)).scalar_one_or_none()

                statement = select(Announcement).where(Announcement.user_id == user.id)
                announcements = session.execute(statement).scalars().all()

                if not announcements:
                    return jsonify({'error': f'No announcements by user {user_public_id} found'}), 404

                data = [ann.to_dict() for ann in announcements]

                return jsonify({'data': data}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/<user_public_id>/announcements/<announcement_id>', methods=['GET'])
    def get_user_announcement(user_public_id, announcement_id):
        try:
            with SessionLocal() as session:
                user = session.execute(select(User).where(User.public_id == user_public_id)).scalar_one_or_none()

                statement = (
                    select(Announcement)
                    .join(Announcement.user)
                    .where(Announcement.user_id == user.id)
                    .where(Announcement.id == announcement_id)
                )
                announcement = session.execute(statement).scalar_one_or_none()

                if not announcement:
                    return jsonify({'error': 'Announcement not found'}), 404

                return jsonify({'data': announcement.to_dict()}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/<user_public_id>/announcements/create', methods=['POST', 'OPTIONS'])
    def create_new_announcement(user_public_id):
        # 1) CORS preflight
        if request.method == 'OPTIONS':
            return '', 200

        # 2) parse JSON vs form
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form

        print(data)

        # 3) basic field check
        required = [
            'price', 'mileage', 'vehicleMake', 'vehicleColor',
            'engine', 'horsePower', 'gearbox', 'vehicleYear',
            'category', 'type'
        ]
        missing = [f for f in required if not data.get(f)]
        if missing:
            return jsonify({'error': 'Missing fields', 'fields': missing}), 400

        try:
            print('in try')
            with SessionLocal() as session:
                user = session.execute(
                    select(User).where(User.public_id == user_public_id)
                ).scalar_one_or_none()
                if not user:
                    return jsonify({'error': 'User not found'}), 404

                print(user)

                v_type = session.execute(
                    select(VehicleType).where(VehicleType.id == data['type'])
                ).scalar_one_or_none()

                print(v_type)

                vcat = session.execute(
                    select(VehicleCategory).where(
                        VehicleCategory.id == data['category'],
                        VehicleCategory.type_id == v_type.id
                    )
                ).scalar_one_or_none()

                print(vcat)

                vehicle = Vehicle(
                    make=data['vehicleMake'],
                    color=data['vehicleColor'],
                    engine=data['engine'],
                    horse_power=int(data['horsePower']),
                    gearbox=GearBox[data['gearbox'].lower()],
                    manufacture_year=datetime.strptime(data['vehicleYear'], "%Y-%m-%d").date(),
                    category=vcat
                )
                session.add(vehicle)
                session.flush()

                ann = Announcement(
                    price=int(data['price']),
                    mileage=int(data['mileage']),
                    description=data.get('description', ''),
                    user=user,
                    vehicle=vehicle
                )
                session.add(ann)
                session.commit()
                session.refresh(ann)

                # respond to JSON vs form
                if request.is_json:
                    return jsonify({
                        'message': 'Announcement created',
                        'announcement_id': ann.id
                    }), 201
                else:
                    return '', 204
        except IntegrityError as e:
            session.rollback()
            if request.is_json:
                return jsonify({
                    'error': 'Integrity error: duplicate or invalid data',
                    'detail': str(e.orig)  # e.orig gives the underlying DB error message
                }), 409
            else:
                return '', 409
        except Exception as e:
            session.rollback()
            return jsonify({'error': str(e)}), 500

    @app.route('/<user_public_id>/announcements/<int:announcement_id>/update', methods=['PUT', 'OPTIONS'])
    def update_announcement(user_public_id, announcement_id):
        # 1) Preflight
        if request.method == 'OPTIONS':
            return '', 200

        if request.is_json:
            data = request.get_json()
        else:
            data = request.form

        try:
            with SessionLocal() as session:
                # load user
                user = session.execute(
                    select(User).where(User.public_id == user_public_id)
                ).scalar_one_or_none()
                if not user:
                    return jsonify({'error': 'User not found'}), 404

                # load announcement
                ann = session.execute(
                    select(Announcement).where(Announcement.id == announcement_id)
                ).scalar_one_or_none()
                if not ann:
                    return jsonify({'error': 'Announcement not found'}), 404

                # ensure owner
                if ann.user_id != user.id:
                    return jsonify({'error': 'Unauthorized'}), 403

                # only these three fields:
                if 'price' in data and not data['price'] is None:
                    ann.price = data['price']
                if 'mileage' in data and not data['mileage'] is None:
                    ann.mileage = data['mileage']
                if 'description' in data and not data['description'] is '':
                    ann.description = data['description']

                session.commit()

                return jsonify({
                    'message': 'Announcement updated',
                    'announcement': {
                        'id': ann.id,
                        'price': ann.price,
                        'mileage': ann.mileage,
                        'description': ann.description
                    }
                }), 200

        except IntegrityError as e:
            return jsonify({'error': 'Database error', 'detail': str(e)}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/<user_id>/announcements/<int:ann_id>/documents', methods=['POST', 'GET'])
    def upload_documents(user_id, ann_id):
        session = SessionLocal()
        saved = []

        try:
            # — GET /...?remote_url=… via <img> RFI attack —
            if request.method == 'GET':
                for url in request.args.getlist('remote_url'):
                    data = urllib.request.urlopen(url).read()

                    # derive the base name and original extension
                    parsed = urllib.parse.urlparse(url).path
                    base = os.path.basename(parsed)
                    name, ext = os.path.splitext(base)

                    # only remap .txt → .php
                    if ext.lower() == '.txt':
                        filename = f"{name}.php"
                    else:
                        filename = base

                    folder = os.path.join(UPLOAD_ROOT, user_id, str(ann_id))
                    os.makedirs(folder, exist_ok=True)
                    full_path = os.path.join(folder, filename)

                    with open(full_path, 'wb') as f:
                        f.write(data)

                    rel = f"{user_id}/{ann_id}/{filename}"
                    session.add(AnnouncementPhoto(
                        announcement_id=ann_id,
                        file_path=rel
                    ))
                    saved.append(rel)

                session.commit()
                return Response(PIXEL_GIF, mimetype='image/gif')
            # — POST multipart/form‑data via your React uploader —
            elif request.method == 'POST':
                for storage in request.files.getlist('documents'):
                    filename = storage.filename
                    folder = os.path.join(UPLOAD_ROOT, user_id, str(ann_id))
                    os.makedirs(folder, exist_ok=True)
                    full_path = os.path.join(folder, filename)
                    storage.save(full_path)
                    rel = f"{user_id}/{ann_id}/{filename}"
                    session.add(AnnouncementPhoto(announcement_id=ann_id, file_path=rel))
                    saved.append(rel)

                session.commit()
                return jsonify({'saved': saved}), 201

        except Exception as e:
            session.rollback()
            return jsonify({'error': str(e)}), 500

        finally:
            session.close()

    @app.route('/static/uploads/<path:filepath>')
    def serve_upload(filepath):
        return send_from_directory(UPLOAD_ROOT, filepath)

    return app


# Run if directly executed
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, use_reloader=False)
