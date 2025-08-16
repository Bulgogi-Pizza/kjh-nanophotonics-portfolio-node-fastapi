from typing import List
from fastapi import APIRouter
from sqlmodel import Session, select
from ..models import Publication
from ..database import engine

router = APIRouter()

@router.get("/publications", response_model=List[Publication])
def get_publications():
    with Session(engine) as session:
        publications = session.exec(select(Publication)).all()
        return publications