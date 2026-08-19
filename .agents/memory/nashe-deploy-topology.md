---
name: NASHE deploy topology
description: How the mobile web build reaches the API in each environment.
---

Rule: the Expo web build resolves its API base as EXPO_PUBLIC_API_URL → same-origin `/api` (web) → localhost (native dev).
**Why:** In the Replit workspace the api-server artifact is path-routed at `/api` on the same host, so same-origin works; on static hosts like Vercel there is no `/api` handler, so a production EXPO_PUBLIC_API_URL pointing at a separately deployed API is mandatory or login/feed/upload fail.
**How to apply:** When deploying the web app anywhere other than Replit, set EXPO_PUBLIC_API_URL at build time and verify auth + video endpoints from the deployed URL.
