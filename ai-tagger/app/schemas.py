"""Pydantic models for API request/response."""

from pydantic import BaseModel, HttpUrl


class TagRequest(BaseModel):
    """Request body for POST /tag."""

    image_url: HttpUrl


class TagResponse(BaseModel):
    """Response body for POST /tag."""

    tags: list[str]
