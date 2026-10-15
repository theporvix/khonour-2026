# Research summary

## 1. The existing site (khonour.co.th)

- **Platform:** WordPress with the Woodmart theme and Elementor Pro. Forms are Elementor forms with Dynamic.ooo conditional fields. LiteSpeed cache.
- **What the current homepage shows:**
  - The tagline "โครงการบ้านที่เข้าใจทุกมิติชีวิตของคุณ ให้บ้านเป็นมากกว่าแค่ที่อยู่อาศัย".
  - A registration form, which shows a visible "A problem was detected in the following Form" warning.
  - 9th Canale as the featured project, and the sold-out track record.
  - A company block (since 2535, 10 projects, 100% quality, 2,000+ units) and the Home Knowledge articles.
- **Content found on inner pages and now on the homepage:**
  - *About:* vision, mission, the full project history with units and value per project, the five brand pillars (Steadfast, Strong, Service, Staff, Superior-value), and "ยินดีให้บริการและให้คำปรึกษาฟรี".
  - *ESCAVE project page (new):* concept, 82 families, 4 house types with land, rooms and starting prices, facilities, a distance table and a Google Maps link.
  - *9th Canale:* Aqua and Terra types, starting prices, a 418 sq.wah park, 16 m roads and the security features.
- **Brand assets:**
  - The logo SVGs use navy `#1f3368`, royal `#0c4da2`, blue `#0072bc` and cyan `#00aeef`.
  - The logo-with-slogan file carries "We Breathe Life Into Spaces".
- **Problems observed on the current homepage:**
  - Placeholder imagery (`dummy.webp`).
  - A broken form warning.
  - No English version.
  - The new flagship (ESCAVE) is missing from the homepage.
  - An empty Promotion category is linked in the navigation.

## 2. Competitor and industry scan

A background agent did this scan with text-only page fetches, so visual and motion details are partly unverified. The sites:

- Sansiri
- SC Asset
- AP Thai
- Land & Houses
- Supalai
- Origin and Ananda (search results only)
- Tridel (Canada)

**Patterns observed:**

- Every big Thai developer leads with a rotating promo carousel. A single, confident flagship hero stands out against that.
- "From X MB" pricing and status tags (New, Ready to move, Sold out) appear on every project card.
- Filtering suits large portfolios. Land & Houses' compact filter is the lightest of the set.
- LINE OA and hotlines are usually buried in the footer. For Thai buyers, LINE is the lowest-friction channel.
- Sansiri and Supalai use a separate TH/EN route with a visible toggle.
- Trust comes from aggregate numbers, brand principles (AP's "Code of Living Quality"), and track record plus testimonials (Tridel).

**How this shaped the design:**

- **A single editorial hero** built on the ESCAVE render, with the price and the "82 families" scarcity visible in the first viewport.
- **Two "Now selling" cards** with prices and status badges. There is no filter UI, because two active projects do not justify one.
- **An ESCAVE deep-dive** with a house-type explorer (specs and price per type), facilities, real distances and a register CTA.
- **Trust from real content only:** stats, the five brand pillars and a timeline of every past project with units and value. No testimonials are invented.
- **LINE and phone surfaced** in the header, the contact section and a sticky mobile bar (Call / LINE / Book a visit).
- **Separate `/` and `/en/` routes** with hreflang tags and a switcher that keeps the visitor on the same section.

**Avoided:**
- Promo carousels, heavy video and mega filters.
- Glassmorphism, gradients-as-decoration and rounded "SaaS" cards.
