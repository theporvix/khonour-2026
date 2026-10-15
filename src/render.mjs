// Renders the full homepage HTML for one language.
import { LINKS, CONTACT, HOUSE_TYPES, TRACK, ARTICLES, SITE, FORM_ENDPOINT } from "./content.mjs";
import { ICONS, LOGO_SYMBOL } from "./icons.mjs";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const icon = (name, cls = "icon") => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

const logo = (cls = "logo") =>
  `<svg class="${cls}" viewBox="0 0 512 118.77" role="img" aria-label="K Honour"><use href="#k-logo"></use></svg>`;

/** Resolve a LINKS key or pass through anchors/URLs. */
const href = (h) => (h.startsWith("#") || h.startsWith("http") ? h : LINKS[h]);
const ext = (h) => !href(h).startsWith("#");

// Icons by position, shared by both languages
const ICON_SETS = {
  stats: ["history", "buildings", "key", "shield"],
  points: { escave: ["leaf", "home", "pool"], canale: ["bed", "tree", "shield"] },
  facts: ["leaf", "users", "home", "route"],
  facilities: ["pool", "dumbbell", "gate", "tree"],
  location: ["car", "bag", "cap", "hospital"],
  pillars: ["shield", "bricks", "headset", "heart", "gem"],
  steps: ["message", "calendar", "key"],
};

// Relative path from the current page to the site root ("" for /, "../" for /en/),
// so the build works at a domain root or in a subfolder (e.g. GitHub Pages).
let BASE = "";

