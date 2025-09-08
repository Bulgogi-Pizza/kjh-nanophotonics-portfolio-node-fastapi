import shutil
from datetime import datetime
from pathlib import Path
from typing import List

from app.database import get_db
from app.models import ResearchHighlight
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import File, UploadFile
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/research-highlights",
                   tags=["research-highlights"])

UPLOAD_DIR_HL = Path("../frontend/static/uploads/research-highlights")
UPLOAD_DIR_HL.mkdir(parents=True, exist_ok=True)


@router.get("/", response_model=List[ResearchHighlight])
def list_research_highlights(
    active_only: bool = Query(False, description="True면 is_active 항목만"),
    db: Session = Depends(get_db)
):
    query = db.query(ResearchHighlight)
    if active_only:
        query = query.filter(ResearchHighlight.is_active == True)
    return query.order_by(
        ResearchHighlight.order_index.asc(),
        ResearchHighlight.id.desc()
    ).all()


@router.get("/{item_id}", response_model=ResearchHighlight)
def get_research_highlight(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ResearchHighlight).filter(
        ResearchHighlight.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404,
                            detail="ResearchHighlight not found")
    return item


@router.post("/", response_model=ResearchHighlight)
def create_research_highlight(item: ResearchHighlight,
    db: Session = Depends(get_db)):
    item.updated_at = datetime.utcnow()
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=ResearchHighlight)
def update_research_highlight(
    item_id: int,
    patch: ResearchHighlight,
    db: Session = Depends(get_db)
):
    db_item = db.query(ResearchHighlight).filter(
        ResearchHighlight.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404,
                            detail="ResearchHighlight not found")

    for k, v in patch.dict(exclude_unset=True).items():
        if k != "id":
            setattr(db_item, k, v)
    db_item.updated_at = datetime.utcnow()

    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.delete("/{item_id}")
def delete_research_highlight(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ResearchHighlight).filter(
        ResearchHighlight.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404,
                            detail="ResearchHighlight not found")
    db.delete(item)
    db.commit()
    return {"message": "ResearchHighlight deleted successfully"}


@router.post("/upload-image")
async def upload_highlight_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = UPLOAD_DIR_HL / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 프론트에서 직접 <img src=...> 로 사용
    return {"image_path": f"/static/uploads/research-highlights/{filename}"}
