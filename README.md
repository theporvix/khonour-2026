# K Honour Group: Homepage Redesign (TH / EN)

A bilingual homepage for [khonour.co.th](https://khonour.co.th/), built as a fast, dependency-free static page. It is generated from one template and one content file per language.

- `index.html`: Thai (default, `/`)
- `en/index.html`: English (`/en/`)

Only the homepage is redesigned. Every project, article, about and contact link points to the existing live pages, which are unchanged.

## Preview locally

```bash
npm run dev
```

Then open http://localhost:4321 (Thai) or http://localhost:4321/en/ (English). Requires Node 18+. There are no npm dependencies.

## Edit and rebuild

| What | Where |
|---|---|
| All copy, prices, links (TH + EN) | `src/content.mjs` |
| Page markup | `src/render.mjs` |
| Icons and inline logo | `src/icons.mjs` |
| Styles (design tokens at the top) | `assets/css/main.css` |
| Interactions | `assets/js/main.js` |
| Image list and sizes | `tools/build-images.py` |

```bash
npm run images   # only when images change (needs Python 3 + Pillow): page images, house-type gallery, map
npm run build    # regenerates index.html and en/index.html
```

Original images downloaded from the live site are in `assets/originals/`. The house-type gallery comes from `tools/build-gallery.py` (it also strips the white frame from the interior renders). The map comes from `tools/build-map.py`, which stitches OpenStreetMap tiles around the project pin; the "© OpenStreetMap contributors" credit shown on the map is required by its licence. Optimised responsive WebP files are in `assets/img/`.

## What's on the page

1. **Header:** the same menu as the live site. บ้าน / ทาวน์โฮม / โฮมออฟฟิศ open a full-width mega menu with a category intro, project cards (photo, status, price or year and units) and a "Need advice?" card. Then ความรู้เรื่องบ้าน, โปรโมชั่น and รู้จัก เค ออนเนอร์กรุ๊ป. ESCAVE is added under บ้าน. The header is **sticky**: always visible, and solid once you scroll. It also has the phone number, the TH/EN switch and a "Book a visit" CTA. Below 1180 px it becomes a full-screen menu with accordions, plus ติดต่อเรา.
2. **Hero:** the brand tagline "We Breathe Life Into Spaces", ESCAVE render, brand promise, and the primary CTA (register for ESCAVE). A side card shows the price and the "82 families" scarcity.
3. **About + proof:** vision copy, real photography from 9th Canale, and count-up stats.
4. **Now selling:** ESCAVE and 9th Canale, with prices, highlights and CTAs.
5. **ESCAVE deep-dive:** concept, key facts, and an accessible house-type explorer (Grove, Cove, Dune, Vale) with specs and price for each. Every type has a **photo / floor-plan viewer**: 9 renders (3 exterior, 6 interior) and both floor plans. Visitors can flick through with arrows, swipe or the keyboard, and tap to open a full-size view. Also facilities, and a **static location map** with the ESCAVE pin (links to Google Maps) beside the distance lists, plus a register CTA.
6. **Five foundations:** the brand's own five pillars from the About page.
7. **Track record:** a draggable, keyboard-scrollable timeline of all nine past projects, with units and value.
8. **Home guides:** three latest articles.
9. **Contact:** an enquiry form (full name, email, phone, message) with Thai/English validation, next to phone / LINE / email / Facebook, the three-step journey and the office address.
10. **Footer**, a floating **back-to-top** button (with a scroll-progress ring, shown after the first screen), and a **sticky mobile bar** (Call / LINE / Book a visit) that hides near the contact section.

### Enquiries and the contact form

The form works today with no server. On submit it validates the fields, then opens the visitor's email app with a pre-filled message to `khonour.sale@gmail.com`. The page then shows a "press send" confirmation with LINE and phone as alternatives.

To receive enquiries directly instead, set `FORM_ENDPOINT` in `src/content.mjs` to any URL that accepts a form `POST`, then run `npm run build`. Examples: a WordPress REST route, Formspree or Web3Forms. The form then submits in-page, shows a "Thank you" state, and keeps the visitor's input with an error message if sending fails. Fields sent: `name`, `email`, `phone`, `message`, `language`, `page`. A hidden honeypot field filters simple bots.

"Register / Book a visit" buttons still open the working registration form on each project page. The live site's Elementor forms post to WordPress with a nonce, so a separate static page can't submit to them.

> The live Elementor form currently shows a warning: "A problem was detected in the following Form…". It should be fixed in WordPress.

### Bilingual behaviour

- Two real URLs with `hreflang` alternates, a per-language `<title>`, meta description, Open Graph tags and JSON-LD (Organization, WebSite, WebPage).
- The language switch keeps the visitor on the same section. Switching while reading ESCAVE lands on `/en/#escave`.
- The inner project pages exist only in Thai. In English, those links are marked `hreflang="th"` and a short note says so. No English project pages were invented.

### Accessibility and performance

- Semantic landmarks, one `h1`, and an ordered heading outline. The skip link, visible focus states and WAI-ARIA tabs (arrow, Home and End keys) are verified.
- Descriptive alt text in both languages. Renders are labelled as artist's impressions.
- Every motion effect respects `prefers-reduced-motion`. Content is fully visible without JavaScript.
- WebP `srcset` images throughout (hero ≈ 100 KB at 1600 px). Only the hero image loads eagerly and is preloaded. About 11 KB of JS and 45 KB of CSS, with no frameworks.

## Uploading to GitHub

The repository is this folder as-is: 196 files, about 11 MB, none larger than 5 MB. The original downloaded images in `assets/originals/` are left out on purpose (see `.gitignore`). The site doesn't need them, only `npm run images` does, to regenerate the optimized images.

GitHub's web uploader accepts at most 100 files per upload, and `assets/` alone has 174. Use one of these instead:

- **GitHub Desktop:** File → Add Local Repository → choose this folder → "create a repository" → Publish.
- **Command line**, from inside this folder:

  ```bash
  git init && git add . && git commit -m "K Honour homepage redesign" && git branch -M main && git remote add origin https://github.com/<you>/<repo>.git && git push -u origin main
  ```

`.gitignore` and `.nojekyll` are hidden files. In Finder, press Cmd+Shift+. to see them.

### Publishing with GitHub Pages (optional)

Settings → Pages → Deploy from a branch → `main` / root. All asset and language links are relative, so the site works at `https://<you>.github.io/<repo>/` as well as at a domain root. `.nojekyll` makes Pages serve the files untouched. The canonical, hreflang and Open Graph tags still point to `https://khonour.co.th/`, which is correct for the final site. For a public preview, consider keeping the repository private, or ask search engines not to index it.

## Deploying to the live WordPress site

This folder is a standalone build, and nothing has been deployed. Options:

1. **Static front page (simplest).** Upload `index.html`, `en/` and `assets/` to the web root, and have the server serve `index.html` for `/` and `/en/`. Keep WordPress for all other URLs. With LiteSpeed/Apache, add a rule for `/` and `/en/` ahead of WordPress's rewrite.
2. **WordPress page template.** Copy `assets/` into the child theme (`woodmart-child`) and paste the generated `<body>` markup into a custom page template. Then set it as the static front page. The Elementor form could then be embedded directly with its shortcode.

Before going live, confirm the items in `docs/content-sources.md`.

## Docs

- `docs/research.md`: site audit and competitor research, and how they shaped the design
- `docs/content-sources.md`: where every fact comes from, and open questions for the client
