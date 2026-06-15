# Schema.org Query Registry

A lightweight cached API for querying the Schema.org vocabulary.

It downloads the official Schema.org JSON-LD registry, builds derived indexes, stores them in Redis, and serves simple HTTP endpoints such as:

```txt
GET /search?q=Article
GET /types/Article
GET /types/Article/properties
GET /types/CreativeWork/children
GET /properties/author
```

## Architecture

```txt
Schema.org JSON-LD
        ↓
Redis raw cache
        ↓
index builder
        ↓
Redis index cache + in-memory process cache
        ↓
HTTP API
```

Redis can be configured with an LRU eviction policy, so the server is simple to host and does not need a database.

## Run locally

```bash
npm install
cp .env.example .env
docker compose up redis
npm run dev
```

Or run the whole stack:

```bash
docker compose up --build
```

## Endpoints

### Health

```txt
GET /health
```

### Search

```txt
GET /search?q=Article&limit=25
```

Searches names, labels, and comments.

### Type lookup

```txt
GET /types/Article
```

### Type properties

```txt
GET /types/Article/properties
```

Returns properties whose `schema:domainIncludes` includes the type.

### Child types

```txt
GET /types/CreativeWork/children
```

Returns direct children from `rdfs:subClassOf`.

### Property lookup

```txt
GET /properties/author
```

Returns property metadata plus allowed ranges from `schema:rangeIncludes`.

### Refresh cache

```txt
POST /cache/refresh
```

Manually refreshes the raw Schema.org download and derived indexes.

## Environment

```txt
PORT=3000
REDIS_URL=redis://localhost:6379
SCHEMA_ORG_URL=https://schema.org/version/latest/schemaorg-current-https.jsonld
SCHEMA_CACHE_TTL_SECONDS=86400
```

## Notes

Schema.org describes what is allowed in the vocabulary. It does not define strict required fields for Google Rich Results or other consumers. Those should be added as a separate validation policy layer.
