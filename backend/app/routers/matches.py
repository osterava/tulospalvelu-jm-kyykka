from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.match import Match
from app.models.team import Team

router = APIRouter(prefix="/matches", tags=["matches"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[dict])
def list_matches(team: str = Query(None), db: Session = Depends(get_db)):
    query = db.query(Match)
    
    if team:
        team_obj = db.query(Team).filter(Team.name.ilike(team)).first()
        if not team_obj:
            return []
        query = query.filter(
            (Match.home_team_id == team_obj.id) | (Match.away_team_id == team_obj.id)
        )
    
    matches = query.order_by(Match.time).all()
    result = []
    
    for m in matches:
        home_team = db.query(Team).get(m.home_team_id)
        away_team = db.query(Team).get(m.away_team_id)
        if team:
            if m.home_team_id == team_obj.id:
                my_team = home_team.name
                opponent = away_team.name
            else:
                my_team = away_team.name
                opponent = home_team.name
        else:
            my_team = home_team.name
            opponent = away_team.name
        result.append({
            "id": m.id,
            "team": my_team,
            "opponent": opponent,
            "time": m.time,
            "field": m.field
        })
    return result