export function createRenderer(manifest, gallery) {
  /** Responsive <img> from the generated WebP set. */
  function img(name, alt, sizes, { eager = false, cls = "", priority = false } = {}) {
    const m = manifest[name];
    if (!m) throw new Error(`Missing image ${name}`);
    const srcset = m.widths.map((w) => `${BASE}assets/img/${name}-${w}.webp ${w}w`).join(", ");
    const fallback = m.widths[Math.min(1, m.widths.length - 1)];
    const ratioH = Math.round((m.h / m.w) * fallback);
    return `<img${cls ? ` class="${cls}"` : ""} src="${BASE}assets/img/${name}-${fallback}.webp" srcset="${srcset}" sizes="${sizes}" width="${fallback}" height="${ratioH}" alt="${esc(alt)}" ${
      eager ? `loading="eager"${priority ? ' fetchpriority="high"' : ""}` : 'loading="lazy"'
    } decoding="async">`;
  }

  /** Gallery image (photos/plans) from assets/img/gallery. */
  function gimg(g, alt, sizes, eager = false) {
    const srcset = g.widths.map((w) => `${BASE}assets/img/gallery/${g.file}-${w}.webp ${w}w`).join(", ");
    const w0 = g.widths[0];
    return `<img src="${BASE}assets/img/gallery/${g.file}-${w0}.webp" srcset="${srcset}" sizes="${sizes}" width="${w0}" height="${Math.round((g.h / g.w) * w0)}" alt="${esc(alt)}" loading="${eager ? "eager" : "lazy"}" decoding="async" data-full="${BASE}assets/img/gallery/${g.file}-${g.widths.at(-1)}.webp">`;
  }

  return function render(t, other) {
    BASE = t.lang === "en" ? "../" : "";
    const isEn = t.lang === "en";
    const extAttrs = (h) => (ext(h) ? ` target="_blank" rel="noopener"${isEn && href(h).startsWith(SITE) ? ' hreflang="th"' : ""}` : "");
    const srNew = (h) => (ext(h) ? `<span class="sr-only"> ${t.ui.newTab}</span>` : "");
    const a = (h, label, cls = "", extra = "") =>
      `<a class="${cls}" href="${esc(href(h))}"${extAttrs(h)}${extra}>${label}${srNew(h)}</a>`;
    const btn = (h, label, variant = "primary", ic = "arrow") =>
      a(h, `<span>${esc(label)}</span>${icon(ic, "icon btn__icon")}`, `btn btn--${variant}`);
    const price = (s) => (isEn ? `THB ${s}M*` : `${s} ลบ.*`);

    const canonical = `${SITE}${t.path}`;
    const altUrl = `${SITE}${other.path}`;

    /* ---------------- head ---------------- */
    const ld = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${SITE}/#org`,
          name: "K Honour Group Co., Ltd.",
          alternateName: ["บริษัท เค ออนเนอร์กรุ๊ป จำกัด", "K Honour", "เค ออนเนอร์กรุ๊ป"],
          url: `${SITE}/`,
          logo: `${SITE}/storage/2024/10/k-honour-logo.svg`,
          slogan: "We Breathe Life Into Spaces",
          foundingDate: "1992",
          telephone: "+66-2-546-1699",
          email: CONTACT.email,
          sameAs: [LINKS.facebook, LINKS.line],
          address: {
            "@type": "PostalAddress",
            streetAddress: "98/423 Moo 3, Rangsit–Nakhon Nayok Road",
            addressLocality: "Lam Phak Kut, Thanyaburi",
            addressRegion: "Pathum Thani",
            postalCode: "12110",
            addressCountry: "TH",
          },
        },
        { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "K Honour", inLanguage: ["th", "en"], publisher: { "@id": `${SITE}/#org` } },
        { "@type": "WebPage", url: canonical, name: t.meta.title, description: t.meta.description, inLanguage: t.lang, isPartOf: { "@id": `${SITE}/#website` } },
      ],
    };

    const head = `<!doctype html>
<html lang="${t.lang}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t.meta.title)}</title>
<meta name="description" content="${esc(t.meta.description)}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="th" href="${SITE}/">
<link rel="alternate" hreflang="en" href="${SITE}/en/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta name="theme-color" content="#0f1d3a">
<meta property="og:type" content="website">
<meta property="og:site_name" content="K Honour Group">
<meta property="og:locale" content="${t.locale}">
<meta property="og:locale:alternate" content="${other.locale}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(t.meta.title)}">
<meta property="og:description" content="${esc(t.meta.description)}">
<meta property="og:image" content="${SITE}/assets/img/og-escave.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t.meta.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${BASE}assets/img/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="${BASE}assets/img/favicon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="preload" as="image" href="${BASE}assets/img/escave-vale-hero-1600.webp" imagesrcset="${manifest["escave-vale-hero"].widths.map((w) => `${BASE}assets/img/escave-vale-hero-${w}.webp ${w}w`).join(", ")}" imagesizes="100vw" fetchpriority="high">
<link rel="stylesheet" href="${BASE}assets/css/main.css">
<script>document.documentElement.classList.replace("no-js","js")</script>
<script src="${BASE}assets/js/main.js" defer></script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>`;

    /* ---------------- header ---------------- */
    const langSwitch = (cls) => `<nav class="lang ${cls}" aria-label="${t.ui.langLabel}">
      <a href="${BASE || "./"}" hreflang="th" lang="th" data-lang-link${t.lang === "th" ? ' aria-current="true"' : ""}>TH</a>
      <span class="lang__sep" aria-hidden="true"></span>
      <a href="${t.lang === "en" ? "./" : "en/"}" hreflang="en" lang="en" data-lang-link${t.lang === "en" ? ' aria-current="true"' : ""}>EN</a>
    </nav>`;

    // Menu links go to the site's own pages, so they open in the same tab.
    const navAttrs = (h) => `href="${esc(href(h))}"${isEn && href(h).startsWith(SITE) ? ' hreflang="th"' : ""}`;

    const desktopNav = t.nav
      .filter((n) => !n.mobileOnly)
      .map((n, i) => {
        if (!n.items) return `<li class="site-nav__item"><a class="site-nav__link" ${navAttrs(n.href)}>${esc(n.label)}</a></li>`;
        return `<li class="site-nav__item has-sub" data-sub>
        <button class="site-nav__link site-nav__trigger" type="button" aria-expanded="false" aria-controls="subnav-${i}" data-sub-trigger>${esc(n.label)}${icon("chevron", "icon site-nav__chev")}</button>
        <div class="subnav" id="subnav-${i}" data-sub-panel>
          <div class="subnav__inner">
            <div class="subnav__intro">
              <p class="subnav__count">${esc(t.ui.navCount(n.items.length))}</p>
              <p class="subnav__title">${esc(n.label)}</p>
              <p class="subnav__desc">${esc(n.intro)}</p>
            </div>
            <ul class="subnav__grid" style="--cols:${n.items.length}">${n.items
              .map(
                (it, j) => `<li style="--i:${j}"><a class="subnav-card" ${navAttrs(it.key)}>
                <span class="subnav-card__media">${img(it.img, "", "(min-width: 1360px) 220px, 18vw")}<span class="subnav-card__tag${it.live ? " is-live" : ""}">${esc(it.tag)}</span></span>
                <span class="subnav-card__name">${esc(it.label)}${icon("arrow-up-right", "icon subnav-card__arrow")}</span>
                <span class="subnav-card__meta">${esc(it.meta)}</span>
              </a></li>`
              )
              .join("")}</ul>
            <aside class="subnav__help" aria-label="${esc(t.ui.navHelpTitle)}">
              <span class="subnav__help-icon">${icon("headset")}</span>
              <p class="subnav__help-title">${esc(t.ui.navHelpTitle)}</p>
              <p class="subnav__help-text">${esc(t.ui.navHelpText)}</p>
              <a class="subnav__help-link" href="${LINKS.tel}">${icon("phone")}${CONTACT.phone}</a>
              <a class="subnav__help-link" href="${LINKS.line}" target="_blank" rel="noopener">${icon("line")}LINE ${CONTACT.line}</a>
              ${btn("escaveRegister", t.headerCta, "primary")}
            </aside>
          </div>
        </div>
      </li>`;
      })
      .join("");

    const mobileNav = t.nav
      .map((n, i) => {
        const num = `<span class="mobile-menu__num">0${i + 1}</span>`;
        if (!n.items) {
          const h = n.href.startsWith("#") ? `href="${n.href}"` : navAttrs(n.href);
          return `<li><a class="mobile-menu__link" ${h} data-menu-link>${num}${esc(n.label)}</a></li>`;
        }
        return `<li>
        <button class="mobile-menu__link mobile-menu__group" type="button" aria-expanded="false" aria-controls="msub-${i}" data-acc>${num}<span>${esc(n.label)}</span>${icon("chevron", "icon mobile-menu__chev")}</button>
        <ul class="mobile-menu__sub" id="msub-${i}" hidden>${n.items
          .map((it) => `<li><a ${navAttrs(it.key)} data-menu-link><span>${esc(it.label)}</span><span class="subnav-card__tag${it.live ? " is-live" : ""}">${esc(it.tag)}</span></a></li>`)
          .join("")}</ul>
      </li>`;
      })
      .join("");

    const header = `<a class="skip" href="#main">${t.ui.skip}</a>
<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="site-header__brand" href="./" aria-label="${t.ui.home}">${logo("logo")}</a>
    <nav class="site-nav" aria-label="${t.ui.mainNav}">
      <ul class="site-nav__list">${desktopNav}</ul>
    </nav>
    <div class="site-header__actions">
      <a class="site-header__tel" href="${LINKS.tel}" aria-label="${t.ui.callUs} ${CONTACT.phone}">${icon("phone")}<span>${CONTACT.phone}</span></a>
      ${langSwitch("lang--header")}
      ${a("escaveRegister", `<span>${esc(t.headerCta)}</span>`, "btn btn--primary btn--sm site-header__cta")}
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
        <span class="menu-toggle__bars" aria-hidden="true"><span></span><span></span></span>
        <span class="sr-only" data-menu-label data-open="${t.ui.menu}" data-close="${t.ui.close}">${t.ui.menu}</span>
      </button>
    </div>
  </div>
  <div class="nav-scrim" aria-hidden="true"></div>
  <div class="mobile-menu" id="mobile-menu" data-menu hidden>
    <nav aria-label="${t.ui.mainNav}">
      <ul class="mobile-menu__list">${mobileNav}</ul>
    </nav>
    <div class="mobile-menu__foot">
      ${langSwitch("lang--menu")}
      ${btn("escaveRegister", t.headerCta)}
      <div class="mobile-menu__contact">
        <a href="${LINKS.tel}">${icon("phone")}${CONTACT.phone}</a>
        <a href="${LINKS.line}" target="_blank" rel="noopener">${icon("line")}${CONTACT.line}</a>
      </div>
    </div>
  </div>
</header>`;

    /* ---------------- hero ---------------- */
    const h = t.hero;
    const hero = `<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media">
    ${img("escave-vale-hero", t.meta.ogAlt, "100vw", { eager: true, priority: true, cls: "hero__img" })}
  </div>
  <div class="hero__shade" aria-hidden="true"></div>
  <div class="hero__inner container">
    <div class="hero__copy">
      <p class="hero__tagline" lang="en" data-hero-in>We Breathe Life Into Spaces</p>
      <p class="eyebrow eyebrow--light" data-hero-in>${esc(h.eyebrow)}</p>
      <h1 class="hero__title" id="hero-title">${h.title.map((l, i) => `<span class="hero__line" data-hero-in style="--d:${i + 1}"><span>${esc(l)}</span></span>`).join("")}</h1>
      <p class="hero__lead" data-hero-in style="--d:3">${esc(h.lead)}</p>
      <div class="hero__ctas" data-hero-in style="--d:4">
        ${btn("escaveRegister", h.primary, "primary")}
        ${a("#projects", `<span>${esc(h.secondary)}</span>${icon("arrow-down", "icon btn__icon")}`, "btn btn--ghost-light")}
      </div>
    </div>
    <a class="hero-card" href="#escave" data-hero-in style="--d:5">
      <span class="hero-card__label"><span class="dot" aria-hidden="true"></span>${esc(h.card.label)}</span>
      <span class="hero-card__name">${esc(h.card.name)}</span>
      <span class="hero-card__place">${icon("pin")}${esc(h.card.place)}</span>
      <span class="hero-card__detail">${icon("home")}${esc(h.card.detail)}</span>
      <span class="hero-card__foot"><strong>${esc(h.card.price)}</strong><span class="hero-card__cta">${esc(h.card.cta)}${icon("arrow")}</span></span>
    </a>
  </div>
  <p class="hero__caption container">${esc(h.caption)}</p>
</section>`;

    /* ---------------- about + stats ---------------- */
    const ab = t.about;
    const about = `<section class="about section" id="about" aria-labelledby="about-title">
  <div class="container about__grid">
    <div class="about__copy">
      <p class="eyebrow" data-reveal>${esc(ab.eyebrow)}</p>
      <h2 class="h2" id="about-title" data-reveal>${esc(ab.title)}</h2>
      ${ab.body.map((p) => `<p class="body-lg" data-reveal>${esc(p)}</p>`).join("")}
      <p data-reveal>${a("about", `<span>${esc(ab.link)}</span>${icon("arrow")}`, "link-arrow")}</p>
    </div>
    <div class="about__media" data-reveal="media">
      ${ab.gallery
        .map(
          (g, i) => `<figure class="about__fig about__fig--${["main", "inset", "third"][i]}">${img(
            g.img,
            g.alt,
            i === 0 ? "(min-width: 1024px) 40vw, 90vw" : "(min-width: 1024px) 22vw, 48vw"
          )}<figcaption class="about__label">${icon("pin")}${esc(g.label)}</figcaption></figure>`
        )
        .join("")}
      <p class="about__slogan" lang="en">${esc(ab.slogan)}</p>
    </div>
  </div>
  <div class="container">
    <dl class="stats" data-reveal>
      ${ab.stats
        .map(
          (s, i) => `<div class="stat">
        <dt class="stat__label">${icon(ICON_SETS.stats[i], "icon stat__icon")}<span>${esc(s.label)}</span></dt>
        <dd class="stat__value">${s.prefix ? `<span class="stat__affix">${esc(s.prefix)}</span>` : ""}<span ${
            s.count ? `data-count="${s.value.replace(/,/g, "")}"` : ""
          }>${esc(s.value)}</span>${s.suffix ? `<span class="stat__affix">${esc(s.suffix)}</span>` : ""}</dd>
      </div>`
        )
        .join("")}
    </dl>
  </div>
</section>`;

    /* ---------------- now selling ---------------- */
    const pr = t.projects;
    const projects = `<section class="projects section section--paper" id="projects" aria-labelledby="projects-title">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow" data-reveal>${esc(pr.eyebrow)}</p>
        <h2 class="h2" id="projects-title" data-reveal>${esc(pr.title)}</h2>
      </div>
      <p class="section-head__lead" data-reveal>${esc(pr.lead)}${pr.note ? `<span class="note">${esc(pr.note)}</span>` : ""}</p>
    </div>
    <div class="project-grid">
      ${pr.items
        .map(
          (p, i) => `<article class="project-card project-card--${p.key}" data-reveal style="--d:${i}">
        <a class="project-card__media" href="${esc(href(p.primary.href))}"${extAttrs(p.primary.href)} tabindex="-1" aria-hidden="true">
          ${img(p.img, p.alt, "(min-width: 900px) 46vw, 92vw")}
          <span class="badge${p.key === "escave" ? " badge--accent" : ""}">${esc(p.badge)}</span>
        </a>
        <div class="project-card__body">
          <div class="project-card__top">
            <div>
              <h3 class="project-card__name">${a(p.key, `<span>${esc(p.name)}</span>${icon("arrow-up-right", "icon project-card__name-icon")}`)}</h3>
              <p class="project-card__place">${icon("pin")}${esc(p.place)}</p>
            </div>
            <p class="project-card__price"><span>${esc(p.price)}</span><strong>${esc(p.priceValue)}</strong><span>${esc(p.priceUnit)}</span></p>
          </div>
          <p class="project-card__types">${icon("buildings")}${esc(p.types)}</p>
          <ul class="features">${p.points.map((x, j) => `<li>${icon(ICON_SETS.points[p.key][j], "icon features__icon")}<span>${esc(x)}</span></li>`).join("")}</ul>
          <div class="project-card__ctas">
            ${btn(p.primary.href, p.primary.label, "dark", ext(p.primary.href) ? "arrow-up-right" : "arrow")}
            ${a(p.secondary.href, `<span>${esc(p.secondary.label)}</span>${icon(ext(p.secondary.href) ? "arrow-up-right" : "arrow")}`, "link-arrow")}
          </div>
        </div>
      </article>`
        )
        .join("")}
    </div>
  </div>
</section>`;

    /* ---------------- ESCAVE spotlight ---------------- */
    const e = t.escave;
    const typeTabs = HOUSE_TYPES.map(
      (ht, i) => `<button class="type-tab" type="button" role="tab" id="tab-${ht.id}" aria-controls="panel-${ht.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab>
          <span class="type-tab__name">${ht.name}</span>
          <span class="type-tab__kind">${esc(e.kind[ht.kind])}</span>
          <span class="type-tab__price">${esc(price(ht.price))}</span>
        </button>`
    ).join("");
    const typePanels = HOUSE_TYPES.map(
      (ht, i) => `<div class="type-panel" role="tabpanel" id="panel-${ht.id}" aria-labelledby="tab-${ht.id}" tabindex="0"${i === 0 ? "" : " hidden"} data-panel>
          <div class="viewer" data-viewer aria-label="${esc(e.viewer.gallery(ht.name))}" role="region">
            <div class="viewer__views" role="group" aria-label="${esc(e.viewer.views)}">
              <button type="button" class="viewer__view" data-view="photos" aria-pressed="true">${icon("buildings")}<span>${esc(e.viewer.photos)}</span></button>
              <button type="button" class="viewer__view" data-view="plans" aria-pressed="false">${icon("land")}<span>${esc(e.viewer.plans)}</span></button>
            </div>
            ${["photos", "plans"]
              .map(
                (view) => `<div class="viewer__stage viewer__stage--${view}" data-stage="${view}"${view === "plans" ? " hidden" : ""}>${gallery[ht.id][view]
                  .map((g, k) => {
                    const alt = view === "plans" ? e.viewer.planAlt(ht.name, k + 1) : k < 3 ? e.viewer.extAlt(ht.name) : e.viewer.intAlt(ht.name);
                    const fit = view === "plans" || k >= 3 ? "contain" : "cover";
                    return `<figure class="viewer__slide" data-slide data-fit="${fit}"${k === 0 ? "" : " hidden"}>${gimg(g, alt, "(min-width: 1024px) 50vw, 92vw", false)}${
                      view === "plans" ? `<figcaption class="viewer__floor">${esc(e.viewer.floor(k + 1))}</figcaption>` : ""
                    }</figure>`;
                  })
                  .join("")}</div>`
              )
              .join("")}
            <div class="viewer__bar">
              <p class="viewer__count" aria-live="polite"><span data-count-now>1</span> / <span data-count-total>${gallery[ht.id].photos.length}</span></p>
              <div class="viewer__nav">
                <button type="button" class="viewer__btn" data-prev aria-label="${esc(e.viewer.prev)}">${icon("arrow-left")}</button>
                <button type="button" class="viewer__btn" data-next aria-label="${esc(e.viewer.next)}">${icon("arrow")}</button>
                <button type="button" class="viewer__btn" data-expand aria-label="${esc(e.viewer.expand)}">${icon("expand")}</button>
              </div>
            </div>
          </div>
          <div class="type-panel__info">
            <div class="type-panel__head">
              <h4 class="type-panel__name">${ht.name}</h4>
              <p class="type-panel__kind">${esc(e.kind[ht.kind])}</p>
            </div>
            <dl class="specs">
              <div><dt>${icon("land")}${esc(e.spec.land)}</dt><dd>${ht.land} <small>${esc(e.spec.landUnit)}</small></dd></div>
              <div><dt>${icon("bed")}${esc(e.spec.bed)}</dt><dd>${ht.bed}</dd></div>
              <div><dt>${icon("bath")}${esc(e.spec.bath)}</dt><dd>${ht.bath}</dd></div>
              <div><dt>${icon("car")}${esc(e.spec.park)}</dt><dd>${ht.park}</dd></div>
            </dl>
            <div class="type-panel__foot">
              <p class="type-panel__price"><span>${esc(e.from)}</span><strong>${esc(price(ht.price))}</strong></p>
              ${a(LINKS.escave + "#" + ht.id, `<span>${esc(e.typeCta)}</span>${icon("arrow-up-right")}`, "link-arrow link-arrow--light")}
            </div>
          </div>
        </div>`
    ).join("");

    const escave = `<section class="escave section section--ink" id="escave" aria-labelledby="escave-title">
  <div class="container">
    <div class="escave__intro">
      <div class="escave__title-wrap">
        <p class="eyebrow eyebrow--light" data-reveal><span class="dot" aria-hidden="true"></span>${esc(e.eyebrow)}</p>
        <h2 class="escave__title" id="escave-title" data-reveal><span class="sr-only">${esc(e.title)} ${esc(e.place)}</span><span aria-hidden="true">${esc(e.title)}</span></h2>
        <p class="escave__place" aria-hidden="true" data-reveal>${esc(e.place)}</p>
      </div>
      <div class="escave__text">
        <p class="escave__tagline" data-reveal><span lang="en">${esc(e.tagline)}</span><span class="escave__tagline-sub">${esc(e.taglineSub)}</span></p>
        <p class="escave__body" data-reveal>${esc(e.body)}</p>
      </div>
    </div>
    <dl class="facts" data-reveal>
      ${e.facts.map((f, i) => `<div class="fact">${icon(ICON_SETS.facts[i], "icon fact__icon")}<dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join("")}
    </dl>

    <div class="types" data-reveal>
      <h3 class="h3 types__title">${esc(e.typesTitle)}</h3>
      <div class="types__layout" data-tabs>
        <div class="types__tabs" role="tablist" aria-label="${esc(e.typesLabel)}">${typeTabs}</div>
        <div class="types__panels">${typePanels}</div>
      </div>
    </div>

    <div class="facilities">
      <div class="facilities__head">
        <h3 class="h3" lang="en" data-reveal>${esc(e.facilitiesTitle)}</h3>
        <p data-reveal>${esc(e.facilitiesLead)}</p>
      </div>
      <div class="facilities__gallery">
        ${e.shots
          .map(
            (sh, i) => `<figure class="facilities__shot facilities__shot--${i === 0 ? "main" : "side"}" data-reveal="media">${img(
              sh.img,
              sh.alt,
              i === 0 ? "(min-width: 900px) 62vw, 92vw" : "(min-width: 900px) 36vw, 46vw"
            )}<figcaption class="facilities__caption" lang="${/^[A-Za-z]/.test(sh.label) ? "en" : t.lang}">${icon(["pool", "gate", "tree"][i])}${esc(sh.label)}</figcaption></figure>`
          )
          .join("")}
      </div>
      <ul class="facilities__list">
        ${e.facilities.map((f, i) => `<li data-reveal style="--d:${i}"><span class="facilities__icon">${icon(ICON_SETS.facilities[i])}</span><h4 lang="en">${esc(f.t)}</h4><p>${esc(f.d)}</p></li>`).join("")}
      </ul>
    </div>

    <div class="location">
      <h3 class="h3" data-reveal>${esc(e.locationTitle)}</h3>
      <div class="location__layout">
      <a class="location__map" href="${LINKS.escaveMap}" target="_blank" rel="noopener" data-reveal="media">
        <img src="${BASE}assets/img/map-escave-700.webp" srcset="${BASE}assets/img/map-escave-700.webp 700w, ${BASE}assets/img/map-escave-1400.webp 1400w" sizes="(min-width: 1100px) 44vw, 92vw" width="700" height="500" alt="${esc(e.mapAlt)}" loading="lazy" decoding="async">
        <span class="location__pin" aria-hidden="true"><span class="location__pin-dot"></span><span class="location__pin-label">ESCAVE</span></span>
        <span class="location__map-cta">${icon("pin")}<span>${esc(e.map)}</span>${icon("arrow-up-right")}</span>
        <span class="location__credit">${esc(e.mapCredit)}</span>
        <span class="sr-only"> ${t.ui.newTab}</span>
      </a>
      <div class="location__grid">
        ${e.location
          .map(
            (g, i) => `<div class="location__group" data-reveal style="--d:${i}">
          <h4>${icon(ICON_SETS.location[i])}${esc(g.h)}</h4>
          <ul>${g.items.map(([n, km]) => `<li><span>${esc(n)}</span><span class="location__km">${km} ${esc(e.km)}</span></li>`).join("")}</ul>
        </div>`
          )
          .join("")}
      </div>
      </div>
    </div>

    <div class="escave-cta" data-reveal>
      <p class="escave-cta__title">${esc(e.ctaTitle)}</p>
      <div class="escave-cta__actions">
        ${btn("escaveRegister", e.ctaPrimary, "primary")}
        ${btn("escave", e.ctaSecondary, "ghost-light", "arrow-up-right")}
        <a class="escave-cta__tel" href="${LINKS.tel}">${icon("phone")}${CONTACT.phone}</a>
      </div>
    </div>
    <p class="disclaimer">${esc(e.disclaimer)}</p>
  </div>
