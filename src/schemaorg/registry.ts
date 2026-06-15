import { config } from "../config.js";
import { redis } from "../redis.js";
import type { RegistryEntity, RegistryIndexes } from "../types.js";
import { buildIndexes } from "./build-indexes.js";
import { fetchSchemaOrgJsonLd } from "./fetch.js";

const INDEX_CACHE_KEY = "schemaorg:indexes:current:https:json";

let memoryIndexes: RegistryIndexes | null = null;

export async function getRegistry(): Promise<RegistryIndexes> {
  if (memoryIndexes) return memoryIndexes;

  const cached = await redis.get(INDEX_CACHE_KEY);
  if (cached) {
    memoryIndexes = JSON.parse(cached) as RegistryIndexes;
    return memoryIndexes;
  }

  return refreshRegistry();
}

export async function refreshRegistry(): Promise<RegistryIndexes> {
  const raw = await fetchSchemaOrgJsonLd();
  const indexes = buildIndexes(raw, config.schemaOrgUrl);
  await redis.set(INDEX_CACHE_KEY, JSON.stringify(indexes), { EX: config.cacheTtlSeconds });
  memoryIndexes = indexes;
  return indexes;
}

export function searchEntities(indexes: RegistryIndexes, q: string, limit = 25): RegistryEntity[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];

  return Object.values(indexes.entities)
    .map((entity) => ({ entity, score: scoreEntity(entity, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entity.name.localeCompare(b.entity.name))
    .slice(0, limit)
    .map((item) => item.entity);
}

function scoreEntity(entity: RegistryEntity, query: string): number {
  const name = entity.name.toLowerCase();
  const label = entity.label?.toLowerCase() ?? "";
  const comment = entity.comment?.toLowerCase() ?? "";

  if (name === query || label === query) return 100;
  if (name.startsWith(query) || label.startsWith(query)) return 75;
  if (name.includes(query) || label.includes(query)) return 50;
  if (comment.includes(query)) return 10;
  return 0;
}
