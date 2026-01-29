from app.db import SessionLocal
from app.routers import matches
from app.models.match import Match

db = SessionLocal()
try:
    group_numbers = [1, 2]
    for group_number in group_numbers:
        matches.generate_group_matches_endpoint(group_number, db)
finally:
    matches = db.query(Match).all()
    for m in matches:
        print(m.id, m.home_team_id, m.away_team_id, m.time, m.field)
    db.close()