</section>`;

    /* ---------------- why ---------------- */
    const w = t.why;
    const why = `<section class="why section" id="why" aria-labelledby="why-title">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow" data-reveal>${esc(w.eyebrow)}</p>
        <h2 class="h2" id="why-title" data-reveal>${esc(w.title)}</h2>
      </div>
      <p class="section-head__lead" data-reveal>${esc(w.lead)}</p>
    </div>
    <ol class="pillars">
      <li class="pillar pillar--brand" data-reveal aria-hidden="true">
        ${img("escave-interior-dining", "", "(min-width: 1100px) 30vw, (min-width: 640px) 46vw, 92vw")}
        <div class="pillar__brand">
          <p class="pillar__slogan" lang="en">We Breathe Life Into Spaces</p>
          <p class="pillar__since">${esc(t.hero.eyebrow)}</p>
        </div>
      </li>
      ${w.items
        .map(
          (p, i) => `<li class="pillar" data-reveal style="--d:${i + 1}">
        <span class="pillar__num" aria-hidden="true">0${i + 1}</span>
        <span class="pillar__icon">${icon(ICON_SETS.pillars[i])}</span>
        <p class="pillar__en" lang="en">${esc(p.en)}</p>
        <h3 class="pillar__title">${esc(p.t)}</h3>
        <p class="pillar__desc">${esc(p.d)}</p>
      </li>`
        )
        .join("")}
    </ol>
  </div>
