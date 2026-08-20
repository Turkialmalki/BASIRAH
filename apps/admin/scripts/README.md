# Admin dev scripts

- **`e2eSmoke.mjs`** — headless-browser smoke test of the real CMS UI
  (login → courses → chapter editor → save a scene). Needs Playwright's
  browser downloaded once (`npx -p playwright playwright install
  chromium`), then:

  ```bash
  pnpm dev   # or `next start` against a production build
  ADMIN_URL=http://localhost:3000 ADMIN_ACCESS_CODE=<your code> \
    node scripts/e2eSmoke.mjs
  ```

  This is what caught a real id-mismatch bug during Phase 6 (see
  `../../../docs/scene-engine.md` — "A real bug this caught") that no
  amount of `tsc` or schema-parsing alone would have found, because it
  only shows up on the actual save round-trip through a running server.
