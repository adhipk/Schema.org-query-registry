import { describe, expect, it } from "vitest";
import { buildIndexes } from "../src/schemaorg/build-indexes.js";
import { searchEntities } from "../src/schemaorg/registry.js";
import { schemaOrgMini } from "./fixtures/schemaorg-mini.js";

describe("searchEntities", () => {
  const indexes = buildIndexes(schemaOrgMini, "fixture://schemaorg-mini");

  it("returns exact name matches first", () => {
    const results = searchEntities(indexes, "Article");
    expect(results[0]?.name).toBe("Article");
  });

  it("finds entities by comment text", () => {
    const results = searchEntities(indexes, "blog post");
    expect(results.map((result) => result.name)).toContain("BlogPosting");
  });

  it("returns no results for blank queries", () => {
    expect(searchEntities(indexes, "   ")).toEqual([]);
  });
});
