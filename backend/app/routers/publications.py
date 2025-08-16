from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ..database import engine
from ..models import Publication

router = APIRouter()


def get_session():
    with Session(engine) as session:
        yield session


@router.get("/publications", response_model=List[Publication])
def get_all_publications(session: Session = Depends(get_session)):
    publications = session.exec(select(Publication)).all()
    return publications
