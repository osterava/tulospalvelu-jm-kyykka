from pydantic import BaseModel
from datetime import datetime

class MatchBase(BaseModel):
    home_team_id: int
    away_team_id: int
    time: datetime
    field: str

class MatchCreate(MatchBase):
    pass

class MatchScoreUpdate(BaseModel):
    home_score: int
    away_score: int

class MatchRead(MatchBase):
    id: int

    class Config:
        from_attributes = True
