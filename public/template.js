/* Renders a resume to standalone A4 HTML — used by the live preview and by the
   browser's print-to-PDF.

   Every template shares ONE data model. A template only changes PRESENTATION,
   so switching never loses or rewrites anything.

   Two builders cover every template:

     singleColumn(v, S)   ATS First + Hybrid  — one column, plain flow
     twoColumn(v, S)      Human First         — sidebar + main

   A "style" object S carries the differences (typography, rules, colours,
   photo treatment, decorative shapes…), so adding a template means adding a
   preset, not another renderer.

   Section headings are translated with i18n.js using the resume's own `lang`
   field ("en" | "bs"), so the printed CV follows the language picked in the app. */
(function (global, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./i18n.js"));
  else global.RenderResume = factory(global.I18n);
})(typeof self !== "undefined" ? self : this, function (I18n) {
  /* Loud-but-safe fallback: a missing i18n.js leaves raw keys instead of crashing. */
  const I = I18n || { normalizeLang: () => "en", t: (_l, k) => k };

  /* ------------------------------------------------------------------ shared */
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const has = (v) => String(v ?? "").trim().length > 0;
  const ic = (name, style = "solid", extra = "") =>
    `<i class="fa-${style} fa-${esc(name)} ${extra}"></i>`;
  const px = (n) => (Number.isFinite(n) ? n + "px" : n);

  /* Curated font registry — key -> Google Fonts query + CSS stack.
     carlito/opensans/cormorant exist so the ATS templates can reproduce the
     typography of the source documents they were modelled on. */
  const FONTS = {
    inter:      { label: "Inter",              stack: `"Inter", system-ui, sans-serif`,                  q: "Inter:wght@400;600;700" },
    sourcesans: { label: "Source Sans 3",      stack: `"Source Sans 3", system-ui, sans-serif`,          q: "Source+Sans+3:wght@400;600;700" },
    lora:       { label: "Lora",               stack: `"Lora", Georgia, serif`,                          q: "Lora:wght@400;600;700" },
    poppins:    { label: "Poppins",            stack: `"Poppins", system-ui, sans-serif`,                q: "Poppins:wght@400;600;700" },
    carlito:    { label: "Carlito (Calibri)",  stack: `"Carlito", "Calibri", system-ui, sans-serif`,     q: "Carlito:wght@400;700" },
    opensans:   { label: "Open Sans",          stack: `"Open Sans", system-ui, sans-serif`,              q: "Open+Sans:wght@400;600;700" },
    cormorant:  { label: "Cormorant Garamond", stack: `"Cormorant Garamond", Garamond, Georgia, serif`,  q: "Cormorant+Garamond:wght@500;600;700" },
  };

  /* Fixed section chrome — every key maps to an icon plus an i18n label. */
  const SECTIONS = {
    contact:    "paper-plane",
    hobbies:    "heart",
    languages:  "language",
    license:    "car-side",
    summary:    "quote-left",
    education:  "graduation-cap",
    experience: "folder-open",
    skills:     "code",
  };
  const SECTION_KEYS = Object.keys(SECTIONS);
  const sectionMeta = (lang) =>
    Object.fromEntries(SECTION_KEYS.map((k) => [k, [I.t(lang, "resume." + k), SECTIONS[k]]]));

  /* Widest thing a skill column must hold, in characters, for 4 -> 3 -> 2 -> 1
     columns: a label only wraps between words, so its longest WORD is what can
     overflow a narrow column. */
  const SKILL_COL_LIMITS = [12, 17, 29];

  const placeholderPhoto = (ini) =>
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#37474f"/><text x="50%" y="55%" font-family="Arial,sans-serif" font-size="150" fill="#fff" text-anchor="middle">${ini}</text></svg>`
    );

  /* Experience descriptions are plain text, but a line starting with -, *, •, ‣ or ·
     becomes a real list item. */
  const BULLET_RE = /^\s*(?:[-*•‣·])\s+/;
  function descriptionHtml(raw, listClass = "desc-list") {
    const lines = String(raw || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const out = [];
    let bullets = [];
    const flush = () => {
      if (!bullets.length) return;
      out.push(`<ul class="${listClass}">${bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`);
      bullets = [];
    };
    for (const line of lines) {
      if (BULLET_RE.test(line)) bullets.push(line.replace(BULLET_RE, ""));
      else { flush(); out.push(`<span class="text-desc">${esc(line)}</span><br />`); }
    }
    flush();
    return out.join("");
  }

  /** "#009688" -> "rgba(0,150,136,0.08)" */
  function tint(hex, alpha) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
    if (!m) return `rgba(0, 150, 136, ${alpha})`;
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }

  /** Darker (factor < 1) or lighter (factor > 1) shade of a hex colour. */
  function shade(hex, factor = 0.75) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
    if (!m) return factor <= 1 ? "#00695c" : "#4db6ac";
    const n = parseInt(m[1], 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
      const v = factor <= 1 ? c * factor : c + (255 - c) * (factor - 1);
      return Math.max(0, Math.min(255, Math.round(v)));
    });
    return `rgb(${ch[0]}, ${ch[1]}, ${ch[2]})`;
  }

  /* ------------------------------------------------------------------- shell */
  function page({ lang, title, font, css, body, multipage, bootstrap = true, icons = true }) {
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <title>${esc(title)}</title>
  <style>@import url("https://fonts.googleapis.com/css2?family=${font.q}&display=swap");</style>
${bootstrap ? `  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css" />\n` : ""}${icons ? `  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />\n` : ""}  <style>
    @page { size: A4; margin: 0; }
    html, body { margin: 0; padding: 0; }
    body { width: 210mm; height: 297mm; overflow: hidden;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
      font-family: ${font.stack}; }
    body * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body, p, a, h1, h2, h3, h4, h5, h6, span, li, div, dt, dd, section {
      font-family: ${font.stack} !important; }
    [data-fit] { overflow: hidden; }
    body.multipage { height: auto; overflow: visible; }
    body.multipage [data-fit] { height: auto !important; overflow: visible !important; }
    @media print { h1, h2, h3, h4, p, li, article, .job, .entry, .sec, .m-sec { break-inside: avoid; } }
${css}
  </style>
</head>
<body class="${multipage ? "multipage" : ""}">
${body}
  <script>
    (function () {
      if (document.body.classList.contains("multipage")) { window.__layoutReady = Promise.resolve(); return; }
      window.__layoutReady = (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
        return new Promise(function (r) { requestAnimationFrame(function () {
          var boxes = Array.prototype.slice.call(document.querySelectorAll("[data-fit]"));
          var size = 100, root = document.documentElement;
          function fits() {
            for (var i = 0; i < boxes.length; i++) {
              if (boxes[i].scrollHeight > boxes[i].clientHeight + 1) return false;
            }
            return true;
          }
          while (!fits() && size > 55) { size -= 1.5; root.style.fontSize = size + "%"; }
          document.body.dataset.fitSize = size;
          r();
        }); });
      });
    })();
  <\/script>