</section>`;

    /* ---------------- legacy ---------------- */
    const l = t.legacy;
    const year = (be) => (isEn ? be - 543 : be);
    const legacy = `<section class="legacy section section--paper" id="legacy" aria-labelledby="legacy-title">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow" data-reveal>${esc(l.eyebrow)}</p>
        <h2 class="h2" id="legacy-title" data-reveal>${esc(l.title)}</h2>
      </div>
      <div class="section-head__lead">
        <p data-reveal>${esc(l.lead)}</p>
        <dl class="legacy__summary" data-reveal>${l.summary.map((s) => `<div><dt>${esc(s.l)}</dt><dd>${esc(s.v)}</dd></div>`).join("")}</dl>
      </div>
    </div>
  </div>
  <div class="scroller" data-scroller>
    <ol class="scroller__track" aria-label="${esc(l.scrollerLabel)}" tabindex="0" data-scroller-track>
      ${TRACK.map((p) => {
        const name = l.names[p.key];
        const inner = `<figure class="track-card__media">${img(p.img, l.alt(name), "(min-width: 1024px) 26vw, (min-width: 640px) 42vw, 78vw")}${
          p.sold ? `<span class="badge badge--light">${esc(l.sold)}</span>` : ""
        }</figure>
          <div class="track-card__body">
            <p class="track-card__year">${l.yearPrefix ? `<span>${esc(l.yearPrefix)}</span>` : ""}${year(p.be)}</p>
            <h3 class="track-card__name">${esc(name)}</h3>
            <p class="track-card__type">${esc(l.types[p.key])}</p>
            <dl class="track-card__meta">
              <div><dt class="sr-only">${esc(l.units)}</dt><dd>${icon("home")}${p.units.toLocaleString("en-US")} <small>${esc(l.units)}</small></dd></div>
              <div><dt class="sr-only">${esc(l.value)}</dt><dd>${icon("coins")}${p.value.toLocaleString("en-US")} <small>${esc(l.value)}</small></dd></div>
            </dl>
            ${p.link ? `<span class="track-card__link">${esc(l.view)}${icon("arrow-up-right")}</span>` : ""}
          </div>`;
        return `<li class="track-card">${
          p.link ? `<a class="track-card__inner" href="${LINKS[p.link]}"${extAttrs(p.link)}>${inner}<span class="sr-only"> ${t.ui.newTab}</span></a>` : `<div class="track-card__inner">${inner}</div>`
        }</li>`;
      }).join("")}
    </ol>
    <div class="container scroller__controls">
      <div class="scroller__progress" aria-hidden="true"><span data-scroller-bar></span></div>
      <div class="scroller__buttons">
        <button class="icon-btn" type="button" data-scroller-prev aria-label="${t.ui.prev}">${icon("arrow-left")}</button>
        <button class="icon-btn" type="button" data-scroller-next aria-label="${t.ui.next}">${icon("arrow")}</button>
      </div>
    </div>
  </div>
