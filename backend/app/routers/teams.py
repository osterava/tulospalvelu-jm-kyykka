from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.db import SessionLocal
from app.models.team import Team
from app.models.match import Match
from app.models.group import GroupAssignment
from app.schemas.team_detail import TeamDetail, MatchInfo, StandingEntry
from urllib.parse import unquote

router = APIRouter(prefix="/teams", tags=["teams"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[str])
def list_teams(db: Session = Depends(get_db)):
    teams = db.query(Team).all()
    return [t.name for t in teams]


@router.get("/{team_name}")
def get_team_basic(team_name: str, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.name == team_name).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return {"team": team.name, "city": team.city}


@router.get("/{team_name}/details", response_model=TeamDetail)
def get_team_detail(team_name: str, db: Session = Depends(get_db)):
    decoded_name = unquote(team_name)

    team = db.query(Team).filter(Team.name == decoded_name).first()
    if not team:
        raise HTTPException(status_code=404, detail=f"Team '{decoded_name}' not found")

    group_assignment = db.query(GroupAssignment).filter(GroupAssignment.team_id == team.id).first()
    if not group_assignment:
        raise HTTPException(status_code=404, detail="Team not assigned to any group")
    group_number = group_assignment.group_number

    group_assignments = db.query(GroupAssignment).filter(GroupAssignment.group_number == group_number).all()
    group_team_ids = [ga.team_id for ga in group_assignments]

    teams_in_group = db.query(Team).filter(Team.id.in_(group_team_ids)).all()
    team_id_to_name = {t.id: t.name for t in teams_in_group}

    group_teams = [
        StandingEntry(
            team=team_id_to_name[ga.team_id],
            wins=ga.wins,
            losses=ga.losses,
            draws=ga.draws,
            points=ga.points,
            total_score=ga.total_score
        )
        for ga in group_assignments
    ]

    upcoming_matches = db.query(Match).filter(
    (Match.home_team_id == team.id) | (Match.away_team_id == team.id)
    ).order_by(Match.time).all()

    upcoming_matches_list = [
        MatchInfo(
            id=m.id,
            home_team=db.query(Team).get(m.home_team_id).name,
            away_team=db.query(Team).get(m.away_team_id).name,
            time=m.time,
            field=m.field
        )
        for m in upcoming_matches
    ]

    return TeamDetail(
        team=team.name,
        group=group_number,
        upcoming_matches=upcoming_matches_list,
        group_teams=group_teams
    )
