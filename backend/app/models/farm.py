from sqlalchemy import Column, Float, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    name = Column(String(100), nullable=False)

    soil_type = Column(String(100), nullable=False)

    crops = relationship(
        "Crop",
        back_populates="farm",
        cascade="all, delete-orphan",
    )

    area = Column(Float, nullable=False)

    latitude = Column(Float, nullable=False)

    longitude = Column(Float, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    owner = relationship(
        "User",
        back_populates="farms",
    )