</section>`;

    /* ---------------- knowledge ---------------- */
    const k = t.knowledge;
    const fmtDate = (d) =>
      new Date(d + "T00:00:00Z").toLocaleDateString(isEn ? "en-GB" : "th-TH", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
    const knowledge = `<section class="knowledge section" id="knowledge" aria-labelledby="knowledge-title">
  <div class="container">
    <div class="section-head section-head--row">
      <div>
        <p class="eyebrow" data-reveal>${esc(k.eyebrow)}</p>
        <h2 class="h2" id="knowledge-title" data-reveal>${esc(k.title)}</h2>
        ${k.note ? `<p class="note" data-reveal>${esc(k.note)}</p>` : ""}
      </div>
      <p data-reveal>${a("knowledge", `${icon("book")}<span>${esc(k.all)}</span>${icon("arrow-up-right")}`, "link-arrow")}</p>
    </div>
    <ul class="articles">
      ${ARTICLES.map(
        (ar, i) => `<li class="article" data-reveal style="--d:${i}">
        <a href="${ar.href}" target="_blank" rel="noopener"${isEn ? ' hreflang="th"' : ""}>
          <figure class="article__media">${img(ar.img, "", "(min-width: 900px) 30vw, 92vw")}</figure>
          <p class="article__date">${icon("calendar")}<time datetime="${ar.date}">${fmtDate(ar.date)}</time></p>
          <h3 class="article__title">${esc(k.items[i])}</h3>
          <span class="article__more">${esc(k.read)}${icon("arrow-up-right")}</span>
          <span class="sr-only"> ${t.ui.newTab}</span>
        </a>
      </li>`
      ).join("")}
    </ul>
  </div>
