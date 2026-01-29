from pydantic import BaseModel
from typing import List
from datetime import datetime

class MatchInfo(BaseModel):
    id: int
    home_team: str
    away_team: str
    time: datetime
    field: str


class StandingEntry(BaseModel):
    team: str
    wins: int
    losses: int
    draws: int
    points: int
    total_score: int


class TeamDetail(BaseModel):
    team: str
    group: int
    upcoming_matches: List[MatchInfo]
    group_teams: List[StandingEntry]

    class Config:
        from_attributes = True
