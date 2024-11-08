from fastapi import FastAPI
from api import paper_routes

app = FastAPI()

app.include_router(paper_routes.router, prefix="/papers", tags=["papers"])