</body>
</html>`;
  }

  /* ------------------------------------------------------- shared data view */
  function prepare(d) {
    d = d || {};
    const lang = I.normalizeLang(d.lang);
    const contact = d.contact || {};
    const name = String(d.name || "");
    return {
      d,
      lang,
      T: sectionMeta(lang),
      userFont: FONTS[d.font] || FONTS.inter,
      accent: d.accent || "#009688",
      sideBg: d.sideBg || "#212529",
      multipage: !!d.multipage,
      name,
      role: String(d.role || ""),
      summary: String(d.summary || ""),
      contact: {
        phone: String(contact.phone || ""),
        email: String(contact.email || ""),
        address: String(contact.address || ""),
      },
      initials: name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "CV",
      photo: d.photo || "",
      education: (d.education || []).filter((e) => has(e.degree) || has(e.school)),
      experience: (d.experience || []).filter((e) => has(e.role) || has(e.company)),
      skills: (d.skills || []).filter(has),
      languages: (d.languages || []).filter((l) => has(l.name)),
      hobbies: (d.hobbies || []).filter((h) => has(h.label)),
      license: String(d.license || ""),
      extraSidebar: (d.extraSidebar || []).filter((s) => has(s.title) || (s.lines || []).some(has)),
      extraMain: (d.extraMain || []).filter((s) => has(s.title) || (s.lines || []).some(has)),
    };
  }

  function skillColumns(skills) {
    const longest = skills.reduce((m, s) => Math.max(m, String(s).trim().length), 0);
    const longestWord = skills.reduce((m, s) =>
      Math.max(m, ...String(s).trim().split(/\s+/).map((w) => w.length)), 0);
    const need = Math.max(longestWord, Math.ceil(longest / 2));
    return need <= SKILL_COL_LIMITS[0] ? 4
         : need <= SKILL_COL_LIMITS[1] ? 3
         : need <= SKILL_COL_LIMITS[2] ? 2 : 1;
  }

  /* ======================================================================
     singleColumn — ATS First (restrained) and Hybrid (structured + visual)
     ====================================================================== */
  function singleColumn(v, S) {
    const T = v.T;
    const accent = v.accent;
    const font = S.font ? FONTS[S.font] : v.userFont;
    const acc = (c) => (c === "accent" ? accent : c === "accentDark" ? shade(accent, 0.62) : c);

    const contactBits = [
      has(v.contact.phone) ? ["form.phone", v.contact.phone] : null,
      has(v.contact.email) ? ["form.email", v.contact.email] : null,
      has(v.contact.address) ? ["form.location", v.contact.address] : null,
    ].filter(Boolean);

    const contactHtml = !contactBits.length ? ""
      : S.contact.grid
        ? `<dl class="facts">${contactBits.map(([k, val]) =>
            `<dt>${esc(I.t(v.lang, k))}</dt><dd>${esc(val)}</dd>`).join("")}</dl>`
        : S.contact.labels
          ? `<ul class="contact">${contactBits.map(([k, val]) =>
              `<li><span class="lbl">${esc(I.t(v.lang, k))}:</span> ${esc(val)}</li>`).join("")}</ul>`
          : `<p class="contact-line">${contactBits.map(([, val]) => esc(val)).join(esc(S.contact.sep))}</p>`;

    const photoHtml = (v.photo && S.photo)
      ? `<img class="photo ${S.photo.shape}" src="${esc(v.photo)}" alt="" />` : "";

    const sec = (title, body) => body
      ? `<section class="sec"><h2>${esc(title)}</h2>${body}</section>` : "";
    const lines = (arr) => arr.filter(has).map((l) => `<p class="line">${esc(l)}</p>`).join("");

    const expBody = v.experience.map((e) => {
      const period = has(e.period) ? `<span class="per">${esc(e.period)}</span>` : "";
      const company = has(e.company) ? `<p class="co">${esc(e.company)}</p>` : "";
      const metaParts = [has(e.company) ? esc(e.company) : "", has(e.period) ? esc(e.period) : ""]
        .filter(Boolean).join(`<span class="sep"> ${esc(S.entry.sep)} </span>`);
      const head = S.entry.layout === "split"
        ? `<div class="top">${has(e.role) ? `<h3>${esc(e.role)}</h3>` : ""}${period}</div>${company}`
        : S.entry.layout === "inline"
          ? `<h3>${esc(e.role)}${metaParts ? ` <span class="meta-inline"><span class="sep"> ${esc(S.entry.sep)} </span>${metaParts}</span>` : ""}</h3>`
          : `${has(e.role) ? `<h3>${esc(e.role)}</h3>` : ""}${metaParts ? `<p class="meta">${metaParts}</p>` : ""}`;
      const tags = (e.tags || []).filter(has);
      return `<div class="job">${head}${descriptionHtml(e.description, "desc-list")}${
        tags.length ? `<p class="tags">${S.tags.labels ? `<span class="lbl">${esc(I.t(v.lang, "resume.tags"))}:</span> ` : ""}${tags.map(esc).join(", ")}</p>` : ""}</div>`;
    }).join("");

    const eduBody = v.education.map((e) => `
      <div class="edu">
        ${has(e.degree) ? `<h3>${esc(e.degree)}</h3>` : ""}
        ${has(e.school) ? `<p class="meta">${esc(e.school)}</p>` : ""}
      </div>`).join("");

    const skillsBody = !v.skills.length ? ""
      : S.skills.mode === "inline" ? `<p class="line">${v.skills.map(esc).join(", ")}</p>`
      : S.skills.mode === "grid"
        ? `<div class="skills-grid" style="grid-template-columns:repeat(${
            S.skills.cols || skillColumns(v.skills)},minmax(0,1fr))">${
            v.skills.map((s) => `<p class="skill">${S.skills.bullets ? ic("circle-dot", "regular", "color-mark") : ""}${esc(s)}</p>`).join("")}</div>`
        : `<ul class="skills-list">${v.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`;

    const langBody = v.languages.map((l) =>
      `<p class="line">${esc(l.name)}${has(l.level) ? `${esc(S.langSep)}${esc(l.level)}` : ""}</p>`).join("");
    const hobbyBody = v.hobbies.length
      ? `<p class="line">${v.hobbies.map((h) => esc(h.label)).join(esc(S.hobbySep))}</p>` : "";

    const head = `
      <div class="head">
        ${S.photo && S.photo.side === "left" ? photoHtml : ""}
        <div class="who">
          <h1 class="name">${esc(v.name)}</h1>
          ${has(v.role) ? `<p class="role">${esc(v.role)}</p>` : ""}
        </div>
        ${S.photo && S.photo.side !== "left" ? photoHtml : ""}
      </div>`;

    const body = `
  <div class="sheet" data-fit>
    ${S.band ? `<header class="band">${head}${contactHtml}${S.headerRule ? `<hr class="head-rule" />` : ""}</header>`
            : `<header class="head-wrap">${head}${contactHtml}${S.headerRule ? `<hr class="head-rule" />` : ""}</header>`}
    <div class="flow">
      ${v.extraSidebar.map((s) => sec(s.title, lines(s.lines || []))).join("")}
      ${sec(T.summary[0], has(v.summary) ? `<p class="line">${esc(v.summary)}</p>` : "")}
      ${sec(T.experience[0], expBody)}
      ${sec(T.education[0], eduBody)}
      ${sec(T.skills[0], skillsBody)}
      ${sec(T.languages[0], langBody)}
      ${sec(T.license[0], has(v.license) ? `<p class="line">${esc(v.license)}</p>` : "")}
      ${sec(T.hobbies[0], hobbyBody)}
      ${v.extraMain.map((s) => sec(s.title, lines(s.lines || []))).join("")}
    </div>
  </div>`;

    const pad = S.page;
    const css = `
    body { color: ${S.body.color}; font-size: ${px(S.body.size)}; }
    .sheet { height: 100%; box-sizing: border-box; padding: ${px(pad.top)} ${px(pad.x)} ${px(pad.bottom)}; }
    ${S.frame ? `.sheet { box-shadow: inset 0 0 0 ${px(S.frame.size)} ${acc(S.frame.color)}; }` : ""}
    ${S.headAlign ? `.head-wrap .head { text-align: ${S.headAlign}; }
      .head-wrap .name, .head-wrap .role { text-align: ${S.headAlign}; }
      .head-wrap .contact-line { text-align: ${S.headAlign}; }
      .head-wrap .contact { display: inline-block; text-align: left; }
      .head-wrap .facts { display: inline-grid; }` : ""}
    ${S.band ? `.band { background: ${acc(S.band.bg)}; text-align: ${S.band.align};
      ${S.band.bleed ? `margin: ${px(-pad.top)} ${px(-pad.x)} ${px(S.flowGap)}; padding: ${px(pad.top)} ${px(pad.x)} ${px(S.band.padBottom)};` : `padding: 0 0 ${px(S.band.padBottom)}; margin: 0 0 ${px(S.flowGap)};`}
      ${S.band.rule ? `border-bottom: ${px(S.band.rule.size)} solid ${acc(S.band.rule.color)};` : ""} }
      .band .head { text-align: ${S.band.align}; }
      .band .name, .band .role, .band .contact-line { text-align: ${S.band.align}; }
      .band .contact { display: inline-block; text-align: left; }
      .band .facts { display: inline-grid; }` : ""}
    .head { display: flex; gap: ${px(22)}; align-items: center; }
    .head .who { flex: 1; min-width: 0; }
    .name { font-size: ${px(S.name.size)}; font-weight: ${S.name.weight}; margin: 0;
      color: ${acc(S.name.color)}; ${S.name.caps ? "text-transform: uppercase;" : ""}
      ${S.name.spacing ? `letter-spacing: ${S.name.spacing}em;` : ""} line-height: 1.15; }
    .role { font-size: ${px(S.role.size)}; margin: ${px(S.role.gapTop)} 0 0; color: ${acc(S.role.color)};
      ${S.role.caps ? "text-transform: uppercase;" : ""}
      ${S.role.spacing ? `letter-spacing: ${S.role.spacing}em;` : ""} }
    ${S.photo ? `.photo { width: ${px(S.photo.size)}; height: ${px(S.photo.size)}; object-fit: cover; flex: none;
      border-radius: ${S.photo.shape === "circle" ? "50%" : S.photo.shape === "rounded" ? "8px" : "0"};
      ${S.photo.ring ? `border: ${px(S.photo.ring.size)} solid ${acc(S.photo.ring.color)}; ` : ""} }` : ""}
    .contact-line { margin: ${px(S.contact.gapTop)} 0 0; font-size: ${px(S.contact.size)};
      color: ${S.contact.color}; }
    .contact { margin: ${px(S.contact.gapTop)} 0 0; padding: 0; list-style: none; font-size: ${px(S.contact.size)}; }
    .contact li { margin: 0 0 ${px(3)}; }
    .contact .lbl { font-weight: 600; }
    .facts { grid-template-columns: auto 1fr; gap: ${px(3)} ${px(10)};
      margin: ${px(S.contact.gapTop)} 0 0; font-size: ${px(S.contact.size)}; }
    .facts dt { font-weight: 600; color: ${S.contact.color}; }
    .facts dd { margin: 0; }
    ${S.headerRule ? `.head-rule { border: 0; border-top: ${px(S.headerRule.size)} solid ${acc(S.headerRule.color)};
      margin: ${px(S.headerRule.gapTop)} 0 0; }` : ""}
    .sec { margin-top: ${px(S.heading.gapTop)}; }
    .sec > h2 { font-size: ${px(S.heading.size)}; font-weight: ${S.heading.weight}; margin: 0;
      color: ${acc(S.heading.color)}; text-align: ${S.heading.align};
      ${S.heading.caps ? "text-transform: uppercase;" : ""}
      ${S.heading.spacing ? `letter-spacing: ${S.heading.spacing}em;` : ""}
      ${S.heading.rule === "below" ? `padding-bottom: ${px(4)}; border-bottom: ${px(S.heading.ruleSize)} solid ${acc(S.heading.ruleColor)};` : ""}
      ${S.heading.rule === "above" ? `padding-top: ${px(6)}; border-top: ${px(S.heading.ruleSize)} solid ${acc(S.heading.ruleColor)};` : ""}
      ${S.heading.rule === "side" ? `padding-left: ${px(9)}; border-left: ${px(3)} solid ${acc(S.heading.ruleColor)};` : ""}
      margin-bottom: ${px(S.heading.gapBottom)}; }
    .job, .edu { margin-bottom: ${px(S.entry.gap)}; }
    .job:last-child, .edu:last-child { margin-bottom: 0; }
    .job h3, .edu h3 { font-size: ${px(S.entry.titleSize)}; font-weight: ${S.entry.titleWeight};
      margin: 0; color: ${acc(S.entry.titleColor)}; line-height: 1.35; }
    .job .meta, .edu .meta { font-size: ${px(S.entry.metaSize)}; color: ${S.entry.metaColor};
      margin: ${px(1)} 0 0; ${S.entry.metaWeight ? `font-weight: ${S.entry.metaWeight};` : ""} }
    .job .meta .sep, .job .meta-inline .sep { color: ${S.entry.sepColor}; font-weight: 400; }
    .job .meta-inline { font-size: ${px(S.entry.metaSize)}; font-weight: ${S.entry.metaWeight || 400};
      color: ${S.entry.metaColor}; }
    .job .top { display: flex; justify-content: space-between; align-items: baseline; gap: ${px(14)}; }
    .job .co { font-size: ${px(S.entry.metaSize)}; color: ${S.entry.metaColor}; margin: ${px(2)} 0 0;
      font-weight: ${S.entry.metaWeight || 400}; }
    .per { font-size: ${px(S.entry.perSize)}; color: ${S.entry.perColor}; white-space: nowrap; }
    ul.desc-list, ul.bul { margin: ${px(4)} 0 0; padding-left: ${px(S.bullets.indent)};
      font-size: ${px(S.bullets.size)}; }
    ul.desc-list li, ul.bul li { margin: 0 0 ${px(S.bullets.gap)}; line-height: 1.45; }
    .text-desc { font-size: ${px(S.bullets.size)}; line-height: 1.45; }
    .line { font-size: ${px(S.body.size)}; margin: 0 0 ${px(4)}; line-height: 1.5; }
    .line:last-child { margin-bottom: 0; }
    .tags { margin: ${px(5)} 0 0; font-size: ${px(S.entry.metaSize - 0.5)}; color: ${S.entry.metaColor}; }
    .tags .lbl { font-weight: 600; }
    .skills-grid { display: grid; gap: ${px(3)} ${px(24)}; font-size: ${px(S.body.size)}; margin: 0; }
    .skills-grid .skill { margin: 0; line-height: 1.5; min-width: 0; overflow-wrap: break-word; }
    .skills-grid .skill .fa { color: ${accent}; font-size: .8em; margin-right: ${px(5)}; }
    .skills-list { margin: 0; padding-left: ${px(18)}; font-size: ${px(S.body.size)}; }
    .skills-list li { margin: 0 0 ${px(3)}; line-height: 1.5; }
    `;

    return page({
      lang: v.lang, title: v.name || "CV", font, css, body,
      multipage: v.multipage, bootstrap: false, icons: false,
    });
  }

  /* ======================================================================
     twoColumn — Human First
     ====================================================================== */
  function twoColumn(v, S) {
    const T = v.T;
    const accent = v.accent;
    const font = S.font ? FONTS[S.font] : v.userFont;
    const side = S.side;
    const sideBg = side.bg === "accent" ? accent : side.bg === "custom" ? v.sideBg : side.bg;
    const photo = v.photo || (S.photo.placeholder ? placeholderPhoto(v.initials) : "");
    const icon = (name) => ic(name, S.icons);

    /* ---------- sidebar ---------- */
    const sideBlocks = [];
    const cRows = [];
    if (has(v.contact.phone))
      cRows.push(`<p class="s-line">${icon("phone")} <span>${esc(v.contact.phone)}</span></p>`);
    if (has(v.contact.email))
      cRows.push(`<p class="s-line">${icon("envelope")} <a href="mailto:${esc(v.contact.email)}">${esc(v.contact.email)}</a></p>`);
    if (has(v.contact.address))
      cRows.push(`<p class="s-line">${icon("location-dot")} <span>${esc(v.contact.address)}</span></p>`);
    if (cRows.length) sideBlocks.push({ key: "contact", body: cRows.join("") });

    if (v.hobbies.length)
      sideBlocks.push({ key: "hobbies", body: `<ul class="s-list">${v.hobbies
        .map((h) => `<li>${S.hobbyIcons ? icon(h.icon || "star") + " " : ""}${esc(h.label)}</li>`).join("")}</ul>` });

    if (v.languages.length)
      sideBlocks.push({ key: "languages", body: v.languages
        .map((l) => `<p class="s-line">${esc(l.name)}${has(l.level) ? ` <span class="s-muted">| ${esc(l.level)}</span>` : ""}</p>`).join("") });

    if (has(v.license))
      sideBlocks.push({ key: "license", body: `<p class="s-line">${esc(v.license)}</p>` });

    v.extraSidebar.forEach((s) => sideBlocks.push({
      key: null, title: s.title, iconName: s.icon,
      body: (s.lines || []).filter(has).map((l) => `<p class="s-line">${esc(l)}</p>`).join(""),
    }));

    const sideHtml = sideBlocks.map((b) => {
      const meta = b.key ? T[b.key] : null;
      const title = b.title || (meta ? meta[0] : "");
      const iconName = b.iconName || (meta ? meta[1] : "star");
      return `<section class="s-sec">
        <h5 class="s-title">${S.sideIcons ? icon(iconName) + " " : ""}${esc(title)}</h5>
        <hr class="s-rule" />${b.body}</section>`;
    }).join("");

    /* ---------- main ---------- */
    const mainBlocks = [];
    if (has(v.summary))
      mainBlocks.push({ key: "summary", body: `<p class="justify">${esc(v.summary)}</p>` });

    if (v.education.length)
      mainBlocks.push({ key: "education", body: v.education.map((e) => `
        <div class="entry">
          <p class="e-title">${esc(e.degree)}${has(e.school) ? ` <span class="e-sub">| ${esc(e.school)}</span>` : ""}</p>
        </div>`).join("") });

    if (v.experience.length)
      mainBlocks.push({ key: "experience", body: v.experience.map((e) => `
        <div class="entry">
          <p class="e-title">${icon("angle-right")} <b>${esc(e.role)}</b>${
            has(e.company) ? ` <span class="e-company">${esc(e.company)}</span>` : ""}</p>
          ${has(e.period) ? `<p class="e-period">${esc(e.period)}</p>` : ""}
          ${descriptionHtml(e.description)}
          ${(e.tags || []).filter(has).map((t) => `<span class="e-tag">${esc(t)}</span>`).join(" ")}
        </div>
        <hr class="e-sep" />`).join("") });

    if (v.skills.length) {
      const cols = S.skillsCols || skillColumns(v.skills);
      mainBlocks.push({ key: "skills", body: S.skillsAs === "badges"
        ? `<p class="skill-badges">${v.skills.map((s) => `<span class="e-tag">${esc(s)}</span>`).join(" ")}</p>`
        : `<div class="skills-grid" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${
            v.skills.map((s) => `<p class="skill">${icon("circle-dot")}<span>${esc(s)}</span></p>`).join("")}</div>` });
    }

    v.extraMain.forEach((s) => {
      const body = (s.lines || []).filter(has);
      mainBlocks.push({ key: null, title: s.title, iconName: s.icon,
        body: body.map((l) => `<p class="${body.length > 1 ? "justify" : ""}">${esc(l)}</p>`).join("") });
    });

    const mainHtml = mainBlocks.map((b) => {
      const meta = b.key ? T[b.key] : null;
      const title = b.title || (meta ? meta[0] : "");
      const iconName = b.iconName || (meta ? meta[1] : "star");
      return `<section class="m-sec">
        <h4 class="m-title">${S.mainIcons ? icon(iconName) + " " : ""}${esc(title)}</h4>
        <hr class="m-rule" />${b.body}</section>`;
    }).join("");

    const nameBlock = `<h1 class="name">${esc(v.name)}</h1>`;
    const roleBlock = has(v.role)
      ? (S.roleStyle === "badge"
        ? `<p class="role-badge">${esc(v.role)}</p>`
        : S.roleStyle === "plain"
          ? `<p class="role">${esc(v.role)}</p>`
          : `<div class="role-row"><span class="role-bar"></span><span class="role">${esc(v.role)}</span></div>`)
      : "";

    const headerBar = S.header === "band"
      ? `<header class="top-band"><div class="band-text">${nameBlock}${roleBlock}</div>${
          photo ? `<img class="band-photo" src="${photo}" alt="" />` : ""}</header>`
      : "";

    const sideTop = S.header === "side"
      ? `<div class="side-head">${photo ? `<img class="side-photo" src="${photo}" alt="" />` : ""}${nameBlock}${roleBlock}</div>`
      : (S.header === "main" && photo ? `<img class="side-photo" src="${photo}" alt="" />` : "");

    const body = `
  <div class="layout">
    <aside class="sidebar" data-fit>
      ${S.shape ? `<div class="shape shape-${S.shape}"></div>` : ""}
      <div class="side-inner">
        ${sideTop}
        ${sideHtml}
      </div>
    </aside>
    <main class="main" data-fit>
      ${headerBar}
      ${S.header === "main" ? nameBlock : ""}
      ${S.header === "main" ? roleBlock : ""}
      ${mainHtml}
    </main>
  </div>`;

    const css = `
    .layout { display: flex; height: 100%; }
    body.multipage .layout { height: auto; }
    .sidebar { width: ${S.sideWidth}; flex: none; background: ${sideBg}; color: ${side.text};
      padding: ${px(side.padTop)} ${px(side.padX)}; box-sizing: border-box; position: relative; }
    .side-inner { position: relative; z-index: 1; text-align: center; }
    .main { flex: 1; min-width: 0; padding: ${px(S.main.padTop)} ${px(S.main.padX)} ${px(S.main.padBottom)};
      box-sizing: border-box; }
    .shape { position: absolute; z-index: 0; }
    .shape-slant { top: -70px; right: -60px; width: 200px; height: 200px; background: ${tint("#ffffff", 0.10)};
      transform: rotate(38deg); }
    .shape-bar { top: 0; left: 0; right: 0; height: ${px(8)}; background: ${tint("#ffffff", 0.30)}; }
    .shape-dots { inset: 0; background-image: radial-gradient(${tint("#ffffff", 0.16)} 1.6px, transparent 1.6px);
      background-size: 15px 15px; }
    .shape-blob { bottom: -80px; left: -60px; width: 220px; height: 220px; border-radius: 50%;
      background: ${tint("#ffffff", 0.09)}; }
    .side-head { margin-bottom: ${px(6)}; }
    .side-photo { width: ${px(S.photo.size)}; height: ${px(S.photo.size)}; object-fit: cover;
      margin: 0 auto ${px(16)}; display: block;
      border-radius: ${S.photo.shape === "square" ? "0" : S.photo.shape === "rounded" ? "10px" : "50%"};
      ${S.photo.ring ? `border: ${px(S.photo.ring.size)} solid ${S.photo.ring.color}; ` : ""} }
    .s-sec { margin-top: ${px(S.sideGap)}; }
    .s-title { font-size: ${px(S.sideTitle.size)}; font-weight: 700; margin: 0; color: ${side.accent};
      text-align: center; ${S.sideTitle.caps ? "text-transform: uppercase; letter-spacing: .08em;" : "letter-spacing: .04em;"} }
    .s-rule { border: 0; border-top: ${px(S.sideRule.size)} solid ${side.rule}; width: ${px(S.sideRule.width)};
      margin: ${px(S.sideRule.gap)} auto; }
    .s-line { margin: 0 0 ${px(5)}; font-size: ${px(side.size)}; line-height: 1.45;
      overflow-wrap: anywhere; text-align: ${S.sideAlign}; }
    .s-line:last-child { margin-bottom: 0; }
    .s-line a { color: ${side.link}; text-decoration: none; }
    .s-muted { color: ${side.muted}; }
    .s-list { list-style: none; margin: 0; padding: 0; font-size: ${px(side.size)}; text-align: ${S.sideAlign}; }
    .s-list li { margin-bottom: ${px(4)}; }
    .name { font-size: ${px(S.name.size)}; font-weight: 700;
      color: ${S.name.color === "accent" ? accent : S.name.color}; margin: 0 0 ${px(6)};
      text-align: ${S.name.align}; letter-spacing: ${S.name.spacing}em;
      ${S.name.caps ? "text-transform: uppercase;" : ""} line-height: 1.1; }
    .role-row { display: flex; align-items: center; gap: ${px(12)}; margin-bottom: ${px(16)};
      justify-content: ${S.name.align === "center" ? "center" : "flex-start"}; }
    .role-bar { display: block; flex: 1; max-width: 96px; height: ${px(6)}; background: ${S.roleBar}; }
    .role { font-size: ${px(S.roleSize)}; letter-spacing: .05em; color: ${S.roleColor}; margin: 0; }
    .role-badge { display: inline-block; background: ${accent}; color: #fff; padding: ${px(4)} ${px(11)};
      border-radius: 999px; font-size: ${px(S.roleSize - 1)}; font-weight: 600; margin: 0 0 ${px(16)}; }
    .top-band { background: ${S.bandBg === "accent" ? accent : S.bandBg}; color: #fff; display: flex;
      align-items: center; gap: ${px(16)}; padding: ${px(18)} ${px(S.main.padX)};
      margin: ${px(-S.main.padTop)} ${px(-S.main.padX)} ${px(18)}; }
    .top-band .name { color: #fff; margin-bottom: ${px(2)}; }
    .top-band .role { color: ${tint("#ffffff", 0.85)}; }
    .top-band .role-bar { background: ${tint("#ffffff", 0.6)}; }
    .band-photo { width: ${px(S.photo.size)}; height: ${px(S.photo.size)}; object-fit: cover; flex: none;
      border-radius: ${S.photo.shape === "square" ? "0" : "50%"};
      ${S.photo.ring ? `border: ${px(S.photo.ring.size)} solid rgba(255,255,255,.55); ` : ""} }
    .m-sec { margin-top: ${px(S.mainGap)}; }
    .m-sec:first-of-type { margin-top: 0; }
    .m-title { font-size: ${px(S.mainTitle.size)}; font-weight: 700; margin: 0; text-align: center;
      letter-spacing: .04em;
      color: ${S.mainTitle.color === "accent" ? accent : S.mainTitle.color}; }
    .m-rule { border: 0; width: ${px(S.mainRule.width)}; margin: ${px(S.mainRule.gap)} auto;
      border-top: ${px(S.mainRule.size)} solid ${S.mainRule.color === "accent" ? accent : S.mainRule.color}; }
    .entry { margin-bottom: ${px(10)}; }
    .e-title { font-size: ${px(S.entrySize)}; margin: 0; line-height: 1.4; }
    .e-sub { color: ${S.muted}; font-weight: 400; }
    .e-company { display: inline-block; background: ${S.companyBg === "accent" ? accent : S.companyBg};
      color: #fff; padding: ${px(1)} ${px(8)}; border-radius: 4px; font-size: ${px(S.entrySize - 2)};
      font-weight: 400; letter-spacing: .04em; }
    .e-period { margin: ${px(2)} 0 0; font-size: ${px(S.entrySize - 2)}; color: ${S.muted}; font-style: italic; }
    .e-tag { display: inline-block; background: ${accent}; color: #fff; border-radius: 4px;
      padding: ${px(2)} ${px(8)}; font-size: ${px(S.entrySize - 3)}; margin: ${px(3)} ${px(4)} 0 0;
      letter-spacing: .04em; }
    .e-sep { border: 0; border-top: 1px solid ${S.sepColor}; margin: ${px(10)} 0; }
    .entry:last-child + .e-sep { display: none; }
    .justify { text-align: justify; }
    .main p { line-height: 1.55; margin: 0 0 ${px(6)}; }
    .main p:last-child { margin-bottom: 0; }
    ul.desc-list { margin: ${px(3)} 0 0; padding-left: ${px(18)}; }
    ul.desc-list li { line-height: 1.5; margin-bottom: ${px(3)}; }
    .text-desc { line-height: 1.5; }
    .skills-grid { display: grid; gap: ${px(4)} ${px(14)}; }
    .skills-grid .skill { display: flex; gap: ${px(7)}; align-items: baseline; margin: 0; }
    .skills-grid .skill .fa { flex: none; font-size: .8em; color: ${accent}; }
    .skills-grid .skill span { min-width: 0; overflow-wrap: break-word; }
    .skill-badges { margin: 0; }
    `;

    return page({
      lang: v.lang, title: v.name || "CV", font, css, body,
      multipage: v.multipage, bootstrap: false, icons: true,
    });
  }

  /* ------------------------------------------------------------ defaults */
  const merge = (base, over) => {
    const out = { ...base };
    for (const k of Object.keys(over || {})) {
      const b = base[k], o = over[k];
      out[k] = (b && o && typeof b === "object" && typeof o === "object" && !Array.isArray(b))
        ? merge(b, o) : o;
    }
    return out;
  };

  const BASE_SINGLE = {
    font: null,                       // null = follow the user's font setting
    page: { top: 46, x: 58, bottom: 44 },
    body: { size: 12.5, color: "#111111" },
    headAlign: "",                    // set for centred headers
    band: null, frame: null, flowGap: 0,
    name: { size: 25, weight: 700, color: "#111111", caps: false, spacing: 0, align: "left" },
    role: { size: 14, color: "#333333", caps: false, spacing: 0, gapTop: 3 },
    contact: { size: 12.5, color: "#222222", sep: " | ", labels: false, grid: false, gapTop: 16 },
    headerRule: null, photo: null,
    heading: { size: 12.5, weight: 700, color: "#111111", caps: true, spacing: 1.1, align: "left",
               rule: null, ruleSize: 1, ruleColor: "#c8cdd3", gapTop: 18, gapBottom: 7 },
    entry: { layout: "inline", sep: "|", sepColor: "#8a8a8a", gap: 11,
             titleSize: 13.5, titleWeight: 700, titleColor: "#111111",
             metaSize: 12.5, metaColor: "#333333", metaWeight: 0,
             perSize: 12, perColor: "#444444" },
    bullets: { size: 12.5, indent: 19, gap: 3 },
    tags: { labels: true },
    skills: { mode: "inline", cols: 0, bullets: false },
    langBefore: " (", langAfter: ")", hobbySep: ", ",
  };

  const BASE_TWO = {
    font: null,
    sideWidth: "33.3333%",
    side: { bg: "#212529", text: "#ffffff", muted: "rgba(255,255,255,.72)", accent: "#ffffff",
            link: "#8fd6f0", rule: "rgba(255,255,255,.35)", size: 12.5, padTop: 16, padX: 14 },
    main: { padTop: 24, padX: 26, padBottom: 18 },
    header: "main",                   // main | band | side
    bandBg: "accent", shape: null,
    photo: { size: 118, shape: "circle", ring: null, placeholder: true },
    name: { size: 40, color: "accent", align: "center", spacing: 0, caps: false },
    roleStyle: "bracket", roleSize: 15, roleColor: "#444444", roleBar: "#424242",
    icons: "solid", sideIcons: true, mainIcons: true, hobbyIcons: true,
    sideAlign: "left",
    sideTitle: { size: 13, caps: true },
    sideRule: { size: 2, width: 35, gap: 14 },
    mainTitle: { size: 17, color: "accent" },
    mainRule: { size: 2, width: 60, color: "#424242", gap: 12 },
    sideGap: 26, mainGap: 14,
    entrySize: 15, muted: "#666666", companyBg: "#212529", sepColor: "rgba(0,0,0,.1)",
    skillsAs: "grid", skillsCols: 0,
  };

  /* ======================================================================
     ATS First — modelled on the documents in templates/, one per document:
     every one is a single plain column that a parser can walk end to end.
     ====================================================================== */
  const ATS_CLASSIC = merge(BASE_SINGLE, {
    /* "Modern One-Page ATS" — letter-spaced name, no rules anywhere */
    font: "carlito",
    page: { top: 34, x: 46, bottom: 34 },
    headAlign: "center",
    name: { size: 30, caps: true, spacing: 0.28, align: "center" },
    role: { size: 15, caps: true, color: "#666666", gapTop: 4 },
    contact: { size: 12.5, color: "#222222", sep: "   |   ", gapTop: 14 },
    heading: { size: 13, caps: true, spacing: 0.6, color: "#000000", rule: null, gapTop: 20, gapBottom: 8 },
    entry: { layout: "inline", sep: "|", titleSize: 12.5, metaSize: 12.5, metaColor: "#222222" },
    bullets: { size: 12.5, indent: 20, gap: 4 },
    skills: { mode: "inline" },
    body: { size: 12.5 },
  });

  const ATS_PRECISE = merge(BASE_SINGLE, {
    /* "Perfect One-Page" — accent rule under the header, thin rules per section */
    font: "carlito",
    headAlign: "center",
    name: { size: 20, align: "center", color: "#1a1a1a" },
    role: { size: 11.5, caps: true, color: "#5a5a5a", spacing: 0.08, gapTop: 4 },
    contact: { size: 11.5, sep: "   •   ", color: "#5a5a5a", gapTop: 10 },
    headerRule: { size: 2, color: "accent", gapTop: 10 },
    heading: { size: 11, caps: true, spacing: 0.09, color: "#1a1a1a",
               rule: "below", ruleSize: 1, ruleColor: "#d6dce3", gapTop: 20, gapBottom: 8 },
    entry: { layout: "split", titleSize: 12, metaSize: 11.5, metaColor: "#5a5a5a",
             perSize: 11.5, perColor: "#5a5a5a", gap: 12 },
    bullets: { size: 11.5, indent: 18, gap: 4 },
    skills: { mode: "grid", cols: 2 },
    body: { size: 11.5 },
    hobbySep: " · ",
  });

  const ATS_EXECUTIVE = merge(BASE_SINGLE, {
    /* "Professional Resume" — large grey name, everything on simple lines */
    font: "carlito",
    headAlign: "center",
    name: { size: 30, color: "#2d2d2d", align: "center" },
    role: { size: 12, color: "#595959", caps: false, gapTop: 4 },
    contact: { size: 12, color: "#595959", sep: "  |  ", gapTop: 12 },
    heading: { size: 12, caps: true, spacing: 0.14, color: "#2d2d2d", rule: null, gapTop: 22, gapBottom: 8 },
    entry: { layout: "inline", sep: "|", titleSize: 12.5, metaSize: 12, metaColor: "#595959" },
    bullets: { size: 12, indent: 20, gap: 4 },
    skills: { mode: "inline" },
    body: { size: 12 },
  });

  const ATS_UNCLUTTERED = merge(BASE_SINGLE, {
    /* "Clean Resume" — sentence-case headings, airy spacing, 4-column skills */
    font: "inter",
    page: { top: 56, x: 60, bottom: 56 },
    headAlign: "center",
    name: { size: 26, color: "#1e1e1e", align: "center", weight: 600 },
    role: { size: 13, color: "#4a4a4a", gapTop: 6 },
    contact: { size: 11.5, color: "#4a4a4a", sep: " | ", gapTop: 14 },
    heading: { size: 13.5, caps: false, spacing: 0, weight: 600, color: "#1e1e1e",
               rule: null, gapTop: 26, gapBottom: 9 },
    entry: { layout: "stack", titleSize: 13, metaSize: 11.5, metaColor: "#4a4a4a", gap: 14 },
    bullets: { size: 11.5, indent: 18, gap: 5 },
    skills: { mode: "grid", cols: 4 },
    body: { size: 11.5 },
  });

  const ATS_EDITORIAL = merge(BASE_SINGLE, {
    /* "One-Column Resume" — serif name, ruled headings, wide margins */
    font: "opensans",
    page: { top: 52, x: 56, bottom: 48 },
    name: { size: 30, color: "#111111", caps: true, spacing: 0.22, align: "left" },
    role: { size: 11, caps: true, color: "#4a4a4a", spacing: 0.16, gapTop: 6 },
    contact: { size: 11.5, color: "#333333", sep: "   |   ", gapTop: 12 },
    heading: { size: 11.5, caps: true, spacing: 0.2, color: "#111111",
               rule: "below", ruleSize: 1, ruleColor: "#b9b9b9", gapTop: 22, gapBottom: 9 },
    entry: { layout: "split", titleSize: 12.5, metaSize: 11.5, metaColor: "#4a4a4a",
             perSize: 11.5, perColor: "#4a4a4a", gap: 12 },
    bullets: { size: 11.5, indent: 18, gap: 4 },
    skills: { mode: "list" },
    body: { size: 11.5 },
  });

  const ATS_EXPRESSIVE = merge(BASE_SINGLE, {
    /* "Stylish Creative One-Page ATS" — oversized serif name, still one column */
    font: "carlito",
    headAlign: "center",
    name: { size: 44, color: "#2b2b2b", align: "center", weight: 600 },
    role: { size: 12.5, caps: true, color: "#434343", spacing: 0.2, gapTop: 8 },
    contact: { size: 11.5, color: "#434343", sep: "   |   ", gapTop: 12 },
    heading: { size: 12, caps: true, spacing: 0.18, align: "center", color: "#2b2b2b",
               rule: "below", ruleSize: 1, ruleColor: "#c9c9c9", gapTop: 22, gapBottom: 10 },
    entry: { layout: "stack", titleSize: 12.5, metaSize: 11.5, metaColor: "#434343", gap: 12 },
    bullets: { size: 11.5, indent: 18, gap: 4 },
    skills: { mode: "inline" },
    body: { size: 11.5 },
  });

  /* ======================================================================
     Hybrid — structured like ATS, but with the visual hierarchy of a
     human-first layout: bands, rules, accented headings, labelled facts.
     ====================================================================== */
  const HYBRID_BLEND = merge(BASE_SINGLE, {
    font: null,
    band: { bg: "accentSoft", align: "left", bleed: true, padBottom: 20, rule: { size: 2, color: "accent" } },
    flowGap: 18,
    name: { size: 26, color: "accentDark", align: "left" },
    role: { size: 13.5, color: "#3e4c59", gapTop: 4 },
    contact: { grid: true, size: 12, color: "#52606d", gapTop: 12 },
    heading: { size: 12.5, caps: true, spacing: 0.09, color: "accentDark",
               rule: "below", ruleSize: 1, ruleColor: "accent", gapTop: 18, gapBottom: 8 },
    entry: { layout: "split", titleSize: 13, metaSize: 12, metaColor: "#3e4c59",
             perSize: 12, perColor: "#52606d", gap: 12 },
    skills: { mode: "grid", cols: 2, bullets: true },
    body: { size: 12 },
  });

  const HYBRID_FRAME = merge(BASE_SINGLE, {
    page: { top: 40, x: 52, bottom: 40 },
    frame: { size: 2, color: "accent" },
    headAlign: "center",
    name: { size: 27, caps: true, spacing: 0.14, align: "center", color: "#1f2933" },
    role: { size: 12, caps: true, color: "accentDark", spacing: 0.12, gapTop: 5 },
    contact: { sep: "   •   ", size: 11.5, color: "#52606d", gapTop: 12 },
    headerRule: { size: 1, color: "#d9e2ec", gapTop: 12 },
    heading: { size: 12, caps: true, spacing: 0.12, color: "accentDark",
               rule: "side", ruleSize: 3, ruleColor: "accent", gapTop: 20, gapBottom: 8 },
    entry: { layout: "split", titleSize: 12.5, metaSize: 11.5, metaColor: "#3e4c59",
             perSize: 11.5, perColor: "#52606d", gap: 12 },
    skills: { mode: "grid", cols: 3, bullets: true },
    body: { size: 11.5 },
  });

  const HYBRID_ATLAS = merge(BASE_SINGLE, {
    photo: { size: 96, shape: "rounded", side: "left", ring: null },
    name: { size: 24, color: "#1f2933", align: "left" },
    role: { size: 13, color: "accentDark", gapTop: 3 },
    contact: { grid: true, size: 11.5, color: "#52606d", gapTop: 14 },
    heading: { size: 12.5, caps: true, spacing: 0.08, color: "#1f2933",
               rule: "above", ruleSize: 2, ruleColor: "accent", gapTop: 20, gapBottom: 8 },
    entry: { layout: "split", titleSize: 13, metaSize: 12, metaColor: "#3e4c59",
             perSize: 12, perColor: "#52606d", gap: 12 },
    skills: { mode: "list" },
    body: { size: 12 },
  });

  const HYBRID_MERIDIAN = merge(BASE_SINGLE, {
    headAlign: "center",
    name: { size: 28, caps: true, spacing: 0.2, align: "center", color: "#111111" },
    role: { size: 12, caps: true, color: "#52606d", spacing: 0.14, gapTop: 6 },
    contact: { size: 11.5, sep: "   ·   ", color: "#52606d", gapTop: 12 },
    headerRule: { size: 3, color: "accent", gapTop: 14 },
    heading: { size: 11.5, caps: true, spacing: 0.14, color: "#111111",
               rule: "below", ruleSize: 2, ruleColor: "accent", gapTop: 20, gapBottom: 8 },
    entry: { layout: "inline", sep: "·", sepColor: "accentDark", titleSize: 12.5, metaSize: 11.5, metaColor: "#52606d" },
    skills: { mode: "grid", cols: 3, bullets: true },
    body: { size: 11.5 },
  });

  const HYBRID_SLATE = merge(BASE_SINGLE, {
    band: { bg: "#eef2f5", align: "left", bleed: true, padBottom: 18, rule: null },
    flowGap: 16,
    name: { size: 25, color: "#1f2933", align: "left" },
    role: { size: 13, color: "#52606d", gapTop: 3 },
    contact: { labels: true, size: 11.5, color: "#52606d", gapTop: 10 },
    heading: { size: 12, caps: true, spacing: 0.1, color: "accentDark",
               rule: "side", ruleSize: 3, ruleColor: "accent", gapTop: 17, gapBottom: 7 },
    entry: { layout: "inline", sep: "|", titleSize: 12.5, metaSize: 11.5, metaColor: "#3e4c59" },
    skills: { mode: "inline" },
    body: { size: 11.5 },
  });

  const HYBRID_TOWER = merge(BASE_SINGLE, {
    headAlign: "center",
    name: { size: 27, caps: true, spacing: 0.16, align: "center", color: "#111111" },
    role: { size: 12.5, color: "accentDark", caps: true, spacing: 0.1, gapTop: 6 },
    contact: { grid: true, size: 11.5, color: "#3e4c59", gapTop: 14 },
    headerRule: { size: 6, color: "accent", gapTop: 14 },
    heading: { size: 12, caps: true, spacing: 0.12, align: "center", color: "#111111",
               rule: "below", ruleSize: 1, ruleColor: "accent", gapTop: 20, gapBottom: 9 },
    entry: { layout: "split", titleSize: 12.5, metaSize: 11.5, metaColor: "#3e4c59",
             perSize: 11.5, perColor: "#52606d", gap: 12 },
    skills: { mode: "grid", cols: 2, bullets: true },
    body: { size: 11.5 },
  });

  /* ======================================================================
     Human First — the two-column family: the same sidebar layout in six
     treatments (colour, photo shape, decorative shape, icon style, where
     the name sits).
     ====================================================================== */
  const HUMAN_SIDEBAR = merge(BASE_TWO, {
    /* the original look */
    sideGap: 60,
  });

  const HUMAN_ACCENT = merge(BASE_TWO, {
    side: { bg: "accent", text: "#ffffff", muted: "rgba(255,255,255,.78)", accent: "#ffffff",
            link: "#ffffff", rule: "rgba(255,255,255,.45)" },
    shape: "slant",
    photo: { shape: "rounded", ring: { size: 4, color: "rgba(255,255,255,.5)" } },
    companyBg: "#111827",
    sideGap: 34,
  });

  const HUMAN_AIRY = merge(BASE_TWO, {
    side: { bg: "#eef2f6", text: "#1f2933", muted: "#6b7a8d", accent: "accent",
            link: "#1f2933", rule: "rgba(0,0,0,.12)" },
    photo: { shape: "rounded", ring: null },
    name: { color: "accent" },
    mainRule: { color: "#cbd5e1" },
    companyBg: "#334155",
    roleBar: "#cbd5e1",
    roleColor: "#52606d",
    muted: "#64748b",
    sepColor: "rgba(0,0,0,.08)",
    sideGap: 30,
  });

  const HUMAN_PORTRAIT = merge(BASE_TWO, {
    header: "band",
    bandBg: "accent",
    photo: { size: 104, shape: "circle", ring: { size: 3, color: "rgba(255,255,255,.6)" }, placeholder: true },
    name: { size: 34, color: "#ffffff", align: "left" },
    roleStyle: "plain", roleSize: 14, roleColor: "rgba(255,255,255,.85)",
    side: { bg: "#212529", text: "#ffffff", muted: "rgba(255,255,255,.7)", accent: "#ffffff",
            link: "#8fd6f0", rule: "rgba(255,255,255,.3)" },
    sideGap: 30,
  });

  const HUMAN_MIDNIGHT = merge(BASE_TWO, {
    side: { bg: "#0b1220", text: "#e5e7eb", muted: "#94a3b8", accent: "accent",
            link: "#7dd3fc", rule: "rgba(255,255,255,.18)" },
    shape: "dots",
    icons: "regular",
    photo: { shape: "circle", ring: { size: 3, color: "accent" } },
    name: { color: "accent" },
    sideRule: { size: 1, width: 30 },
    mainRule: { size: 1, color: "#e2e8f0", width: 44 },
    skillsAs: "badges",
    companyBg: "#0b1220",
    sideGap: 28,
  });

  const HUMAN_BOLD = merge(BASE_TWO, {
    header: "band",
    bandBg: "accent",
    photo: { size: 96, shape: "circle", ring: null, placeholder: true },
    name: { size: 36, color: "#ffffff", align: "left", spacing: 0.02, caps: true },
    roleStyle: "badge", roleSize: 14,
    side: { bg: "#111827", text: "#f9fafb", muted: "#9ca3af", accent: "accent",
            link: "#93c5fd", rule: "rgba(255,255,255,.22)" },
    shape: "bar",
    skillsAs: "badges",
    companyBg: "accent",
    sideGap: 30,
  });

  /* ================================================================ registry */
  /* Every entry: a stable id, the type it belongs to, a user-facing name, an
     i18n description key, internal scores, and a builder bound to a preset. */
  const TEMPLATES = {
    "ats-classic":     { type: "ats", name: "Classic", descKey: "tpl.ats.classic",
                         scores: { ats: 10, human: 4, hybrid: 6 }, build: (v) => singleColumn(v, ATS_CLASSIC) },
    "ats-precise":     { type: "ats", name: "Precise", descKey: "tpl.ats.precise",
                         scores: { ats: 10, human: 5, hybrid: 7 }, build: (v) => singleColumn(v, ATS_PRECISE) },
    "ats-executive":   { type: "ats", name: "Executive", descKey: "tpl.ats.executive",
                         scores: { ats: 10, human: 5, hybrid: 7 }, build: (v) => singleColumn(v, ATS_EXECUTIVE) },
    "ats-uncluttered": { type: "ats", name: "Uncluttered", descKey: "tpl.ats.uncluttered",
                         scores: { ats: 9, human: 6, hybrid: 7 }, build: (v) => singleColumn(v, ATS_UNCLUTTERED) },
    "ats-editorial":   { type: "ats", name: "Editorial", descKey: "tpl.ats.editorial",
                         scores: { ats: 9, human: 6, hybrid: 6 }, build: (v) => singleColumn(v, ATS_EDITORIAL) },
    "ats-expressive":  { type: "ats", name: "Expressive", descKey: "tpl.ats.expressive",
                         scores: { ats: 9, human: 6, hybrid: 6 }, build: (v) => singleColumn(v, ATS_EXPRESSIVE) },

    "human-sidebar":   { type: "human", name: "Sidebar", descKey: "tpl.human.sidebar",
                         scores: { ats: 4, human: 10, hybrid: 6 }, build: (v) => twoColumn(v, HUMAN_SIDEBAR) },
    "human-accent":    { type: "human", name: "Accent", descKey: "tpl.human.accent",
                         scores: { ats: 4, human: 10, hybrid: 6 }, build: (v) => twoColumn(v, HUMAN_ACCENT) },
    "human-airy":      { type: "human", name: "Airy", descKey: "tpl.human.airy",
                         scores: { ats: 5, human: 10, hybrid: 7 }, build: (v) => twoColumn(v, HUMAN_AIRY) },
    "human-portrait":  { type: "human", name: "Portrait", descKey: "tpl.human.portrait",
                         scores: { ats: 4, human: 10, hybrid: 6 }, build: (v) => twoColumn(v, HUMAN_PORTRAIT) },
    "human-midnight":  { type: "human", name: "Midnight", descKey: "tpl.human.midnight",
                         scores: { ats: 5, human: 10, hybrid: 6 }, build: (v) => twoColumn(v, HUMAN_MIDNIGHT) },
    "human-bold":      { type: "human", name: "Bold", descKey: "tpl.human.bold",
                         scores: { ats: 4, human: 10, hybrid: 6 }, build: (v) => twoColumn(v, HUMAN_BOLD) },

    "hybrid-blend":    { type: "hybrid", name: "Blend", descKey: "tpl.hybrid.blend",
                         scores: { ats: 7, human: 8, hybrid: 10 }, build: (v) => singleColumn(v, HYBRID_BLEND) },
    "hybrid-frame":    { type: "hybrid", name: "Frame", descKey: "tpl.hybrid.frame",
                         scores: { ats: 7, human: 8, hybrid: 10 }, build: (v) => singleColumn(v, HYBRID_FRAME) },
    "hybrid-atlas":    { type: "hybrid", name: "Atlas", descKey: "tpl.hybrid.atlas",
                         scores: { ats: 7, human: 8, hybrid: 10 }, build: (v) => singleColumn(v, HYBRID_ATLAS) },
    "hybrid-meridian": { type: "hybrid", name: "Meridian", descKey: "tpl.hybrid.meridian",
                         scores: { ats: 8, human: 7, hybrid: 10 }, build: (v) => singleColumn(v, HYBRID_MERIDIAN) },
    "hybrid-slate":    { type: "hybrid", name: "Slate", descKey: "tpl.hybrid.slate",
                         scores: { ats: 8, human: 7, hybrid: 10 }, build: (v) => singleColumn(v, HYBRID_SLATE) },
    "hybrid-tower":    { type: "hybrid", name: "Tower", descKey: "tpl.hybrid.tower",
                         scores: { ats: 8, human: 7, hybrid: 10 }, build: (v) => singleColumn(v, HYBRID_TOWER) },
  };

  const TEMPLATE_ORDER = [
    "ats-classic", "ats-precise", "ats-executive", "ats-uncluttered", "ats-editorial", "ats-expressive",
    "human-sidebar", "human-accent", "human-airy", "human-portrait", "human-midnight", "human-bold",
    "hybrid-blend", "hybrid-frame", "hybrid-atlas", "hybrid-meridian", "hybrid-slate", "hybrid-tower",
  ];

  /* The three groups, in the order they are shown. Not a ranking: each is a
     different optimisation target. */
  const TEMPLATE_TYPES = [
    { key: "ats", name: "ATS First", descKey: "tpl.group.ats" },
    { key: "human", name: "Human First", descKey: "tpl.group.human" },
    { key: "hybrid", name: "Hybrid", descKey: "tpl.group.hybrid" },
  ];

  const templatesOfType = (type) => TEMPLATE_ORDER.filter((id) => TEMPLATES[id].type === type);

  const DEFAULT_TEMPLATE = "human-sidebar";

  /* Older resumes stored a bare type ("ats" | "human" | "ai"). Map them onto
     the new ids so nothing changes appearance on upgrade. */
  const LEGACY = { ats: "ats-classic", human: "human-sidebar", ai: "hybrid-blend" };

  function normalizeTemplate(value) {
    const key = String(value ?? "").trim();
    if (Object.prototype.hasOwnProperty.call(TEMPLATES, key)) return key;
    const legacy = LEGACY[key.toLowerCase()];
    return legacy || DEFAULT_TEMPLATE;
  }

  /** Render one resume through the selected template. Data in, HTML out. */
  function render(d) {
    const view = prepare(d);
    const template = TEMPLATES[normalizeTemplate(view.d.template)];
    return template.build(view);
  }

  return {
    render, FONTS, SECTIONS, SECTION_KEYS, SKILL_COL_LIMITS,
    TEMPLATES, TEMPLATE_ORDER, TEMPLATE_TYPES, templatesOfType, DEFAULT_TEMPLATE,
    normalizeTemplate,
  };
});
