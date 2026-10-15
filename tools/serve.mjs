// Minimal zero-dependency static server for local preview: node tools/serve.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.argv[2] || process.env.PORT || 4321);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon" };

const server = createServer(async (req, res) => {
  try {
    let p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
    let file = join(root, p);
    if (!file.startsWith(root)) throw new Error("forbidden");
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream", "cache-control": "no-cache" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
  }
});

// If the port is taken (e.g. a preview is already running), try the next one.
let current = port;
server.on("error", (err) => {
  if (err.code === "EADDRINUSE" && current < port + 20) {
    console.log(`Port ${current} is in use, trying ${current + 1}…`);
    server.listen(++current);
  } else {
    throw err;
  }
});
server.on("listening", () => console.log(`Serving on http://localhost:${current}  (English: http://localhost:${current}/en/)`));
server.listen(current);
