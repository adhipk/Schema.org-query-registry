import { config } from "../config.js";
import { redis } from "../redis.js";

const RAW_CACHE_KEY = "schemaorg:raw:current:https:jsonld";

export async function fetchSchemaOrgJsonLd(): Promise<unknown> {
  const cached = await redis.get(RAW_CACHE_KEY);
  if (cached) return JSON.parse(cached);

  const response = await fetch(config.schemaOrgUrl);
  if (!response.ok) {
    throw new Error(`Failed to download Schema.org JSON-LD: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  await redis.set(RAW_CACHE_KEY, JSON.stringify(json), { EX: config.cacheTtlSeconds });
  return json;
}