</section>`;

    /* ---------------- contact ---------------- */
    const c = t.contact;
    const fm = c.form;
    const field = (id, type, label, ph, ic, { required = true, auto = "", err = "", extra = "" } = {}) => {
      const tag = type === "textarea"
        ? `<textarea id="f-${id}" name="${id}" rows="4" placeholder="${esc(ph)}"${required ? " required" : ""} aria-describedby="f-${id}-err"></textarea>`
        : `<input id="f-${id}" name="${id}" type="${type}" placeholder="${esc(ph)}"${auto ? ` autocomplete="${auto}"` : ""}${required ? " required" : ""}${extra} aria-describedby="f-${id}-err">`;
      return `<div class="field${type === "textarea" ? " field--full" : ""}" data-field${err ? ` data-error="${esc(err)}"` : ""}>
          <label for="f-${id}">${esc(label)}${required ? '<span class="field__req" aria-hidden="true">*</span>' : ` <span class="field__opt">(${esc(fm.optional)})</span>`}</label>
          <div class="field__control">${icon(ic, "icon field__icon")}${tag}</div>
          <p class="field__error" id="f-${id}-err" aria-live="polite"></p>
        </div>`;
    };
    const contact = `<section class="contact section section--blue" id="contact" aria-labelledby="contact-title">
  <div class="container contact__grid">
    <div class="contact__copy">
      <p class="eyebrow eyebrow--light" data-reveal>${esc(c.eyebrow)}</p>
      <h2 class="h2" id="contact-title" data-reveal>${esc(c.title)}</h2>
      <p class="body-lg" data-reveal>${esc(c.lead)}</p>
      <ol class="steps">
        ${c.steps.map((s, i) => `<li data-reveal style="--d:${i}"><span class="steps__icon">${icon(ICON_SETS.steps[i])}<span class="steps__num">${i + 1}</span></span><div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></li>`).join("")}
      </ol>
      <ul class="quick-channels" data-reveal>
        <li><a href="${LINKS.tel}">${icon("phone")}<span><small>${esc(c.channels.phone)}</small>${CONTACT.phone}</span></a></li>
        <li><a href="${LINKS.line}" target="_blank" rel="noopener">${icon("line")}<span><small>${esc(c.channels.line)}</small>${CONTACT.line}</span></a></li>
        <li><a href="${LINKS.email}">${icon("mail")}<span><small>${esc(c.channels.email)}</small>${CONTACT.email}</span></a></li>
        <li><a href="${LINKS.facebook}" target="_blank" rel="noopener">${icon("facebook")}<span><small>${esc(c.channels.facebook)}</small>${CONTACT.facebook}</span></a></li>
      </ul>
      <address class="office office--light" data-reveal>
        <span class="office__label">${icon("building")}${esc(c.office)}</span>
        <strong>${esc(c.company)}</strong>
        <span>${esc(c.address)}</span>
        ${a("officeMap", `${icon("pin")}<span>${esc(c.map)}</span>`, "link-arrow link-arrow--light")}
      </address>
    </div>
    <div class="contact__panel" data-reveal>
      <form class="enquiry" novalidate data-form data-endpoint="${esc(FORM_ENDPOINT)}" data-mailto="${CONTACT.email}" data-subject="${esc(fm.subject)}" data-summary="${esc(fm.errSummary)}" data-failed="${esc(fm.failed)}" data-sending="${esc(fm.sending)}" data-lang="${t.lang}">
        <div class="enquiry__head">
          <span class="enquiry__icon">${icon("message")}</span>
          <div>
            <h3 class="enquiry__title">${esc(fm.title)}</h3>
            <p class="enquiry__lead">${esc(fm.lead)}</p>
          </div>
        </div>
        <p class="enquiry__alert" role="alert" data-form-alert hidden></p>
        <div class="enquiry__fields">
          ${field("name", "text", fm.name, fm.namePh, "users", { auto: "name", err: fm.errName, extra: ' maxlength="120"' })}
          ${field("email", "email", fm.email, fm.emailPh, "mail", { auto: "email", err: fm.errEmail, extra: ' maxlength="160" inputmode="email"' })}
          ${field("phone", "tel", fm.phone, fm.phonePh, "phone", { auto: "tel", err: fm.errPhone, extra: ' maxlength="20" inputmode="tel"' })}
          ${field("message", "textarea", fm.message, fm.messagePh, "message", { required: false })}
          <div class="enquiry__hp" aria-hidden="true"><label for="f-website">Website</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        </div>
        <button class="btn btn--primary enquiry__submit" type="submit" data-submit><span data-submit-label>${esc(fm.submit)}</span>${icon("arrow", "icon btn__icon")}</button>
        <p class="enquiry__privacy">${icon("shield")}${esc(fm.privacy)}</p>
        <p class="enquiry__alt">${a("escaveRegister", `<span>${esc(fm.alt)}</span>${icon("arrow-up-right")}`, "link-arrow")}</p>
      </form>
      <div class="enquiry-done" data-form-done="sent" hidden tabindex="-1">
        <span class="enquiry-done__icon">${icon("shield")}</span>
        <h3>${esc(fm.sentTitle)}</h3>
        <p>${esc(fm.sentText)}</p>
        <button class="link-arrow" type="button" data-form-reset>${icon("arrow-left")}<span>${esc(fm.again)}</span></button>
      </div>
      <div class="enquiry-done" data-form-done="mail" hidden tabindex="-1">
        <span class="enquiry-done__icon">${icon("mail")}</span>
        <h3>${esc(fm.mailTitle)}</h3>
        <p>${esc(fm.mailText)}</p>
        <div class="enquiry-done__links">
          <a class="btn btn--primary" href="${LINKS.line}" target="_blank" rel="noopener">${icon("line", "icon")}<span>LINE ${CONTACT.line}</span></a>
          <a class="btn btn--ghost-dark" href="${LINKS.tel}">${icon("phone", "icon")}<span>${CONTACT.phone}</span></a>
        </div>
        <button class="link-arrow" type="button" data-form-reset>${icon("arrow-left")}<span>${esc(fm.again)}</span></button>
      </div>
    </div>
  </div>
