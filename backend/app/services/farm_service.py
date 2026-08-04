from sqlalchemy import select
from sqlalchemy.orm import Session

from app.exceptions import (
    FarmNotFoundException,
)
from app.models.farm import Farm
from app.models.user import User
from app.schemas.farm import (
    FarmCreate,
    FarmUpdate,
)


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
            .order_by(Farm.created_at.desc())
        )

        return db.execute(stmt).scalars().all()

    @staticmethod
    def _get_farm_or_404(
        db: Session,
        farm_id: int,
        current_user: User,
    ) -> Farm:
        stmt = select(Farm).where(
            Farm.id == farm_id,
            Farm.user_id == current_user.id,
        )

        farm = db.execute(stmt).scalar_one_or_none()

        if farm is None:
            raise FarmNotFoundException()

        return farm

    @staticmethod
    def get_farm(
        db: Session,
        farm_id: int,
        current_user: User,
    ) -> Farm:
        return FarmService._get_farm_or_404(
            db,
            farm_id,
            current_user,
        )

    @staticmethod
    def update_farm(
        db: Session,
        farm_id: int,
        farm_update: FarmUpdate,
        current_user: User,
    ) -> Farm:
        db_farm = FarmService._get_farm_or_404(
            db,
            farm_id,
            current_user,
        )

        update_data = farm_update.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(db_farm, field, value)

        db.commit()
        db.refresh(db_farm)

        return db_farm

    @staticmethod
    def delete_farm(
        db: Session,
        farm_id: int,
        current_user: User,
    ):
        db_farm = FarmService._get_farm_or_404(
            db,
            farm_id,
            current_user,
        )

        db.delete(db_farm)
        db.commit()

        return {"message": "Farm deleted successfully"}