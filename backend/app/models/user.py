from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.db.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(50), unique=True, nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    hashed_password = Column(String(255), nullable=False)
    
    farms = relationship(
        "Farm",
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )