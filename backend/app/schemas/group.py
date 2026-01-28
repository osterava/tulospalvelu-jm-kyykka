from pydantic import BaseModel

class GroupAssignmentBase(BaseModel):
    team_id: int
    group_number: int
    wins: int
    losses: int
    draws: int
    points: int
    total_score: int


class GroupAssignmentCreate(GroupAssignmentBase):
    pass


class GroupAssignment(GroupAssignmentBase):
    id: int

    class Config:
        from_attributes = True
