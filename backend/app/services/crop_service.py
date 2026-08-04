from sqlalchemy import select
from sqlalchemy.orm import Session

from app.exceptions import (
    FarmNotFoundException,
    CropNotFoundException,
)
from app.models.crop import Crop
from app.models.farm import Farm
from app.models.user import User
from app.schemas.crop import CropCreate, CropUpdate


class CropService:

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
    def _get_crop_or_404(
        db: Session,
        farm_id: int,
        crop_id: int,
        current_user: User,
    ) -> Crop:
        stmt = (
            select(Crop)
            .join(Farm, Crop.farm_id == Farm.id)
            .where(
                Crop.id == crop_id,
                Crop.farm_id == farm_id,
                Farm.user_id == current_user.id,
            )
        )

        crop = db.execute(stmt).scalar_one_or_none()

        if crop is None:
            raise CropNotFoundException()

        return crop

    @staticmethod
    def create_crop(
        db: Session,
        farm_id: int,
        crop: CropCreate,
        current_user: User,
    ):
        # Verify the farm belongs to the current user
        CropService._get_farm_or_404(db, farm_id, current_user)

        db_crop = Crop(
            farm_id=farm_id,
            name=crop.name,
            variety=crop.variety,
            season=crop.season,
            planted_at=crop.planted_at,
            expected_harvest=crop.expected_harvest,
            status=crop.status,
        )

        db.add(db_crop)
        db.commit()
        db.refresh(db_crop)

        return db_crop

    @staticmethod
    def get_crops(
        db: Session,
        farm_id: int,
        current_user: User,
    ):
        # Verify the farm belongs to the current user
        CropService._get_farm_or_404(db, farm_id, current_user)

        stmt = (
            select(Crop)
            .where(Crop.farm_id == farm_id)
            .order_by(Crop.created_at.desc())
        )

        return db.execute(stmt).scalars().all()

    @staticmethod
    def get_crop(
        db: Session,
        farm_id: int,
        crop_id: int,
        current_user: User,
    ):
        return CropService._get_crop_or_404(
            db,
            farm_id,
            crop_id,
            current_user,
        )

    @staticmethod
    def update_crop(
        db: Session,
        farm_id: int,
        crop_id: int,
        crop_update: CropUpdate,
        current_user: User,
    ):
        db_crop = CropService._get_crop_or_404(
            db,
            farm_id,
            crop_id,
            current_user,
        )

        update_data = crop_update.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(db_crop, field, value)

        db.commit()
        db.refresh(db_crop)

        return db_crop

    @staticmethod
    def delete_crop(
        db: Session,
        farm_id: int,
        crop_id: int,
        current_user: User,
    ):
        db_crop = CropService._get_crop_or_404(
            db,
            farm_id,
            crop_id,
            current_user,
        )

        db.delete(db_crop)
        db.commit()

        return {"message": "Crop deleted successfully"}