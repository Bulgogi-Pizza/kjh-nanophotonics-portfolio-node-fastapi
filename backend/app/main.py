from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import publications  # , cv (나중에 추가)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",  # React 개발 서버 주소
    "http://joohoonkim.site",
    "https://joohoonkim.site",
    "http://joohoonkim.site:5173",
    "https://joohoonkim.site:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)


@app.get("/")
def read_root():
    return {"message": "Portfolio API is running!"}


# /api 라는 접두사와 함께 publications 라우터를 앱에 포함시킵니다.
# 이제 /api/publications 경로로 요청을 보낼 수 있습니다.
app.include_router(publications.router, prefix="/api")
