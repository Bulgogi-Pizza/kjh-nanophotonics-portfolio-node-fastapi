from fastapi import FastAPI
from .routers import publications #, cv (나중에 추가)

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

# 라우터 등록
app.include_router(publications.router, prefix="/api")
# app.include_router(cv.router, prefix="/api")