</section>`;

    /* ---------------- footer ---------------- */
    const f = t.footer;
    const footer = `<footer class="site-footer">
  <div class="container">
    <div class="site-footer__top">
      <div class="site-footer__brand">
        ${logo("logo logo--light")}
        <p class="site-footer__slogan" lang="en">We Breathe Life Into Spaces</p>
        <p>${esc(f.tagline)}</p>
        <ul class="socials">
          <li><a href="${LINKS.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon("facebook")}</a></li>
          <li><a href="${LINKS.line}" target="_blank" rel="noopener" aria-label="LINE ${CONTACT.line}">${icon("line")}</a></li>
          <li><a href="${LINKS.email}" aria-label="Email ${CONTACT.email}">${icon("mail")}</a></li>
          <li><a href="${LINKS.tel}" aria-label="${t.ui.callUs} ${CONTACT.phone}">${icon("phone")}</a></li>
        </ul>
      </div>
      ${f.cols
        .map(
          (col) => `<nav class="site-footer__col" aria-label="${esc(col.h)}">
        <h2>${esc(col.h)}</h2>
        <ul>${col.links.map(([label, key]) => `<li>${a(key, esc(label))}</li>`).join("")}</ul>
      </nav>`
        )
        .join("")}
    </div>
    <div class="site-footer__bottom">
      <p>${esc(f.copy)}${f.thaiNote ? ` <span class="note">${esc(f.thaiNote)}</span>` : ""}</p>
      ${langSwitch("lang--footer")}
      <a class="to-top" href="#top">${esc(f.top)}${icon("arrow-up")}</a>
    </div>
  </div>
