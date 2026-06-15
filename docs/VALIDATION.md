# Validation

Use this checklist to confirm the registry works at three levels: pure index logic, HTTP API behavior, and live cache behavior.

## 1. Static validation

```bash
npm install
npm run validate
```

This runs:

```bash
npm run typecheck
npm test
```

## 2. Build validation

```bash
npm run build
```

This confirms the TypeScript project compiles to `dist/`.

## 3. Live Redis-backed validation

Start Redis and the API:

```bash
docker compose up --build
```

Then test the live service:

```bash
curl http://localhost:3000/health
curl 'http://localhost:3000/search?q=Article'
curl http://localhost:3000/types/Article
curl http://localhost:3000/types/CreativeWork/properties
curl http://localhost:3000/properties/author
```

Expected behavior:

- `/health` returns `{ "ok": true }` plus `fetchedAt` and `sourceUrl`.
- `/search?q=Article` returns `Article` near the top.
- `/types/Article` returns an entity with `kind: "Class"`.
- `/types/CreativeWork/properties` returns common properties such as `author` or `headline` if present in the downloaded registry.
- `/properties/author` returns range entities such as `Person` or `Organization` if present in the downloaded registry.

## 4. Cache refresh validation

```bash
curl -X POST http://localhost:3000/cache/refresh
```

Expected behavior:

- Returns `{ "ok": true }`.
- Updates the cached raw Schema.org JSON-LD and derived indexes in Redis.

## 5. Redis LRU validation

The included Redis service uses:

```txt
--maxmemory 128mb --maxmemory-policy allkeys-lru
```

That means Redis can evict cached registry keys under pressure instead of failing writes. The app should rebuild the cache from Schema.org if the derived index key is missing.
