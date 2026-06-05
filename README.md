# 4oSphere

4oSphere is the GPT-4o-only edition of the web chat app described in
`docs/PROJECT_SPEC.md`.

## Phase 0 foundation

This repository currently contains the Next.js, TypeScript, Tailwind CSS,
component, linting, formatting, environment, Supabase browser-client foundation,
and the Phase 1 app shell.

## Local setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set these public Supabase values in `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not put Supabase service-role keys or private provider secrets in public
client environment variables.

## Verification

```powershell
npm run lint
npm run typecheck
npm run build
npm run verify
```

`npm run verify` runs the minimal lint and typecheck gate. Run
`npm run build` separately for production build verification.
