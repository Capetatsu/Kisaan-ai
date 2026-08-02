from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.farm import (
    FarmCreate,
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