# Schema.org Query Registry

A lightweight cached API for querying the Schema.org vocabulary.

## Endpoints

- GET /health
- GET /search?q=Article
- GET /types/:type
- GET /types/:type/properties
- GET /types/:type/children
- GET /properties/:property

## Cache

Downloads Schema.org JSON-LD and builds local indexes.

Designed to be deployed as a simple Node server or container.
