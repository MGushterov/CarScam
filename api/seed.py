from models import VehicleType, VehicleCategory
from database import SessionLocal

# Our predefined structure
VEHICLE_HIERARCHY = {
    "Automobile": ["Sedan", "Hatchback", "Convertible", "Coupe"],
    "Motorcycle": ["Scooter", "Sport", "Cruiser"],
    "SUV": ["Compact SUV", "Full-size SUV"],
    "Camper": ["Van", "Truck Camper", "Trailer"]
}


def seed_vehicle_data():
    session = SessionLocal()

    try:
        if session.query(VehicleType).first():
            print("✅ Vehicle types already exist. Skipping seeding.")
            return

        for type_name, categories in VEHICLE_HIERARCHY.items():
            v_type = VehicleType(name=type_name)
            session.add(v_type)
            session.flush()  # So we get the id immediately

            for cat in categories:
                category = VehicleCategory(name=cat, type_id=v_type.id)
                session.add(category)

        session.commit()
        print("🚗 Seeded vehicle types and categories successfully.")
    except Exception as e:
        session.rollback()
        print(f"❌ Seeding failed: {e}")
    finally:
        session.close()
