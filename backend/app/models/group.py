from sqlalchemy import Column, Integer, ForeignKey
from app.db import Base

class GroupAssignment(Base):
    __tablename__ = "group_assignments"

    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    group_number = Column(Integer, nullable=False)

    wins = Column(Integer, default=0)
    losses = Column(Integer, default=0)
    draws = Column(Integer, default=0)
    points = Column(Integer, default=0)
    total_score = Column(Integer, default=0)
