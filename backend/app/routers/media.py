from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Media

router = APIRouter(prefix="/api/media", tags=["media"])


@router.get("/", response_model=List[Media])
def get_media(db: Session = Depends(get_db)):
    return db.query(Media).order_by(Media.date.desc()).all()


@router.post("/", response_model=Media)
def create_media(media: Media, db: Session = Depends(get_db)):
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


@router.put("/{media_id}", response_model=Media)
def update_media(media_id: int, media: Media, db: Session = Depends(get_db)):
    db_media = db.query(Media).filter(Media.id == media_id).first()
    if not db_media:
        raise HTTPException(status_code=404, detail="Media item not found")

    for key, value in media.dict(exclude_unset=True).items():
        setattr(db_media, key, value)

    db.commit()
    db.refresh(db_media)
    return db_media


@router.delete("/{media_id}")
def delete_media(media_id: int, db: Session = Depends(get_db)):
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media item not found")

    db.delete(media)
    db.commit()
    return {"message": "Media item deleted successfully"}
