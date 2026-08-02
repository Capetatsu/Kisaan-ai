from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.farm import Farm
from app.models.user import User
from app.schemas.farm import (
    FarmCreate,
    FarmUpdate,
)
from app.exceptions.auth import InvalidCredentialsException


class FarmService:

    @staticmethod
    def create_farm(
        db: Session,
        farm: FarmCreate,
        current_user: User,
    ):

        db_farm = Farm(
            user_id=current_user.id,
            name=farm.name,
            soil_type=farm.soil_type,
            area=farm.area,
            latitude=farm.latitude,
            longitude=farm.longitude,
        )

        db.add(db_farm)
        db.commit()
        db.refresh(db_farm)

        return db_farm

    @staticmethod
    def get_farms(
        db: Session,
        current_user: User,
    ):

        stmt = (
            select(Farm)
            .where(Farm.user_id == current_user.id)
        )

        return db.execute(stmt).scalars().all()