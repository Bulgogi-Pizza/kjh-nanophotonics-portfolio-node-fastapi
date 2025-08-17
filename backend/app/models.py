from datetime import datetime
from typing import Optional

from pydantic import ConfigDict
from sqlmodel import SQLModel, Field


class Education(SQLModel, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: Optional[int] = Field(default=None, primary_key=True)
    degree: str
    institution: str
    location: str
    start_year: str
    end_year: str
    advisor: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Experience(SQLModel, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: Optional[int] = Field(default=None, primary_key=True)
    position: str
    organization: str
    location: str
    start_year: str
    end_year: str
    description: Optional[str] = None
    host_advisor: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Award(SQLModel, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    organization: str
    location: str
    year: str
    rank: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Publication(SQLModel, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: Optional[int] = Field(default=None, primary_key=True)
    number: int  # 논문 번호 (내림차순)
    title: str
    authors: str  # 전체 저자 리스트
    journal: str
    volume: Optional[str] = None
    pages: Optional[str] = None
    year: str
    month: Optional[str] = None
    doi: Optional[str] = None
    arxiv: Optional[str] = None

    # 기여도 분류
    is_first_author: bool = Field(default=False)
    is_corresponding_author: bool = Field(default=False)
    is_equal_contribution: bool = Field(default=False)
    contribution_type: str = Field(
        default="co-author")  # first-author, corresponding, co-author

    # 상태
    status: str = Field(
        default="published")  # published, under-submission, in-press, in-review

    # 추가 정보
    impact_factor: Optional[float] = None
    featured_info: Optional[str] = None  # Cover article, News & Views 등

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Conference(SQLModel, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    conference_name: str
    location: str
    date: str
    presentation_type: str
    award: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Media(SQLModel, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    source: str
    date: str
    url: Optional[str] = None
    description: Optional[str] = None
    category: str = Field(default="news")
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CVContent(SQLModel, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: Optional[int] = Field(default=None, primary_key=True)
    section: str
    title: str
    content: str  # Text 대신 str 사용
    order_index: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class GalleryImage(SQLModel, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    image_url: str
    alt_text: Optional[str] = None
    order_index: int = Field(default=0)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
