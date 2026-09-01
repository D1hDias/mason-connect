import "dotenv/config";
import cors from "cors";
import express, { type Express } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
  );

  // IMPORTANT: the Better Auth handler must be mounted BEFORE
  // express.json(). It needs the raw, unparsed request body — if
  // express.json() runs first it consumes the stream and Better Auth's
  // request parsing breaks.
  app.all("/api/auth/*", toNodeHandler(auth));

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}

// Only start listening when this file is run directly (`npm run dev` /
// `node dist/index.js`), not when it's imported (e.g. by tests importing
// `createApp`).
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const port = Number(process.env.PORT ?? 8787);
  createApp().listen(port, () => {
    console.log(`Mason Connect auth server listening on port ${port}`);
  });
}
