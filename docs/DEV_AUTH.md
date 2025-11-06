Dev JWT / Auto-login — Documentation

This document explains the temporary development convenience I added to the project to make it easy to test authenticated endpoints using a JWT obtained from Postman (or any other client). It lists exactly what changed, how to use it, security considerations, and how to remove/disable it.

Files touched
- `src/main.tsx` — added a small dev-only bootstrap that seeds `localStorage.accessToken` and (optionally) `localStorage.user` from environment variables `VITE_DEV_JWT` and `VITE_DEV_USER_JSON`. It also attempts to call `/users/me` to validate/refresh the `user` object.
- `src/api/services/postService.ts` — added diagnostic console logging and improved error extraction for create failures so UI alerts show the backend message.
- `src/pages/Posts.tsx` — changed the create error alert to display the real message thrown by the service.

Purpose
- Let you paste a JWT into an environment variable (or the optional user JSON) during development so the app automatically sends the `Authorization: Bearer <token>` header with API requests.
- Avoids repeatedly copying tokens into `localStorage` manually when testing.

How it works (summary)
- At startup (development only) `main.tsx` reads `import.meta.env.VITE_DEV_JWT` and `import.meta.env.VITE_DEV_USER_JSON`.
- If `VITE_DEV_JWT` exists the code stores it in `localStorage.accessToken` so the axios interceptor automatically attaches it to outgoing requests.
- If `VITE_DEV_USER_JSON` is provided and valid JSON, it stores that in `localStorage.user` immediately. Otherwise the code attempts to call `/users/me` (via `authService.getCurrentUser`) to fetch and store the user.

How to use (safe development flow)

1) Add dev vars (do NOT commit this file)

Create a `.env.local` (or `.env`) in the project root (same folder as `package.json`).

Example `.env.local` (do NOT commit):

```
VITE_DEV_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_jwt_here
# optional: initial user JSON (must be valid JSON, no newlines)
VITE_DEV_USER_JSON={"id":4,"username":"dev","email":"dev@example.com"}
```

2) Restart the dev server

After editing env files restart Vite so the env vars are available in `import.meta.env`.

```
# from project root
pnpm dev
# or
npm run dev
```

3) Confirm seeding happened

Open the browser DevTools console on your app and look for logs such as:

```
[DEV] seeded accessToken and user from VITE_DEV_JWT
```

If there's a warning like `could not fetch /users/me`, it means the token was set but Strapi didn't accept it when calling `/users/me` (the token could be expired or invalid).

4) Use the app normally

With the token seeded, the axios interceptors automatically attach `Authorization: Bearer <token>` to outgoing requests. Create a post from the UI or call endpoints with your browser session.

Commands to test manually (curl)

Get the current user with your JWT (verify token works):

```
curl -i -X GET 'http://localhost:1337/api/users/me' \
  -H "Authorization: Bearer <PASTE_JWT_HERE>"
```

Create a post with the token (let Strapi set the author):

```
curl -i -X POST 'http://localhost:1337/api/posts' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PASTE_JWT_HERE>" \
  -d '{"data":{"title":"Test from curl","content":"testing via curl"}}'
```

Security notes
- Do NOT commit `.env.local` files containing tokens.
- This code runs only when `import.meta.env.DEV` is true (Vite development). In production (build), `import.meta.env.DEV` is false and this code is skipped.
- Treat JWTs like secrets. If you accidentally commit one, revoke it from Strapi or regenerate.

How to remove or disable the dev seed

Option A — Remove: delete the code block in `src/main.tsx` that reads `VITE_DEV_JWT` and writes `localStorage`. Simply edit the file and remove the dev-only block.

Option B — Disable without code change: remove `VITE_DEV_JWT` from your `.env.local` (or rename the file) and restart the dev server.

Option C — Temporary manual removal at runtime: open DevTools Console and run:

```
localStorage.removeItem('accessToken');
localStorage.removeItem('user');
window.location.reload();
```

Notes about production safety
- The dev-only seed is guarded by `import.meta.env.DEV`, which Vite sets at build time. When building for production, Vite replaces `import.meta.env.DEV` with `false` and the block is removed by dead-code elimination in most bundlers. Still, avoid putting real production tokens in project env files.

Additional options
- If you prefer a runtime paste UI (no server restart required), you can add a tiny dev-only React component that shows a small panel where you can paste a JWT and click `Apply` — I can add this for you. It would call `localStorage.setItem('accessToken', token)` and `window.location.reload()`.

Files changed recap & why
- `src/main.tsx` — makes dev testing fast. Imperative code runs early so interceptors see the token.
- `src/api/services/postService.ts` — adds console diagnostic and throws readable errors (helps spot 401 vs 403 vs validation errors).
- `src/pages/Posts.tsx` — uses the improved error message for better UI feedback.

If you want I can:
- Add the runtime dev JWT paste UI component (no restart needed).
- Add a small `Makefile` or npm script to quickly start dev with example `.env.local.example` copied into place.
- Create a short one-page README section and add it to `README.md`.

-- End of document
