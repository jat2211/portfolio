"""FastAPI entry point for the AI Tagger service."""

from fastapi import FastAPI, HTTPException, Depends

from app.config import Settings, get_settings
from app.schemas import TagRequest, TagResponse
from app.services.gemini_service import GeminiService, ImageFetchError, GeminiTagError

app = FastAPI(title="AI Tagger", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    """Return service status."""
    return {"status": "ok"}


@app.post("/tag", response_model=TagResponse)
def tag(request: TagRequest, settings: Settings = Depends(get_settings)) -> TagResponse:
    """
    Analyze the image at the given URL and return descriptive tags.
    """
    service = GeminiService(settings)
    try:
        tags = service.tag_image(str(request.image_url))
        return TagResponse(tags=tags)
    except ImageFetchError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    except GeminiTagError as e:
        raise HTTPException(status_code=502, detail="Image analysis failed") from e
