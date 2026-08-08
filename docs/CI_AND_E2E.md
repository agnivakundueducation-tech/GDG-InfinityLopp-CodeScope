# CI and Playwright

## Local prerequisites

From `frontend/`:

```bash
npm install
npm install -D @playwright/test
npx playwright install
```

Add the Playwright script to `frontend/package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

The frontend must already have a working `build` and `preview` script (the standard Vite
scripts provide these).

## Run locally

```bash
cd frontend
npm run build
npm run test:e2e
```

The tests use the built Vite preview server.

## CI

The repository CI should:

1. install backend dependencies;
2. run backend lint;
3. run Django migrations;
4. run backend tests;
5. install frontend dependencies;
6. run frontend lint;
7. build the frontend;
8. install Playwright browsers;
9. run Playwright tests;
10. upload the Playwright HTML report.

Do not mark CI as green in documentation until the GitHub Actions run has actually passed.
