import http from "node:http";
import { createRequire } from "node:module";
const require = createRequire(process.cwd() + "/");
const next = require("next");
const port = Number(process.env.PORT || 3001);
const BASE = "/studioOS";
const app = next({ dev: true, dir: process.cwd(), hostname: "127.0.0.1", port, turbopack: true });
const handle = app.getRequestHandler();
await app.prepare();
http.createServer((req, res) => {
  if (req.url !== BASE && !req.url.startsWith(BASE + "/") && !req.url.startsWith(BASE + "?")) {
    req.url = BASE + (req.url.startsWith("/") ? req.url : "/" + req.url);
  }
  handle(req, res);
}).listen(port, "127.0.0.1", () => console.log("ready on " + port));
