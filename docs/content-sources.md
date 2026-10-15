# Content sources and items to confirm

Every fact on the homepage comes from khonour.co.th as of 15 Oct 2026. Nothing was invented: there are no testimonials, awards, certifications or new statistics. Raw extracts are in `source-homepage.txt` and `source-escave.txt`.

| Homepage content | Source page |
|---|---|
| Tagline "บ้านที่เข้าใจทุกมิติชีวิตของคุณ…" | Site title and meta tagline |
| Since 2535 / 10 projects / 2,000+ units | Homepage and About stats |
| "ระบบช่วยเหลือภายใน 24 ชั่วโมง" (after-sales support) | About: brand pillar "Service" |
| Quality materials and contractors, company inspectors at every stage | About: pillar "Strong", mission "รักษาคุณภาพ" |
| Five brand foundations | About: "รากฐานของแบรนด์ เค ออนเนอร์" |
| "ยินดีให้บริการและให้คำปรึกษาฟรี" | About / Contact |
| ESCAVE concept, 82 families, house types, prices, facilities, distances | ESCAVE project page |
| 9th Canale types, 1.39 / 1.59 MB, park, roads, security | 9th Canale project page |
| Track record: years, types, units, values | About: "ประวัติ และผลงานที่ผ่านมา" |
| "2,600+ ล้านบาท" combined project value | Sum of the About-page values (2,639 MB) |
| Contact details, address, LINE, Facebook | Footer / Contact page |
| "We Breathe Life Into Spaces" | Logo-with-slogan SVG |

## Please confirm with K Honour before launch

1. **Is 9th Canale still on sale?** It is featured on the current homepage with starting prices, so it appears under "Now selling". The About page also lists it in the history (2561, 439 units). If it is sold out, remove it from `projects.items` in `src/content.mjs`.
2. **Year order.** The About page gives 2535 as the year the company entered real estate, but Au Thong Village Sukhapiban 5 is dated 2534. Both are shown as published.
3. **About page alignment.** On the live About page, each project's units and value sit *above* the project's heading, which makes them look offset by one row. The homepage uses the reading that matches the current homepage's own cards (for example, Au Thong Place 2 = 283 units / 200 MB).
4. **Images for Au Thong Place 1, 3 and 4** are small, older photos (≤ 900 px). Better photography would lift the timeline.
5. **English names** for older projects (Au Thong Place, Uthong Avenue) follow the site's own URL slugs and spelling.
6. **Promotion** (`/category/promotion/`) is in the menu because the live site has it there, but the category currently has no posts. Add a promotion or remove it from `nav` in `src/content.mjs`.
7. **ESCAVE in the menu.** The live menu has no ESCAVE entry yet. The new homepage lists it under บ้าน (Houses) next to Au Thong Village Sukhapiban 5.
