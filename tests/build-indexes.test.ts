import { describe, expect, it } from "vitest";
import { buildIndexes } from "../src/schemaorg/build-indexes.js";
import { schemaOrgMini } from "./fixtures/schemaorg-mini.js";

describe("buildIndexes", () => {
  const indexes = buildIndexes(schemaOrgMini, "fixture://schemaorg-mini");

  it("indexes class metadata", () => {
    expect(indexes.types.Article).toMatchObject({
      id: "Article",
      name: "Article",
      kind: "Class",
      label: "Article",
      parents: ["CreativeWork"]
    });
  });

  it("indexes direct parent to children relationships", () => {
    expect(indexes.parentChildren.CreativeWork).toContain("Article");
    expect(indexes.parentChildren.Article).toContain("BlogPosting");
  });

  it("indexes property domains", () => {
    expect(indexes.typeProperties.CreativeWork).toEqual(expect.arrayContaining(["headline", "author"]));
  });

  it("indexes property ranges", () => {
    expect(indexes.propertyRanges.author).toEqual(["Person", "Organization"]);
    expect(indexes.propertyRanges.headline).toEqual(["Text"]);
  });
});
