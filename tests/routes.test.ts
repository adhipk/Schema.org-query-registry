import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app.js";
import { buildIndexes } from "../src/schemaorg/build-indexes.js";
import { schemaOrgMini } from "./fixtures/schemaorg-mini.js";

const fixtureRegistry = buildIndexes(schemaOrgMini, "fixture://schemaorg-mini");

vi.mock("../src/schemaorg/registry.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/schemaorg/registry.js")>();
  return {
    ...actual,
    getRegistry: vi.fn(async () => fixtureRegistry),
    refreshRegistry: vi.fn(async () => fixtureRegistry)
  };
});

describe("routes", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reports health", async () => {
    const response = await request(app).get("/health").expect(200);
    expect(response.body).toMatchObject({ ok: true, sourceUrl: "fixture://schemaorg-mini" });
  });

  it("searches entities", async () => {
    const response = await request(app).get("/search?q=Article").expect(200);
    expect(response.body.results[0].name).toBe("Article");
  });

  it("looks up a type", async () => {
    const response = await request(app).get("/types/Article").expect(200);
    expect(response.body).toMatchObject({ name: "Article", kind: "Class" });
  });

  it("returns 404 for unknown types", async () => {
    await request(app).get("/types/NotAType").expect(404);
  });

  it("returns properties for a type", async () => {
    const response = await request(app).get("/types/CreativeWork/properties").expect(200);
    expect(response.body.properties.map((property: { name: string }) => property.name)).toEqual(
      expect.arrayContaining(["headline", "author"])
    );
  });

  it("returns child types", async () => {
    const response = await request(app).get("/types/CreativeWork/children").expect(200);
    expect(response.body.children.map((child: { name: string }) => child.name)).toContain("Article");
  });

  it("returns property ranges", async () => {
    const response = await request(app).get("/properties/author").expect(200);
    expect(response.body.ranges.map((range: { name: string }) => range.name)).toEqual(
      expect.arrayContaining(["Person"])
    );
  });
});
