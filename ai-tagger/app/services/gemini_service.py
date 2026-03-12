"""Gemini API service for image tagging."""

import io
import json
import re
from typing import Any

import google.generativeai as genai
import httpx
from PIL import Image

from app.config import Settings

SYSTEM_PROMPT = (
    "Act as a professional photo archivist. Analyze the image and return a JSON array "
    "of 5-10 tags. Focus on subject, lighting, mood, and composition. "
    "Return ONLY a raw JSON array of strings."
)
USER_PROMPT = (
    "Analyze this image and return a JSON array of 5-10 descriptive tags. "
    "Focus on subject, lighting, mood, and composition. Return ONLY a raw JSON array of strings."
)

# Max image size to fetch (7 MB is within Gemini limits)
MAX_IMAGE_BYTES = 7 * 1024 * 1024
HTTP_TIMEOUT = 15.0


class ImageFetchError(Exception):
    """Raised when the image cannot be fetched or is invalid."""

    pass


class GeminiTagError(Exception):
    """Raised when Gemini API fails or returns unparseable output."""

    pass


class GeminiService:
    """Service that fetches an image from a URL and returns tags via Gemini 1.5 Flash."""

    def __init__(self, settings: Settings | None = None) -> None:
        self._settings = settings or Settings()
        genai.configure(api_key=self._settings.gemini_api_key)
        model_name = self._settings.model_id
        if not model_name.startswith("models/"):
            model_name = f"models/{model_name}"
        self._model = genai.GenerativeModel(
            model_name,
            system_instruction=SYSTEM_PROMPT,
        )

    def tag_image(self, image_url: str) -> list[str]:
        """
        Fetch the image from image_url, send it to Gemini, and return a list of tags.

        Raises:
            ImageFetchError: When the URL is unreachable or the response is not a valid image.
            GeminiTagError: When the Gemini API fails or the response is not valid JSON.
        """
        image_bytes, mime_type = self._fetch_image(image_url)
        image_part = self._image_to_part(image_bytes, mime_type)
        response_text = self._call_gemini(image_part)
        return self._parse_tags(response_text)

    def _fetch_image(self, image_url: str) -> tuple[bytes, str]:
        """Fetch image bytes from URL and return (bytes, mime_type)."""
        try:
            with httpx.Client(timeout=HTTP_TIMEOUT) as client:
                response = client.get(image_url)
                response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise ImageFetchError(f"Image URL returned {e.response.status_code}") from e
        except httpx.RequestError as e:
            raise ImageFetchError(f"Failed to fetch image: {e!s}") from e

        content = response.content
        if len(content) > MAX_IMAGE_BYTES:
            raise ImageFetchError(f"Image too large (max {MAX_IMAGE_BYTES} bytes)")

        try:
            img = Image.open(io.BytesIO(content))
            img.verify()
        except Exception as e:
            raise ImageFetchError(f"Invalid or unsupported image: {e!s}") from e

        mime_type = response.headers.get("content-type", "").split(";")[0].strip()
        if not mime_type or mime_type == "application/octet-stream":
            fmt = img.format
            mime_type = f"image/{fmt.lower()}" if fmt else "image/jpeg"
        return content, mime_type

    def _image_to_part(self, image_bytes: bytes, mime_type: str) -> Any:
        """Build a part suitable for generate_content (PIL or inline data)."""
        img = Image.open(io.BytesIO(image_bytes))
        return img

    def _call_gemini(self, image_part: Any) -> str:
        """Call Gemini with the image and return the raw text response."""
        try:
            response = self._model.generate_content([image_part, USER_PROMPT])
        except Exception as e:
            raise GeminiTagError(f"Gemini API error: {e!s}") from e

        if not response.text:
            raise GeminiTagError("Gemini returned empty response")
        return response.text

    def _parse_tags(self, response_text: str) -> list[str]:
        """Extract a list of strings from model output (strip markdown if present)."""
        text = response_text.strip()
        # Remove optional markdown code fence
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if match:
            text = match.group(1).strip()
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError as e:
            raise GeminiTagError(f"Invalid JSON from model: {e!s}") from e
        if not isinstance(parsed, list):
            raise GeminiTagError("Model did not return a JSON array")
        tags = [str(item).strip() for item in parsed if item]
        return tags[:10] if len(tags) > 10 else tags
