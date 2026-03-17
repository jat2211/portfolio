# Photo Workspace

Photo gallery and AI tagging workspace: React frontend plus a FastAPI service that tags images using Google Gemini.

## Structure

- **frontend** — React + Vite + TypeScript + Tailwind. Gallery UI (horizontal gallery, folders) with a “Record Store” style.
- **ai-tagger** — FastAPI service that fetches an image by URL and returns descriptive tags via Gemini.

## Quick start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173` (or the port Vite reports).

### AI Tagger (backend)

Requires Python 3.12+ and a [Google AI API key](https://aistudio.google.com/apikey).

```bash
cd ai-tagger
uv sync   # or: pip install -e .
```

Create `ai-tagger/.env`:

```
GEMINI_API_KEY=your_key_here
```

Optional: `MODEL_ID=gemini-1.5-flash` (default).

Run the server:

```bash
uv run uvicorn app.main:app --reload
```

API:

- `GET /health` — health check
- `POST /tag` — body: `{"image_url": "https://..."}` → returns `{"tags": ["tag1", "tag2", ...]}`

## Tech

- **Frontend:** React 19, Vite 8, TypeScript, Tailwind CSS, Framer Motion, Axios
- **AI Tagger:** FastAPI, Google Generative AI (Gemini), Pillow, Pydantic Settings, Uvicorn
