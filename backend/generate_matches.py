from app.db import SessionLocal
from app.routers import matches
from app.models.match import Match
from app.models.group import GroupAssignment

db = SessionLocal()
try:
    group_numbers = db.query(GroupAssignment.group_number).distinct().order_by(GroupAssignment.group_number).all()
    group_numbers = [g[0] for g in group_numbers]

    for idx, group_number in enumerate(group_numbers, start=1):
        field_name = f"Kenttä {idx}"
        print(f"Generoidaan ottelut lohkolle {group_number} ({field_name})")
        matches.create_group_matches(db, group_number, field=field_name)

finally:
    all_matches = db.query(Match).order_by(Match.time).all()
    for m in all_matches:
        print(m.id, m.home_team_id, m.away_team_id, m.time, m.field)
    db.close()

