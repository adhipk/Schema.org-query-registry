import { connectRedis, redis } from "../redis.js";
import { refreshRegistry } from "../schemaorg/registry.js";

await connectRedis();
const registry = await refreshRegistry();
console.log(`Refreshed Schema.org cache from ${registry.sourceUrl} at ${registry.fetchedAt}`);
await redis.quit();
