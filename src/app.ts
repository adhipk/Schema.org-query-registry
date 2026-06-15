import cors from "cors";
import express from "express";
import morgan from "morgan";
import { routes } from "./routes.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(routes);

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
  });

  return app;
}
