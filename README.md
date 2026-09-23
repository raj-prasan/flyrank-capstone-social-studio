# 🚀 Flyrank — Social Media Studio

An AI-powered content repurposing studio that transforms long-form blog posts and articles into high-engagement, platform-tailored social media content for **X (formerly Twitter)**, **LinkedIn**, and **Instagram**.

Equipped with asynchronous background scheduling, idempotency protection, Telegram bot notifications, and full containerization via **Docker & Docker Compose**.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Quick Start with Docker](#-quick-start-with-docker-recommended)
- [Local Development Setup](#-local-development-setup)
- [API Reference](#-api-reference)
- [License](#-license)

---

## 🌟 Overview

Content creators and marketing teams spend hours manually reformatting articles into social posts. **Social Media Studio** streamlines this workflow:
1. **Ingest Content**: Submit raw article text or paste a URL for automated scraping.
2. **Generate Variants**: Leverages Google Gemini via Vercel AI SDK to craft custom post variants with platform-specific formatting, tone, character limits, and hashtags.
3. **Review & Refine**: Inspect live interactive mockups for X, LinkedIn, and Instagram. Approve or reject drafts.
4. **Schedule & Publish**: Schedule posts with BullMQ & Redis queues, broadcasting updates via Telegram.

---

## 🛠️ Architecture & Tech Stack

```
                     +---------------------------------------+
                     |         Browser / Client              |
                     |  (React 19 + Vite + Tailwind CSS 4)   |
                     +-------------------+-------------------+
                                         |
                                         | Reverse Proxy (/api, /health)
                                         v
                     +---------------------------------------+
                     |             Nginx Proxy               |
                     |         (Port 80 / 5173)              |
                     +-------------------+-------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| Server (Express.js + TypeScript + Node 22)                                        |
|                                                                                   |
|  * Gemini AI SDK       --> Text generation & platform adaptation                  |
|  * Cheerio & Axios     --> Web scraping & article parsing                         |
|  * Idempotency Guard   --> Duplicate prevention                                   |
|  * Telegram Bot        --> Notifications & subscriber broadcasts                  |
+-------------------+-------------------------------+-------------------------------+
                    |                               |
                    v                               v
    +-------------------------------+   +-------------------------------+
    |          PostgreSQL           |   |         Redis 7 Cache         |
    |  * Blogs & Social Posts       |   |  * BullMQ Job Queue           |
    |  * Idempotency Ledger         |   |  * Delayed Post Dispatcher    |
    +-------------------------------+   +-------------------------------+
```

### Technology Breakdown

- **Frontend (`/client`)**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Nginx.
- **Backend (`/server`)**: Node.js 22, Express.js 5, TypeScript, Vercel AI SDK (`@ai-sdk/google`), Cheerio, Axios.
- **Queue & Storage**: BullMQ, Redis 7 (Alpine), PostgreSQL (Neon / Local).
- **Integrations**: Google Gemini API, Telegram Bot API (`node-telegram-bot-api`).
- **DevOps**: Docker, Docker Compose, Multi-stage builds, Alpine Linux.

---

## ✨ Key Features

- **Multi-Format Ingestion**: Ingest articles via direct text or URL extraction powered by Cheerio.
- **Platform-Tailored Content**:
  - **X (Twitter)**: Concise hooks, punchy threads, under 280 characters with relevant tags.
  - **LinkedIn**: Thought-leadership tone, conversational spacing, value takeaways.
  - **Instagram**: Visual captions with call-to-actions and high-performing hashtags.
- **Concurrency & Idempotency Safety**: UUID idempotency key verification prevents duplicate AI generation costs and repeated database records.
- **Interactive Platform Studio**: Real-time realistic previews simulating how posts look on mobile/desktop feeds.
- **Automated Queue Dispatching**: BullMQ worker handles delayed scheduling and delivery workflows.
- **Telegram Broadcast**: Automated notifications sent directly to subscribed users.

---

## 📂 Project Structure

```bash
flyrank/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Studio, Stepper, Mockups, Modals
│   │   ├── lib/                # API client & utility functions
│   │   ├── types/              # TypeScript definitions
│   │   └── App.tsx             # Root application component
│   ├── Dockerfile              # Multi-stage build (Vite -> Nginx)
│   ├── nginx.conf              # Reverse proxy & SPA routing
│   └── package.json
│
├── server/                     # Backend API & Worker
│   ├── src/
│   │   ├── controllers/        # REST endpoints & business logic
│   │   ├── routes/             # Express API routes
│   │   ├── db/                 # Postgres & Redis connections
│   │   ├── lib/                # BullMQ queue & worker
│   │   ├── utils/              # AI prompt templates & scrapers
│   │   └── index.ts            # Server entrypoint
│   ├── Dockerfile              # Multi-stage build (TSC -> Node runner)
│   └── package.json
│
├── docker-compose.yml          # Container orchestration (Client, Server, Redis)
├── .env.example                # Sample environment configuration
└── README.md
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory (or in `server/.env.local` for local execution). You can base it on `.env.example`:

```ini
# Server Port
PORT=4000

# Redis Queue Connection
REDIS_HOST=redis
REDIS_PORT=6379

# Google Gemini AI Key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# PostgreSQL Database Connection String
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Telegram Bot Token (Optional for Telegram broadcasts)
BOT_TOKEN=your_telegram_bot_token_here
```

> [!NOTE]
> When running with **Docker Compose**, `REDIS_HOST` must be set to `redis`. When running **locally without Docker**, set `REDIS_HOST=127.0.0.1`.

---

## 🐳 Quick Start with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Clone & Setup Environment
```bash
cp .env.example .env
# Edit .env and supply your GOOGLE_GENERATIVE_AI_API_KEY and DATABASE_URL
```

### 2. Build and Start All Services
```bash
docker compose up --build
```
Or in detached mode (background):
```bash
docker compose up -d --build
```

### 3. Open in Browser
- **Frontend Studio**: [http://localhost:5173](http://localhost:5173) (or [http://localhost](http://localhost))
- **Backend API**: [http://localhost:4000](http://localhost:4000)
- **Health Check**: [http://localhost:4000/health](http://localhost:4000/health)

### 4. Stop Services
```bash
docker compose down
```
*(Add `-v` to also remove the persistent Redis volume: `docker compose down -v`)*

---

## 💻 Local Development Setup

If you prefer to run services individually without Docker:

### 1. Prerequisites
- **Node.js**: v20 or higher
- **Redis Server**: Running locally on `127.0.0.1:6379`
- **PostgreSQL**: Cloud (Neon) or local instance

### 2. Setup Server
```bash
cd server
npm install

# Create server/.env.local with your keys
npm run dev
# Server runs on http://localhost:4000 with live-reload (tsx)
```

### 3. Setup Client
```bash
cd ../client
npm install
npm run dev
# Client runs on http://localhost:5173 with Vite HMR
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check endpoint |
| `POST` | `/api/v1/new` | Ingest new blog content or scrape from URL |
| `POST` | `/api/v1/generate/:id` | Trigger AI generation of X, LinkedIn, and IG posts |
| `GET` | `/api/v1/blog/:id` | Retrieve blog details and ingested raw text |
| `GET` | `/api/v1/posts` | Fetch all generated posts (filter by `?user_id=`) |
| `GET` | `/api/v1/post/:id` | Fetch post variants and status by Post ID |
| `POST` | `/api/v1/review/:id` | Approve or reject post draft (`{ "status": "approved" }`) |
| `POST` | `/api/v1/publish/:id` | Schedule post for publishing (`{ "scheduledTime": "..." }`) |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
