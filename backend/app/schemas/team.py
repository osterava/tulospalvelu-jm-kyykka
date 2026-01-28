from pydantic import BaseModel

class TeamBase(BaseModel):
    name: str
    city: str | None = None

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int

    class Config:
        from_attributes = True