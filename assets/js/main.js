/* K Honour homepage — progressive enhancement only. The page is fully usable without JS. */
(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Hero entrance ---------- */
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("is-ready")));

  /* ---------- Land on the requested section (e.g. after switching language) ---------- */
  const hashTarget = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (hashTarget) {
    let userMoved = false;
    const stop = () => (userMoved = true);
    ["wheel", "touchstart", "keydown"].forEach((ev) => window.addEventListener(ev, stop, { once: true, passive: true }));
    let setY = null;
    const go = () => {
      if (userMoved || (setY !== null && Math.abs(window.scrollY - setY) > 40)) return;
      hashTarget.scrollIntoView({ behavior: "instant", block: "start" });
      setY = window.scrollY;
    };
    requestAnimationFrame(go);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
    window.addEventListener("load", go, { once: true });
  }

  /* ---------- Sticky header (always visible; turns solid once you scroll) + back to top ---------- */
  const header = $("[data-header]");
  const hero = $(".hero");
  const sticky = $("[data-sticky]");
  const contact = $("#contact");
  const toTop = $("[data-to-top]");
  let ticking = false;
  let menuOpen = false;

  function onScroll() {
    const y = window.scrollY;
    const heroBottom = hero ? hero.offsetHeight - header.offsetHeight : 0;
    header.classList.toggle("is-solid", y > 40);
    if (sticky) {
      const contactTop = contact ? contact.getBoundingClientRect().top : Infinity;
      sticky.classList.toggle("is-visible", y > heroBottom * 0.6 && contactTop > window.innerHeight * 0.6);
    }
    if (toTop) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      toTop.classList.toggle("is-visible", y > window.innerHeight * 0.8);
      toTop.style.setProperty("--progress", String(max > 0 ? Math.min(1, y / max) : 0));
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
      // Move focus to the start of the page for keyboard and screen-reader users
      $(".site-header__brand").focus({ preventScroll: true });
    });
  }

  /* ---------- Mobile menu (focus-trapped, Esc to close) ---------- */
  const toggle = $("[data-menu-toggle]");
  const menu = $("[data-menu]");
  const label = $("[data-menu-label]");
  const main = $("#main");
  const footer = $(".site-footer");

  function setMenu(open) {
    menuOpen = open;
    toggle.setAttribute("aria-expanded", String(open));
    label.textContent = open ? label.dataset.close : label.dataset.open;
    menu.hidden = !open;
    menu.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    [main, footer, sticky].forEach((el) => el && (el.inert = open));
    if (open) {
      const first = $("a", menu);
      first && first.focus({ preventScroll: true });
    }
  }
  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(!menuOpen));
    $$("[data-menu-link]", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (!menuOpen) return;
      if (e.key === "Escape") { setMenu(false); toggle.focus(); return; }
      if (e.key !== "Tab") return;
      const focusables = [toggle, ...$$("a, button", menu)].filter((el) => el.offsetParent !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.matchMedia("(min-width: 1180px)").addEventListener("change", (e) => e.matches && menuOpen && setMenu(false));
  }

  /* ---------- Language switch keeps the visitor on the same section ---------- */
  const sections = $$("main section[id]");
  function currentSection() {
    const mid = window.innerHeight * 0.35;
    let id = "";
    for (const s of sections) if (s.getBoundingClientRect().top <= mid) id = s.id;
    return id;
  }
  $$("[data-lang-link]").forEach((a) => {
    a.addEventListener("click", (e) => {
      if (a.getAttribute("aria-current") === "true") { e.preventDefault(); return; }
      const id = currentSection();
      if (id) a.href = a.pathname + "#" + id;
    });
  });

  /* ---------- Desktop dropdowns (disclosure pattern; hover on mouse devices) ---------- */
  const subs = $$("[data-sub]");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  let subOpenY = 0;
  function setSub(li, open) {
    const trigger = $("[data-sub-trigger]", li);
    const panel = $("[data-sub-panel]", li);
    trigger.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    if (open) {
      subs.forEach((other) => other !== li && setSub(other, false));
      subOpenY = window.scrollY;
    }
    header.classList.toggle("sub-open", subs.some((s) => $("[data-sub-panel]", s).classList.contains("is-open")));
  }
  const closeSubs = () => subs.forEach((li) => setSub(li, false));
  // Scrolling away closes the panel so it never covers the page
  window.addEventListener("scroll", () => {
    if (header.classList.contains("sub-open") && Math.abs(window.scrollY - subOpenY) > 120) closeSubs();
  }, { passive: true });
  subs.forEach((li) => {
    const trigger = $("[data-sub-trigger]", li);
    let timer;
    trigger.addEventListener("click", () => setSub(li, trigger.getAttribute("aria-expanded") !== "true"));
    li.addEventListener("mouseenter", () => { if (canHover.matches) { clearTimeout(timer); setSub(li, true); } });
    li.addEventListener("mouseleave", () => { if (canHover.matches) timer = setTimeout(() => setSub(li, false), 180); });
    li.addEventListener("focusout", (e) => { if (!li.contains(e.relatedTarget)) setSub(li, false); });
    li.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") { setSub(li, false); trigger.focus(); }
    });
  });
  document.addEventListener("click", (e) => subs.forEach((li) => !li.contains(e.target) && setSub(li, false)));

  /* ---------- Mobile menu accordion ---------- */
  $$("[data-acc]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      document.getElementById(btn.getAttribute("aria-controls")).hidden = !open;
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Count-up stats ---------- */
  const counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduceMotion.matches) {
    const fmt = new Intl.NumberFormat("en-US");
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = Number(el.dataset.count);
        const start = performance.now();
        const dur = 1600;
        const step = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = fmt.format(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- House-type tabs (WAI-ARIA tabs pattern) ---------- */
  $$("[data-tabs]").forEach((wrap) => {
    const tabs = $$("[data-tab]", wrap);
    const panels = $$("[data-panel]", wrap);
    function select(i, focus) {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
        panels[j].classList.toggle("is-entering", on && !reduceMotion.matches);
      });
      if (focus) tabs[i].focus();
      tabs[i].scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion.matches ? "auto" : "smooth" });
    }
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(i, false));
      t.addEventListener("keydown", (e) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (e.key in keys) { e.preventDefault(); select((i + keys[e.key] + tabs.length) % tabs.length, true); }
        else if (e.key === "Home") { e.preventDefault(); select(0, true); }
        else if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });
    // Warm the cache so switching types feels instant
    const warm = () => panels.forEach((p) => { const img = $("img", p); if (img) img.loading = "eager"; });
    "requestIdleCallback" in window ? requestIdleCallback(warm) : setTimeout(warm, 1500);
  });

  /* ---------- Track-record scroller ---------- */
  $$("[data-scroller]").forEach((wrap) => {
    const track = $("[data-scroller-track]", wrap);
    const prev = $("[data-scroller-prev]", wrap);
    const next = $("[data-scroller-next]", wrap);
    const bar = $("[data-scroller-bar]", wrap);
    const stepSize = () => {
      const card = track.firstElementChild;
      return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : 300;
    };
    function update() {
      const max = track.scrollWidth - track.clientWidth;
      const visible = track.clientWidth / track.scrollWidth;
      const p = max > 0 ? track.scrollLeft / max : 1;
      bar.parentElement.style.setProperty("--p", String(visible + (1 - visible) * p));
      bar.style.transform = `scaleX(${visible + (1 - visible) * p})`;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    }
    const behavior = () => (reduceMotion.matches ? "auto" : "smooth");
    prev.addEventListener("click", () => track.scrollBy({ left: -stepSize(), behavior: behavior() }));
    next.addEventListener("click", () => track.scrollBy({ left: stepSize(), behavior: behavior() }));
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();

    // Drag to scroll with a mouse (touch already scrolls natively)
    let down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) { moved = true; track.classList.add("is-dragging"); }
      if (moved) track.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      if (moved) setTimeout(() => track.classList.remove("is-dragging"), 0);
    });
    track.addEventListener("click", (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
    track.addEventListener("dragstart", (e) => e.preventDefault());
  });

  /* ---------- Enquiry form: validation + delivery ---------- */
  const form = $("[data-form]");
  if (form) {
    const panel = form.parentElement;
    const alertBox = $("[data-form-alert]", form);
    const submit = $("[data-submit]", form);
    const submitLabel = $("[data-submit-label]", form);
    const idleLabel = submitLabel.textContent;
    const fields = $$("[data-field]", form);
    const digits = (v) => v.replace(/\D/g, "");
    const checks = {
      name: (v) => v.trim().length >= 2,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      phone: (v) => { const d = digits(v); return d.length >= 9 && d.length <= 12; },
      message: () => true,
    };

    function validate(wrap, show) {
      const input = $("input, textarea", wrap);
      const ok = checks[input.name] ? checks[input.name](input.value) : true;
      const err = $(".field__error", wrap);
      if (show) {
        wrap.classList.toggle("is-invalid", !ok);
        wrap.classList.toggle("is-valid", ok && input.value.trim() !== "");
        input.setAttribute("aria-invalid", String(!ok));
        err.textContent = ok ? "" : wrap.dataset.error || "";
      }
      return ok;
    }
    fields.forEach((wrap) => {
      const input = $("input, textarea", wrap);
      input.addEventListener("blur", () => input.value && validate(wrap, true));
      input.addEventListener("input", () => wrap.classList.contains("is-invalid") && validate(wrap, true));
    });

    function show(which) {
      form.hidden = true;
      const done = $(`[data-form-done="${which}"]`, panel);
      done.hidden = false;
      done.focus({ preventScroll: true });
      done.scrollIntoView({ block: "nearest", behavior: reduceMotion.matches ? "auto" : "smooth" });
    }
    $$("[data-form-reset]", panel).forEach((btn) =>
      btn.addEventListener("click", () => {
        $$("[data-form-done]", panel).forEach((d) => (d.hidden = true));
        form.reset();
        fields.forEach((w) => { w.classList.remove("is-valid", "is-invalid"); $(".field__error", w).textContent = ""; });
        form.hidden = false;
        $("input", form).focus();
      })
    );

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      alertBox.hidden = true;
      const invalid = fields.filter((w) => !validate(w, true));
      if (invalid.length) {
        alertBox.textContent = form.dataset.summary;
        alertBox.hidden = false;
        $("input, textarea", invalid[0]).focus();
        return;
      }
      const data = new FormData(form);
      if (data.get("website")) { show("sent"); return; } // honeypot: silently drop bots
      data.delete("website");
      data.append("language", form.dataset.lang);
      data.append("page", location.href);

      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        // No server configured: hand the enquiry to the visitor's email app.
        const label = (n) => $(`label[for="f-${n}"]`, form).firstChild.textContent.trim();
        const body = ["name", "email", "phone", "message"]
          .map((n) => `${label(n)}: ${data.get(n) || "-"}`)
          .join("\n");
        location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(form.dataset.subject)}&body=${encodeURIComponent(body)}`;
        show("mail");
        return;
      }

      submit.disabled = true;
      submit.classList.add("is-loading");
      submitLabel.textContent = form.dataset.sending;
      try {
        const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(String(res.status));
        show("sent");
      } catch {
        alertBox.textContent = form.dataset.failed;
        alertBox.hidden = false;
        alertBox.focus?.();
      } finally {
        submit.disabled = false;
        submit.classList.remove("is-loading");
        submitLabel.textContent = idleLabel;
      }
    });
  }

  /* ---------- Chat widget: Messenger + LINE, same channels as the live site ---------- */
  const chatBox = $("[data-chat]");
  if (chatBox) {
    const chatToggle = $("[data-chat-toggle]", chatBox);
    const chatCta = $("[data-chat-cta]", chatBox);
    const setChat = (open) => {
      chatBox.classList.toggle("is-open", open);
      chatToggle.setAttribute("aria-expanded", String(open));
      chatToggle.setAttribute("aria-label", open ? chatToggle.dataset.labelClose : chatToggle.dataset.labelOpen);
    };
    chatToggle.addEventListener("click", () => {
      chatCta.classList.add("is-seen");
      setChat(!chatBox.classList.contains("is-open"));
    });
    document.addEventListener("click", (e) => { if (!chatBox.contains(e.target)) setChat(false); });
    chatBox.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && chatBox.classList.contains("is-open")) { setChat(false); chatToggle.focus(); }
    });
  }

  /* ---------- Full-size image viewer (shared <dialog>) ---------- */
  const lb = $("[data-lightbox]");
  const lightbox = (() => {
    if (!lb || typeof lb.showModal !== "function") return null;
    const img = $("[data-lightbox-img]", lb);
    const cap = $("[data-lightbox-caption]", lb);
    const count = $("[data-lightbox-count]", lb);
    let items = [], i = 0, opener = null;
    const render = () => {
      const it = items[i];
      img.src = it.src; img.alt = it.alt;
      img.classList.toggle("is-plan", it.plan);
      cap.textContent = it.caption || "";
      count.textContent = `${i + 1} / ${items.length}`;
      if (items[i + 1]) new Image().src = items[i + 1].src; // preload next
    };
    const go = (d) => { i = (i + d + items.length) % items.length; render(); };
    $("[data-lightbox-prev]", lb).addEventListener("click", () => go(-1));
    $("[data-lightbox-next]", lb).addEventListener("click", () => go(1));
    $("[data-lightbox-close]", lb).addEventListener("click", () => lb.close());
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    });
    let sx = null;
    lb.addEventListener("pointerdown", (e) => { sx = e.clientX; });
    lb.addEventListener("pointerup", (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 50) go(e.clientX < sx ? 1 : -1); sx = null; });
    lb.addEventListener("close", () => { root.style.overflow = ""; opener && opener.focus({ preventScroll: true }); });
    return {
      open(list, index, from) {
        items = list; i = index; opener = from;
        render();
        root.style.overflow = "hidden";
        lb.showModal();
      },
    };
  })();

  /* ---------- House-type viewer: photos / floor plans ---------- */
  $$("[data-viewer]").forEach((viewer) => {
    const nowEl = $("[data-count-now]", viewer);
    const totalEl = $("[data-count-total]", viewer);
    const viewBtns = $$("[data-view]", viewer);
    let view = "photos";
    let idx = 0;
    const stage = () => $(`[data-stage="${view}"]`, viewer);
    const slides = () => $$("[data-slide]", stage());

    function show(n, dir = 1) {
      const list = slides();
      const next = (n + list.length) % list.length;
      list[idx] && (list[idx].hidden = true);
      const el = list[next];
      el.hidden = false;
      el.style.setProperty("--dir", String(dir));
      if (!reduceMotion.matches) { el.classList.remove("is-entering"); void el.offsetWidth; el.classList.add("is-entering"); }
      idx = next;
      nowEl.textContent = String(idx + 1);
      totalEl.textContent = String(list.length);
      // Preload the neighbours so flicking feels instant
      [list[(idx + 1) % list.length], list[(idx - 1 + list.length) % list.length]].forEach((s) => { const im = $("img", s); if (im) im.loading = "eager"; });
    }
    function setView(v) {
      if (v === view) return;
      slides().forEach((s) => (s.hidden = true));
      stage().hidden = true;
      view = v;
      stage().hidden = false;
      viewBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === v)));
      idx = 0;
      show(0);
    }
    viewBtns.forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
    $("[data-prev]", viewer).addEventListener("click", () => show(idx - 1, -1));
    $("[data-next]", viewer).addEventListener("click", () => show(idx + 1, 1));

    const openFull = (from) => {
      if (!lightbox) return;
      const list = slides().map((s) => {
        const im = $("img", s);
        const cap = $("figcaption", s);
        return { src: im.dataset.full, alt: im.alt, caption: cap ? cap.textContent : im.alt, plan: view === "plans" };
      });
      lightbox.open(list, idx, from);
    };
    $("[data-expand]", viewer).addEventListener("click", (e) => openFull(e.currentTarget));

    viewer.addEventListener("keydown", (e) => {
      if (e.target.closest("[data-view]")) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); show(idx - 1, -1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(idx + 1, 1); }
    });

    // Swipe to flick through; a plain tap/click opens the full-size view
    $$("[data-stage]", viewer).forEach((st) => {
      let sx = null, sy = null;
      st.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; });
      st.addEventListener("pointerup", (e) => {
        if (sx === null) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        sx = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) openFull($("[data-expand]", viewer));
      });
      st.addEventListener("dragstart", (e) => e.preventDefault());
    });
  });
})();
