// Builds the static homepage: index.html (Thai) and en/index.html (English).
// Usage: node build.mjs   (run `python3 -I tools/build-images.py` first if images changed)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { LANGS } from "./src/content.mjs";
import { createRenderer } from "./src/render.mjs";

const manifest = JSON.parse(readFileSync(new URL("./assets/img/manifest.json", import.meta.url)));
const gallery = JSON.parse(readFileSync(new URL("./assets/img/gallery/gallery.json", import.meta.url)));
const render = createRenderer(manifest, gallery);

writeFileSync(new URL("./index.html", import.meta.url), render(LANGS.th, LANGS.en));
mkdirSync(new URL("./en/", import.meta.url), { recursive: true });
writeFileSync(new URL("./en/index.html", import.meta.url), render(LANGS.en, LANGS.th));
console.log("Built index.html and en/index.html");
