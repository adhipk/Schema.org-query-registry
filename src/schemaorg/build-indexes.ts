import type { RegistryEntity, RegistryIndexes, RegistryKind } from "../types.js";

function asArray(value: unknown): unknown[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function idOf(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return stripSchema(value);
  if (typeof value === "object" && value && "@id" in value) {
    return stripSchema(String((value as { "@id": string })["@id"]));
  }
  return undefined;
}

function textOf(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value && "@value" in value) {
    return String((value as { "@value": string })["@value"]);
  }
  return undefined;
}

function stripSchema(id: string): string {
  return id.replace(/^schema:/, "").replace(/^https?:\/\/schema\.org\//, "");
}

function classify(types: string[]): RegistryKind {
  const clean = types.map(stripSchema);
  if (clean.includes("rdfs:Class") || clean.includes("Class")) return "Class";
  if (clean.includes("rdf:Property") || clean.includes("Property")) return "Property";
  if (clean.includes("Enumeration")) return "Enumeration";
  if (clean.includes("DataType")) return "DataType";
  return "Unknown";
}

export function buildIndexes(jsonld: unknown, sourceUrl: string): RegistryIndexes {
  const graph = (jsonld as { "@graph"?: unknown[] })["@graph"] ?? [];
  const entities: Record<string, RegistryEntity> = {};

  for (const node of graph) {
    if (!node || typeof node !== "object") continue;
    const record = node as Record<string, unknown>;
    const id = idOf(record["@id"]);
    if (!id) continue;

    const rawTypes = asArray(record["@type"]).map(idOf).filter(Boolean) as string[];
    const kind = classify(rawTypes);
    const parents = asArray(record["rdfs:subClassOf"]).map(idOf).filter(Boolean) as string[];
    const domainIncludes = asArray(record["schema:domainIncludes"]).map(idOf).filter(Boolean) as string[];
    const rangeIncludes = asArray(record["schema:rangeIncludes"]).map(idOf).filter(Boolean) as string[];

    entities[id] = {
      id,
      name: id,
      kind,
      label: textOf(record["rdfs:label"]),
      comment: textOf(record["rdfs:comment"]),
      parents,
      children: [],
      domainIncludes,
      rangeIncludes,
    };
  }

  for (const entity of Object.values(entities)) {
    for (const parent of entity.parents) {
      if (entities[parent]) entities[parent].children.push(entity.id);
    }
  }

  const types: Record<string, RegistryEntity> = {};
  const properties: Record<string, RegistryEntity> = {};
  const typeProperties: Record<string, string[]> = {};
  const propertyRanges: Record<string, string[]> = {};
  const parentChildren: Record<string, string[]> = {};

  for (const entity of Object.values(entities)) {
    if (entity.kind === "Class" || entity.kind === "Enumeration" || entity.kind === "DataType") {
      types[entity.id] = entity;
    }
    if (entity.kind === "Property") {
      properties[entity.id] = entity;
      propertyRanges[entity.id] = entity.rangeIncludes;
      for (const domain of entity.domainIncludes) {
        typeProperties[domain] ??= [];
        typeProperties[domain].push(entity.id);
      }
    }
    if (entity.children.length > 0) parentChildren[entity.id] = entity.children;
  }

  return {
    fetchedAt: new Date().toISOString(),
    sourceUrl,
    entities,
    types,
    properties,
    typeProperties,
    propertyRanges,
    parentChildren,
  };
}
