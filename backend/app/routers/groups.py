# app/routers/groups.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.group import GroupAssignment
from app.schemas.group import GroupAssignmentCreate, GroupAssignment as GroupAssignmentSchema

router = APIRouter(prefix="/groups", tags=["groups"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=GroupAssignmentSchema)
def create_group_assignment(assignment: GroupAssignmentCreate, db: Session = Depends(get_db)):
    db_assignment = GroupAssignment(**assignment.dict())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@router.get("/", response_model=list[int])
def get_all_groups(db: Session = Depends(get_db)):
    group_numbers = db.query(GroupAssignment.group_number).distinct().order_by(GroupAssignment.group_number).all()
    return [g[0] for g in group_numbers]