</footer>`;

    /* ---------------- back to top ---------------- */
    const backToTop = `<a class="back-to-top" href="#top" data-to-top aria-label="${esc(t.footer.top)}">
  <svg class="back-to-top__ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" pathLength="100"></circle><circle class="back-to-top__bar" cx="24" cy="24" r="22" pathLength="100"></circle></svg>
  ${icon("arrow-up", "icon back-to-top__icon")}
</a>`;

    /* ---------------- full-size image viewer (shared) ---------------- */
    const lightbox = `<dialog class="lightbox" data-lightbox aria-label="${esc(e.viewer.expand)}">
  <figure class="lightbox__figure"><img alt="" data-lightbox-img><figcaption class="lightbox__caption" data-lightbox-caption></figcaption></figure>
  <button type="button" class="lightbox__btn lightbox__close" data-lightbox-close aria-label="${esc(e.viewer.close)}">${icon("close")}</button>
  <button type="button" class="lightbox__btn lightbox__prev" data-lightbox-prev aria-label="${esc(e.viewer.prev)}">${icon("arrow-left")}</button>
  <button type="button" class="lightbox__btn lightbox__next" data-lightbox-next aria-label="${esc(e.viewer.next)}">${icon("arrow")}</button>
  <p class="lightbox__count" aria-live="polite" data-lightbox-count></p>
</dialog>`;

    /* ---------------- chat widget (mirrors the live site's Chaty button) ---------------- */
    const ch = t.ui.chat;
    const chat = `<div class="chat" data-chat>
  <ul class="chat__channels" id="chat-channels" aria-label="${esc(ch.label)}">
    <li style="--i:1"><a class="chat__channel chat__channel--messenger" href="${LINKS.messenger}" target="_blank" rel="noopener"><span class="chat__tip">${esc(ch.messenger)}</span>${icon("messenger")}<span class="sr-only"> ${t.ui.newTab}</span></a></li>
    <li style="--i:0"><a class="chat__channel chat__channel--line" href="${LINKS.line}" target="_blank" rel="noopener"><span class="chat__tip">${esc(ch.line)}</span>${icon("line")}<span class="sr-only"> ${t.ui.newTab}</span></a></li>
  </ul>
  <button class="chat__toggle" type="button" aria-expanded="false" aria-controls="chat-channels" data-chat-toggle aria-label="${esc(ch.open)}" data-label-open="${esc(ch.open)}" data-label-close="${esc(ch.close)}">
    ${icon("chat-bubble", "icon chat__icon chat__icon--open")}${icon("close", "icon chat__icon chat__icon--close")}
  </button>
  <span class="chat__cta" data-chat-cta aria-hidden="true">${esc(ch.cta)}</span>
</div>`;

    /* ---------------- sticky mobile bar ---------------- */
    const sticky = `<nav class="sticky-bar" aria-label="${t.ui.quickContact}" data-sticky>
  <a href="${LINKS.tel}">${icon("phone")}<span>${esc(t.sticky.call)}</span></a>
  <a href="${LINKS.line}" target="_blank" rel="noopener">${icon("line")}<span>${esc(t.sticky.line)}</span></a>
  <a href="${LINKS.messenger}" target="_blank" rel="noopener">${icon("messenger")}<span>${esc(t.sticky.messenger)}</span></a>
  <a class="sticky-bar__primary" href="${LINKS.escaveRegister}" target="_blank" rel="noopener">${icon("calendar")}<span>${esc(t.sticky.visit)}</span></a>
</nav>`;

    return `${head}
<body id="top">
${ICONS}
${LOGO_SYMBOL}
${header}
<main id="main">
${hero}
${about}
${projects}
${escave}
${why}
${legacy}
${knowledge}
${contact}
</main>
${footer}
${backToTop}
${lightbox}
${chat}
${sticky}
</body>
</html>
`;
  };
}
