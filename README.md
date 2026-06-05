# 4oSphere

4oSphere is the GPT-4o-only edition of the web chat app described in
`docs/PROJECT_SPEC.md`.

## Phase 0 foundation

This repository currently contains the Next.js, TypeScript, Tailwind CSS,
component, linting, formatting, environment, Supabase Auth wiring, and the
Phase 1 app shell.

## Local setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set these public Supabase values in `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is preferred. The legacy
`NEXT_PUBLIC_SUPABASE_ANON_KEY` remains supported as a fallback for existing
local environments.

Do not put Supabase service-role keys or private provider secrets in public
client environment variables.

## Google OAuth setup

Google login also requires repo-external provider configuration:

- Enable the Google provider in the Supabase Dashboard.
- Create a Google Cloud OAuth web client and copy its client ID and client
  secret into the Supabase Google provider settings.
- Add the local callback URL to the Supabase redirect allow list:
  `http://localhost:3000/auth/callback`.
- After deployment, add the production callback URL as well:
  `https://<your-production-domain>/auth/callback`.

The app exchanges the OAuth callback code at `/auth/callback`, refreshes
Supabase Auth cookies through the Next.js proxy, and upserts the signed-in user
into the existing `profiles` table.

## Verification

```powershell
npm run lint
npm run typecheck
npm run build
npm run verify
```

`npm run verify` runs the minimal lint and typecheck gate. Run
`npm run build` separately for production build verification.
