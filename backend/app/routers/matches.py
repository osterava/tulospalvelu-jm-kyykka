from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from itertools import combinations
from app.db import SessionLocal
from app.models.team import Team
from app.models.match import Match
from app.models.group import GroupAssignment

router = APIRouter(prefix="/matches", tags=["matches"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def generate_round_robin_matches(team_names, start_time="10:00", field="kenttä 1", date=None):
    """Generoi round-robin ottelut lohkon sisällä"""
    if len(team_names) > 4:
        raise ValueError("Maksimissaan 4 joukkuetta per lohko")
    if date is None:
        date = datetime.today().date()
    hour, minute = map(int, start_time.split(":"))
    current_time = datetime.combine(date, datetime.min.time()).replace(hour=hour, minute=minute)

    matches = []
    for pair in combinations(team_names, 2):
        matches.append({
            "home_team": pair[0],
            "away_team": pair[1],
            "time": current_time,
            "field": field
        })
        current_time += timedelta(minutes=30)
    return matches


@router.post("/generate_group/{group_number}", response_model=list[dict])
def generate_group_matches_endpoint(group_number: int, db: Session = Depends(get_db)):
    created_matches = create_group_matches(db, group_number)
    return [
        {
            "id": m.id,
            "home_team": m.home_team.name,
            "away_team": m.away_team.name,
            "time": m.time,
            "field": m.field
        }
        for m in created_matches
    ]


def create_group_matches(db: Session, group_number: int, field: str = "Kenttä 1"):
    """
    Luo lohkon ottelut tietokantaan.
    Maksimissaan 4 joukkuetta per lohko.
    Palauttaa luodut Match-objektit listana.
    """
    assignments = db.query(GroupAssignment).filter(GroupAssignment.group_number == group_number).all()
    if not assignments:
        return []

    team_names = [db.query(Team).get(ga.team_id).name for ga in assignments]
    matches_to_create = generate_round_robin_matches(team_names, field=field)

    created_matches = []
    for m in matches_to_create:
        home_obj = db.query(Team).filter(Team.name == m["home_team"]).first()
        away_obj = db.query(Team).filter(Team.name == m["away_team"]).first()
        existing = db.query(Match).filter(
            (Match.home_team_id == home_obj.id) &
            (Match.away_team_id == away_obj.id) &
            (Match.time == m["time"])
        ).first()
        if existing:
            continue

        match_obj = Match(
            home_team_id=home_obj.id,
            away_team_id=away_obj.id,
            time=m["time"],
            field=m["field"]
        )
        db.add(match_obj)
        db.commit()
        db.refresh(match_obj)
        created_matches.append(match_obj)

    return created_matches

@router.get("/team/{team_id}", response_model=list[dict])
def get_team_matches(team_id: int, db: Session = Depends(get_db)):
    """
    Hakee kaikki joukkueen ottelut (tulevat ja menneet) tietokannasta.
    """
    team_obj = db.query(Team).get(team_id)
    if not team_obj:
        raise HTTPException(status_code=404, detail="Joukkuetta ei löytynyt")

    matches = db.query(Match).filter(
        (Match.home_team_id == team_obj.id) | (Match.away_team_id == team_obj.id)
    ).order_by(Match.time).all()

    result = []
    for m in matches:
        home_team = db.query(Team).get(m.home_team_id).name
        away_team = db.query(Team).get(m.away_team_id).name
        result.append({
            "id": m.id,
            "home_team": home_team,
            "away_team": away_team,
            "time": m.time,
            "field": m.field
        })

    return result

class MatchScoreUpdate(BaseModel):
    home_score: int
    away_score: int

@router.post("/{match_id}/score")
def set_match_score(match_id: int, score: MatchScoreUpdate, db: Session = Depends(get_db)):
    """
    Päivittää ottelun tuloksen ja lohkopisteet.
    """
    match = db.query(Match).get(match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Ottelua ei löytynyt")

    match.home_score = score.home_score
    match.away_score = score.away_score
    db.commit()
    db.refresh(match)

    home_group = db.query(GroupAssignment).filter(GroupAssignment.team_id == match.home_team_id).first()
    away_group = db.query(GroupAssignment).filter(GroupAssignment.team_id == match.away_team_id).first()

    if score.home_score > score.away_score:
        home_group.wins += 1
        home_group.points += 3
        away_group.losses += 1
    elif score.home_score < score.away_score:
        away_group.wins += 1
        away_group.points += 3
        home_group.losses += 1
    else: 
        home_group.draws += 1
        away_group.draws += 1
        home_group.points += 1
        away_group.points += 1

    home_group.total_score += score.home_score
    away_group.total_score += score.away_score

    db.commit()

    return {
        "id": match.id,
        "home_team_id": match.home_team_id,
        "away_team_id": match.away_team_id,
        "home_score": match.home_score,
        "away_score": match.away_score,
        "field": match.field,
        "time": match.time,
        "updated_group": {
            home_group.team_id: {
                "wins": home_group.wins,
                "losses": home_group.losses,
                "draws": home_group.draws,
                "points": home_group.points,
                "total_score": home_group.total_score
            },
            away_group.team_id: {
                "wins": away_group.wins,
                "losses": away_group.losses,
                "draws": away_group.draws,
                "points": away_group.points,
                "total_score": away_group.total_score
            }
        }
    }

@router.get("/group/{group_number}", response_model=list[dict])
def get_group_matches(group_number: int, db: Session = Depends(get_db)):
    """
    Palauttaa kaikki ottelut tietylle lohkolle (tulevat ja menneet)
    """

    assignments = db.query(GroupAssignment).filter(GroupAssignment.group_number == group_number).all()
    if not assignments:
        raise HTTPException(status_code=404, detail="Lohkoa ei löytynyt")

    team_ids = [ga.team_id for ga in assignments]

    matches = db.query(Match).filter(
        (Match.home_team_id.in_(team_ids)) | (Match.away_team_id.in_(team_ids))
    ).order_by(Match.time).all()

    result = []
    for m in matches:
        home_team = db.query(Team).get(m.home_team_id).name
        away_team = db.query(Team).get(m.away_team_id).name
        result.append({
            "id": m.id,
            "home_team": home_team,
            "away_team": away_team,
            "time": m.time,
            "field": m.field
        })

    return result