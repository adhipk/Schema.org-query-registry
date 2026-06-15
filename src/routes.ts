import { Router } from "express";
import { getRegistry, refreshRegistry, searchEntities } from "./schemaorg/registry.js";

export const routes = Router();

routes.get("/health", async (_req, res, next) => {
  try {
    const registry = await getRegistry();
    res.json({ ok: true, fetchedAt: registry.fetchedAt, sourceUrl: registry.sourceUrl });
  } catch (error) {
    next(error);
  }
});

routes.post("/cache/refresh", async (_req, res, next) => {
  try {
    const registry = await refreshRegistry();
    res.json({ ok: true, fetchedAt: registry.fetchedAt });
  } catch (error) {
    next(error);
  }
});

routes.get("/search", async (req, res, next) => {
  try {
    const registry = await getRegistry();
    const q = String(req.query.q ?? "");
    const limit = Number(req.query.limit ?? 25);
    res.json({ q, results: searchEntities(registry, q, limit) });
  } catch (error) {
    next(error);
  }
});

routes.get("/types/:type", async (req, res, next) => {
  try {
    const registry = await getRegistry();
    const entity = registry.types[req.params.type];
    if (!entity) return res.status(404).json({ error: "Type not found" });
    res.json(entity);
  } catch (error) {
    next(error);
  }
});

routes.get("/types/:type/properties", async (req, res, next) => {
  try {
    const registry = await getRegistry();
    const propertyNames = registry.typeProperties[req.params.type] ?? [];
    res.json({ type: req.params.type, properties: propertyNames.map((name) => registry.properties[name]) });
  } catch (error) {
    next(error);
  }
});

routes.get("/types/:type/children", async (req, res, next) => {
  try {
    const registry = await getRegistry();
    const childNames = registry.parentChildren[req.params.type] ?? [];
    res.json({ type: req.params.type, children: childNames.map((name) => registry.types[name] ?? registry.entities[name]) });
  } catch (error) {
    next(error);
  }
});

routes.get("/properties/:property", async (req, res, next) => {
  try {
    const registry = await getRegistry();
    const entity = registry.properties[req.params.property];
    if (!entity) return res.status(404).json({ error: "Property not found" });
    res.json({ ...entity, ranges: entity.rangeIncludes.map((name) => registry.types[name] ?? registry.entities[name]) });
  } catch (error) {
    next(error);
  }
});
