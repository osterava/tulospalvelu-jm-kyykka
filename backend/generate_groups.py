from app.db import SessionLocal
from app.models.team import Team
from app.models.group import GroupAssignment
from math import ceil

def generate_groups(max_teams_per_group=4):
    db = SessionLocal()

    try:
        teams = db.query(Team).order_by(Team.id).all()
        if not teams:
            print("Ei löytynyt joukkueita.")
            return

        db.query(GroupAssignment).delete()
        db.commit()

        total_teams = len(teams)
        num_groups = ceil(total_teams / max_teams_per_group)

        print(f"Luodaan {num_groups} lohkoa {total_teams} joukkueelle...")

        group_number = 1
        count_in_group = 0

        for team in teams:
            assignment = GroupAssignment(team_id=team.id, group_number=group_number)
            db.add(assignment)
            count_in_group += 1

            if count_in_group >= max_teams_per_group:
                group_number += 1
                count_in_group = 0

        db.commit()
        print(f"Kaikki joukkueet lisätty lohkoihin onnistuneesti!")

        assignments = db.query(GroupAssignment).order_by(GroupAssignment.group_number).all()
        for ga in assignments:
            team_name = db.query(Team).get(ga.team_id).name
            print(f"Lohko {ga.group_number}: {team_name}")

    finally:
        db.close()

if __name__ == "__main__":
    generate_groups()
