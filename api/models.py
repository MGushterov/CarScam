import enum
from datetime import date
from typing import List
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Date, ForeignKey, Enum
from werkzeug.security import generate_password_hash, check_password_hash
from nanoid import generate


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__: str = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    public_id: Mapped[str] = mapped_column(String(12), unique=True, default=lambda: generate(size=12))
    first_name: Mapped[str] = mapped_column(String(64), nullable=False)
    surname: Mapped[str] = mapped_column(String(64), nullable=False)
    username: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(128))
    announcements: Mapped[List["Announcement"]] = relationship("Announcement", back_populates="user")

    def set_password(self, password: str) -> None:
        self.password = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password, password)


class VehicleType(Base):
    __tablename__ = "vehicle_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)

    categories: Mapped[List["VehicleCategory"]] = relationship("VehicleCategory", back_populates="type")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'categories': [cat.to_dict() for cat in self.categories]
        }


class VehicleCategory(Base):
    __tablename__ = "vehicle_categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    type_id: Mapped[int] = mapped_column(ForeignKey("vehicle_types.id"), nullable=False)
    type: Mapped["VehicleType"] = relationship("VehicleType", back_populates="categories")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }


class GearBox(enum.Enum):
    automatic = "Automatic"
    manual = "Manual"
    cvt = "CVT"


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("vehicle_categories.id"), nullable=False)
    category: Mapped["VehicleCategory"] = relationship("VehicleCategory")
    make: Mapped[str] = mapped_column(String(32), nullable=False)
    engine: Mapped[str] = mapped_column(String(32))
    manufacture_year: Mapped[date] = mapped_column(Date, nullable=False)
    horse_power: Mapped[int] = mapped_column(Integer, nullable=False)
    color: Mapped[str] = mapped_column(String(32), nullable=False)
    gearbox: Mapped[GearBox] = mapped_column(Enum(GearBox), nullable=False)
    announcement: Mapped["Announcement"] = relationship(back_populates="vehicle")


class AnnouncementPhoto(Base):
    __tablename__ = "announcement_photos"

    id: Mapped[int] = mapped_column(primary_key=True)
    file_path: Mapped[str] = mapped_column(String(64), nullable=False)
    announcement_id: Mapped[int] = mapped_column(ForeignKey("announcements.id"))
    announcement: Mapped["Announcement"] = relationship("Announcement", back_populates="photos")

    def to_dict(self):
        return {
            'id': self.id,
            'path': self.file_path
        }


class Announcement(Base):
    __tablename__ = "announcements"

    id: Mapped[int] = mapped_column(primary_key=True)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    mileage: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(String(256))

    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"))
    vehicle: Mapped["Vehicle"] = relationship(back_populates="announcement")
    photos: Mapped[List["AnnouncementPhoto"]] = relationship("AnnouncementPhoto",
                                                             back_populates="announcement",
                                                             cascade="all, delete-orphan")
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship("User", back_populates="announcements")

    def to_dict(self):
        return {
            'announcementId': self.id,
            'userId': self.user.public_id,
            'price': self.price,
            'mileage': self.mileage,
            'description': self.description,
            'vehicleMake': self.vehicle.make,
            'vehicleColor': self.vehicle.color,
            'vehicleYear': self.vehicle.manufacture_year.isoformat(),
            'category': self.vehicle.category.name,
            'type': self.vehicle.category.type.name,
            'engine': self.vehicle.engine,
            'gearbox': self.vehicle.gearbox.value,
            'horsePower': self.vehicle.horse_power,
            'photos': [photo.to_dict() for photo in self.photos]
        }

