import shutil
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from app.database import get_db
from app.models import RepresentativeWork
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/representative-works",
                   tags=["representative-works"])

# 업로드 디렉토리 설정
UPLOAD_DIR = Path("../frontend/static/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/", response_model=List[RepresentativeWork])
def get_representative_works(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(RepresentativeWork)
    if active_only:
        query = query.filter(RepresentativeWork.is_active == True)
    return query.order_by(RepresentativeWork.order_index.asc()).all()


@router.get("/{work_id}", response_model=RepresentativeWork)
def get_representative_work(work_id: int, db: Session = Depends(get_db)):
    work = db.query(RepresentativeWork).filter(
        RepresentativeWork.id == work_id).first()
    if not work:
        raise HTTPException(status_code=404,
                            detail="Representative work not found")
    return work


@router.post("/", response_model=RepresentativeWork)
def create_representative_work(work: RepresentativeWork,
    db: Session = Depends(get_db)):
    work.updated_at = datetime.utcnow()
    db.add(work)
    db.commit()
    db.refresh(work)
    return work


@router.put("/{work_id}", response_model=RepresentativeWork)
def update_representative_work(
    work_id: int,
    work_data: RepresentativeWork,
    db: Session = Depends(get_db)):
    work = db.query(RepresentativeWork).filter(
        RepresentativeWork.id == work_id).first()
    if not work:
        raise HTTPException(status_code=404,
                            detail="Representative work not found")

    for key, value in work_data.dict(exclude_unset=True).items():
        if key != "id":
            setattr(work, key, value)

    work.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(work)
    return work


@router.delete("/{work_id}")
def delete_representative_work(work_id: int, db: Session = Depends(get_db)):
    work = db.query(RepresentativeWork).filter(
        RepresentativeWork.id == work_id).first()
    if not work:
        raise HTTPException(status_code=404,
                            detail="Representative work not found")

    db.delete(work)
    db.commit()
    return {"message": "Representative work deleted successfully"}


@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")

    # 파일명 생성 (타임스탬프 + 원본 파일명)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = UPLOAD_DIR / filename

    # 파일 저장
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"image_path": f"static/uploads/{filename}"}


@router.get("/gallery/")
def get_gallery_images(
    category: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    return []
