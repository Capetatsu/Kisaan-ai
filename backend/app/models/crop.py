from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class CropSeason(str, enum.Enum):
    KHARIF = "KHARIF"
    RABI = "RABI"
    ZAID = "ZAID"


class CropStatus(str, enum.Enum):
    PLANTED = "PLANTED"
    GROWING = "GROWING"
    HARVESTED = "HARVESTED"


class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)

    farm_id = Column(
        Integer,
        ForeignKey("farms.id", ondelete="CASCADE"),
        nullable=False,
    )

    name = Column(String(100), nullable=False)

    variety = Column(String(100), nullable=True)

    season = Column(
        Enum(CropSeason),
        nullable=False,
    )

    planted_at = Column(Date, nullable=False)

    expected_harvest = Column(Date, nullable=True)

    status = Column(
        Enum(CropStatus),
        nullable=False,
        default=CropStatus.PLANTED,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    farm = relationship(
        "Farm",
        back_populates="crops",
    )