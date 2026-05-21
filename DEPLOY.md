# Deploy SoundScore to Vercel

## 1. Push to GitHub

Ensure your latest code is on GitHub (main branch).

## 2. Create a Vercel project

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** → **Project**.
3. Import the `soundscore` repository.
4. Framework preset: **Next.js** (auto-detected).
5. Root directory: `.` (default).

## 3. Environment variables

In **Project Settings → Environment Variables**, add these for **Production**, **Preview**, and **Development**:

| Name | Where to get it |
|------|-----------------|
| `DATABASE_URL` | [Neon](https://neon.tech) → Connection string |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project settings → Your apps |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Same |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Same |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Same |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Same |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Same |
| `RAPIDAPI_KEY` | [RapidAPI](https://rapidapi.com) → Deezer API subscription |

Optional: `RAPIDAPI_HOST` (defaults to `deezerdevs-deezer.p.rapidapi.com`).

Copy from `.env.example` — never paste secrets in the repo.

**Important:** Add variables for **Production**, **Preview**, and **Development** scopes. A missing `NEXT_PUBLIC_FIREBASE_API_KEY` causes build failures or broken sign-in.

After adding or changing env vars, click **Redeploy** so the build picks them up.

## 4. Database

In the Neon SQL editor, run the script in [`db/schema.sql`](db/schema.sql).

## 5. Firebase authorized domains

Firebase Console → **Authentication** → **Settings** → **Authorized domains**:

- Add your Vercel URL, e.g. `soundscore.vercel.app`
- Add any custom domain you attach later

Enable **Email/Password** sign-in under Sign-in method.

## 6. Deploy

Click **Deploy**. Vercel runs `npm run build` automatically.

After deploy, open the production URL and test:

- Search for a song
- Sign up / sign in
- Submit a review on a song page
- View reviews on your profile

## 7. Custom domain (optional)

Vercel → **Settings** → **Domains** → add your domain, then add that domain to Firebase authorized domains.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Music search fails | Check `RAPIDAPI_KEY` is set on Vercel and the RapidAPI subscription is active |
| Auth errors | Confirm all `NEXT_PUBLIC_FIREBASE_*` vars match Firebase web app config |
| Reviews not saving | Verify `DATABASE_URL` and that `db/schema.sql` was applied in Neon |
| Build fails locally | Run `npm run build`; fix any ESLint errors |
