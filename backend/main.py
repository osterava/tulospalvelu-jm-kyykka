from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app.routers import teams, matches, groups, login
from app.test_data import insert_test_data

app = FastAPI(title="JM-Kyykkä Tulospalvelu API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app.include_router(login.router)
app.include_router(teams.router)
app.include_router(matches.router)
app.include_router(groups.router)

