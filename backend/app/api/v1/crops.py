from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.crop import (
    CropCreate,
    CropUpdate,
    CropResponse,
)
from app.services.crop_service import CropService

router = APIRouter(
    prefix="/farms/{farm_id}/crops",
    tags=["Crops"],
)


@router.post(
    "",
    response_model=CropResponse,
    status_code=201,
)
def create_crop(
    farm_id: int,
    crop: CropCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return CropService.create_crop(
        db,
        farm_id,
        crop,
        current_user,
    )


@router.get(
    "",
    response_model=list[CropResponse],
)
def get_crops(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return CropService.get_crops(
        db,
        farm_id,
        current_user,
    )


@router.get(
    "/{crop_id}",
    response_model=CropResponse,
)
def get_crop(
    farm_id: int,
    crop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return CropService.get_crop(
        db,
        farm_id,
        crop_id,
        current_user,
    )


@router.put(
    "/{crop_id}",
    response_model=CropResponse,
)
def update_crop(
    farm_id: int,
    crop_id: int,
    crop_update: CropUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return CropService.update_crop(
        db,
        farm_id,
        crop_id,
        crop_update,
        current_user,
    )


@router.delete(
    "/{crop_id}",
)
def delete_crop(
    farm_id: int,
    crop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return CropService.delete_crop(
        db,
        farm_id,
        crop_id,
        current_user,
    )