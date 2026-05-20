# SoundScore

A music discovery and review web app built with Next.js. Search tracks via the Deezer API, listen to previews, and rate songs on a 0–10 scale with written reviews. User accounts use Firebase Authentication; reviews and catalog metadata are stored in Neon PostgreSQL.

## Features

- **Search** — Find songs by title or artist (Deezer via RapidAPI)
- **Song pages** — Album art, 30-second preview player, and community reviews
- **Reviews** — Logged-in users submit ratings (0–10) and comments; one review per user per song (upsert on re-submit)
- **Profile** — View account info and all reviews you have written
- **REST API** — CRUD endpoints for users, songs, and reviews (see [API routes](#api-routes))

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| UI | React 19, [Tailwind CSS](https://tailwindcss.com) |
| Auth | [Firebase Authentication](https://firebase.google.com/docs/auth) (email/password) |
| Database | [Neon](https://neon.tech) serverless PostgreSQL (`@neondatabase/serverless`) |
| Validation | [Zod](https://zod.dev) |
| Music data | Deezer API via [RapidAPI](https://rapidapi.com) |

## Prerequisites

- Node.js 18+
- A [Firebase](https://console.firebase.google.com) project with Email/Password auth enabled
- A [Neon](https://neon.tech) database
- A [RapidAPI](https://rapidapi.com) subscription to the Deezer API host (`deezerdevs-deezer.p.rapidapi.com`)

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/soundscore.git
cd soundscore
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string (server-only) |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web app config from the Firebase console |
| `RAPIDAPI_KEY` | RapidAPI key (server-only; proxied through `/api/music`) |
| `RAPIDAPI_HOST` | Optional; defaults to `deezerdevs-deezer.p.rapidapi.com` |

Never commit `.env.local` or real API keys to git.

### 3. Database schema

Create these tables in Neon (adjust types if needed):

```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL
);

CREATE TABLE songs (
  song_id BIGINT PRIMARY KEY,
  song_name VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  album VARCHAR(255)
);

CREATE TABLE reviews (
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  song_id BIGINT NOT NULL REFERENCES songs(song_id),
  review_title VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 10),
  review_date DATE NOT NULL,
  review_body TEXT NOT NULL,
  PRIMARY KEY (user_id, song_id)
);
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
npm start
```

## Project structure

```
src/
├── app/
│   ├── api/          # REST routes (users, songs, reviews, music proxy)
│   ├── home/         # Landing page with search
│   ├── login/        # Sign in and sign up
│   ├── profile/      # User profile and review history
│   ├── search/       # Search results
│   ├── song/[id]/    # Song detail and reviews
│   └── _utils/       # Firebase config and auth context
├── components/       # Shared UI (e.g. MusicPlayer)
└── services/         # Client helpers (music API wrappers)
```

## API routes

HTTP examples for local testing live in [`src/app/api/test.http`](src/app/api/test.http).

| Resource | Endpoints |
|----------|-----------|
| **Users** | `GET/POST /api/users`, `GET/POST/DELETE /api/users/[id]`, `GET /api/users/email/[email]` |
| **Songs** | `GET/POST /api/songs`, `GET/POST/DELETE /api/songs/[id]`, artist/album/date filters |
| **Reviews** | `POST /api/reviews`, `GET /api/reviews/song/[id]`, `GET /api/reviews/user/[id]`, per-user-per-song CRUD |
| **Music** | `GET /api/music/search?q=...`, `GET /api/music/track/[id]` (Deezer proxy) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint (Next.js config) |

## Deployment

Deploy to [Vercel](https://vercel.com) or any Node host that supports Next.js:

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add the same environment variables as in `.env.local`.
4. Deploy.

Ensure Firebase authorized domains include your production URL.

## Security notes

- Music API keys are called only from server routes (`/api/music/*`), not from the browser.
- Review POST endpoints do not verify Firebase sessions today; consider adding middleware or server-side token checks before production use.
- Rotate any API key that was previously committed to git history.

## License

Add a `LICENSE` file (e.g. MIT) if you plan to open-source this repository.
