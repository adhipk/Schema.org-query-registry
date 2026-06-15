import cors from "cors";
import express from "express";
import morgan from "morgan";
import { config } from "./config.js";
import { connectRedis } from "./redis.js";
import { routes } from "./routes.js";
import { getRegistry } from "./schemaorg/registry.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(routes);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
});

await connectRedis();
await getRegistry();

app.listen(config.port, () => {
  console.log(`Schema.org registry API listening on http://localhost:${config.port}`);
});
