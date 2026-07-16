# VisualSense

> **See Beyond the Pixels.**

https://github.com/Mohsin-FIDai/VisualSense/raw/main/VisualSense.mp4

VisualSense is an AI Visual Intelligence Platform. Upload any image — documents, screenshots, charts, handwritten notes, receipts, landscapes, medical reports, code, math equations, or anything else — and let AI understand everything inside it. Then chat naturally to explore, extract, and learn more.

---

## ✨ Features

- **Universal Image Understanding** — Upload any image and get instant AI-powered analysis
- **Structured Insights** — Scene summary, object detection, OCR, color analysis, face detection, logo recognition, safety assessment, and more
- **Natural Conversation** — Ask follow-up questions with full context awareness
- **Streaming Responses** — Real-time AI responses via Server-Sent Events
- **Premium Workspace UI** — Split-panel workspace with image viewer + conversation
- **Image Tools** — Zoom, pan, rotate, fullscreen, metadata inspection
- **Dynamic Design** — Animated gradients, glassmorphism, particles, and micro-interactions

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Framer Motion | Animations |
| React Query | Server state |
| Zustand | Client state |
| React Dropzone | File uploads |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.12 | Runtime |
| FastAPI | API framework |
| SQLAlchemy (async) | ORM |
| Pydantic | Validation |
| OpenAI GPT-4o | AI Vision |
| Redis | Caching |
| Uvicorn | ASGI server |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- OpenAI API key with GPT-4o access
- Redis (optional, falls back to in-memory)

### 1. Clone & Configure

```bash
cd visualsense
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 2. Start Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Open

Visit [http://localhost:3000](http://localhost:3000)

API docs at [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🐳 Docker

```bash
cp .env.example .env
# Edit .env with your OPENAI_API_KEY
docker-compose up --build
```

---

## 📁 Project Structure

```
visualsense/
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/            # Pages & layouts
│   │   ├── components/     # React components
│   │   ├── lib/            # API client & utilities
│   │   ├── stores/         # Zustand state
│   │   ├── hooks/          # Custom hooks
│   │   └── types/          # TypeScript types
│   └── Dockerfile
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # Route handlers
│   │   ├── ai/             # AI service layer
│   │   ├── core/           # Config & logging
│   │   ├── db/             # Database setup
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── storage/        # File storage
│   │   └── middleware/     # Request middleware
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/upload` | Upload image & trigger analysis |
| `POST` | `/api/v1/chat` | Send chat message (SSE stream) |
| `POST` | `/api/v1/session` | Create new session |
| `GET` | `/api/v1/session/{id}` | Get session details |
| `DELETE` | `/api/v1/session/{id}` | Delete session |
| `GET` | `/api/v1/history` | List all sessions |
| `GET` | `/api/v1/health` | Health check |

---

## 📄 License

MIT
