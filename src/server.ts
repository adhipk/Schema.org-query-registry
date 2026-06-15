import { createApp } from "./app.js";
import { config } from "./config.js";
import { connectRedis } from "./redis.js";
import { getRegistry } from "./schemaorg/registry.js";

await connectRedis();
await getRegistry();

const app = createApp();

app.listen(config.port, () => {
  console.log(`Schema.org registry API listening on http://localhost:${config.port}`);
});
