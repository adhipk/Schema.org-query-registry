export const config = {
  port: Number(process.env.PORT ?? 3000),
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  schemaOrgUrl:
    process.env.SCHEMA_ORG_URL ??
    "https://schema.org/version/latest/schemaorg-current-https.jsonld",
  cacheTtlSeconds: Number(process.env.SCHEMA_CACHE_TTL_SECONDS ?? 60 * 60 * 24),
};
