from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.farm import (
    FarmCreate,
    FarmUpdate,
    FarmResponse,
)
from app.services.farm_service import FarmService

router = APIRouter(
    prefix="/farms",
    tags=["Farms"],
)


@router.post(
    "",
    response_model=FarmResponse,
    status_code=201,
)
def create_farm(
    farm: FarmCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return FarmService.create_farm(
        db,
        farm,
        current_user,
    )


@router.get(
    "",
    response_model=list[FarmResponse],
)
def get_farms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return FarmService.get_farms(
        db,
        current_user,
    )


@router.get(
    "/{farm_id}",
    response_model=FarmResponse,
)
def get_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return FarmService.get_farm(
        db,
        farm_id,
        current_user,
    )


@router.put(
    "/{farm_id}",
    response_model=FarmResponse,
)
def update_farm(
    farm_id: int,
    farm_update: FarmUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return FarmService.update_farm(
        db,
        farm_id,
        farm_update,
        current_user,
    )


@router.delete(
    "/{farm_id}",
)
def delete_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return FarmService.delete_farm(
        db,
        farm_id,
        current_user,
    )