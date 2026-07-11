// Assembled at runtime so the address isn't in the static HTML.
const EMAIL = ["qasim.mahmood13", "alumni.imperial.ac.uk"].join("@");

// ---------------------------------------------------------------------------
// Certifications: add a cert by adding one line to the relevant group.
// Optional fields: id (credential ID), url (public verify link; the card
// becomes a link when present), and featured (rank; pulls the cert into the
// highlights row, styled like the map's index contours).
// ---------------------------------------------------------------------------
const CERTIFICATIONS = [
  {
    group: "Cloud",
    items: [
      { name: "Security, Compliance & Identity Fundamentals (SC-900)", issuer: "Microsoft", issued: "Mar 2025", id: "8F3AE15DB1DC7FD", url: "https://learn.microsoft.com/api/credentials/share/en-gb/QasimMahmood-6022/8F3AE15DB1DC7FD?sharingId", featured: 4 },
      { name: "AWS Certified Solutions Architect - Associate", issuer: "Amazon Web Services", issued: "Dec 2024", url: "https://www.credly.com/badges/82b119a1-ddf4-46ad-aba1-bc160d516c86", featured: 2 },
      { name: "Cloud Digital Leader", issuer: "Google Cloud", issued: "Dec 2024", url: "https://www.credly.com/badges/08ff3b9a-695f-40d2-be71-980dd78bffea" },
      { name: "Azure AI Fundamentals (AI-900)", issuer: "Microsoft", issued: "Nov 2024", id: "FA52407D66AFD830", url: "https://learn.microsoft.com/api/credentials/share/en-gb/QasimMahmood-6022/FA52407D66AFD830?sharingId=966D4EA02489B5E" },
      { name: "AWS Certified Machine Learning Engineer - Associate", issuer: "Amazon Web Services", issued: "Oct 2024", url: "https://www.credly.com/badges/1c38a59a-512b-47e7-9b1d-5719b6ef7769", featured: 3 },
      { name: "AWS Certified AI Practitioner", issuer: "Amazon Web Services", issued: "Oct 2024", url: "https://www.credly.com/badges/b3cea168-4cdc-417d-b278-70ccd435a42c" },
      { name: "Azure Fundamentals (AZ-900)", issuer: "Microsoft", issued: "Jan 2022", id: "I126-0820", url: "https://www.credly.com/badges/10a9f342-006a-44b0-b2e1-c26a8f959b6e" },
    ],
  },
  {
    group: "Testing",
    items: [
      { name: "ISTQB Advanced Level Test Analyst", issuer: "ISTQB", issued: "Nov 2021", id: "00525854", url: "https://drive.google.com/file/d/1jt3eNr-nKJ7Wr9rKbLNaBu23tF7DM78n/view?usp=sharing", featured: 1 },
      { name: "ISTQB Certified Agile Tester", issuer: "ISTQB", issued: "Oct 2019", id: "00466214", url: "https://drive.google.com/open?id=1NueEe7ICS8Xaa1cJkQBcUNRxzJ9HYOdB" },
      { name: "ISTQB Certified Tester Foundation Level", issuer: "ISTQB", issued: "Apr 2019", id: "00449756", url: "https://drive.google.com/open?id=1SaLiAy0ZSOvbWyNOtZbHq78tzeRb2waA" },
    ],
  },
  {
    group: "DevOps",
    items: [
      { name: "GitHub Actions", issuer: "GitHub", issued: "Sep 2024", url: "https://www.credly.com/badges/d80cfca8-074c-4d3a-abba-4c7b9fc7a531" },
      { name: "GitHub Advanced Security", issuer: "GitHub", issued: "Aug 2024", url: "https://www.credly.com/badges/c12212fc-8c78-4f83-b355-51c1ebc3a096" },
      { name: "GitHub Foundations", issuer: "GitHub", issued: "Aug 2024", url: "https://www.credly.com/badges/19aa34a2-b30a-4695-86da-4b1bc87860d8" },
    ],
  },
  {
    group: "AI",
    items: [
      { name: "Claude Code Essentials", issuer: "ExamPro", issued: "Apr 2026", id: "JJq1XXOyFjmXhO-EHHRa3g5d3b", url: "https://app.exampro.co/validate/badge/JJq1XXOyFjmXhO-EHHRa3g5d3b", featured: 5 },
      { name: "AI Fluency: Framework & Foundations", issuer: "Anthropic", issued: "Mar 2026", id: "gw79erqmijoa", url: "https://verify.skilljar.com/c/gw79erqmijoa" },
      { name: "Claude Code in Action", issuer: "Anthropic", issued: "Mar 2026", id: "3fj26my5u2n8", url: "https://verify.skilljar.com/c/3fj26my5u2n8" },
      { name: "Claude 101", issuer: "Anthropic", issued: "Mar 2026", id: "ee9v2q62esni", url: "https://verify.skilljar.com/c/ee9v2q62esni" },
    ],
  },
  {
    group: "Other",
    items: [
      { name: "Islamic Finance Professional Development Course", issuer: "AUSCIF", issued: "May 2020" },
    ],
  },
];

function certCard({ name, issuer, issued, id, url }, isFeatured) {
  const li = document.createElement("li");
  li.className = isFeatured
    ? "border border-line border-l-2 border-l-accent dark:border-line-dark dark:border-l-accent-bright"
    : "border border-line dark:border-line-dark";

  const certName = document.createElement("p");
  certName.className = isFeatured
    ? "text-base font-semibold leading-snug"
    : "text-sm font-medium leading-snug";
  certName.textContent = name;

  const certMeta = document.createElement("p");
  certMeta.className = "mt-1 font-mono text-xs text-ink-muted dark:text-fog-muted";
  certMeta.textContent = issued ? issuer + " / " + issued : issuer;

  const inner = url ? document.createElement("a") : document.createElement("div");
  inner.className = "block px-4 py-3";
  if (url) {
    inner.href = url;
    inner.target = "_blank";
    inner.rel = "noopener";
    inner.title = "Verify credential";
  }
  inner.append(certName, certMeta);

  if (id) {
    const certId = document.createElement("p");
    certId.className = "mt-1 break-all font-mono text-xs text-ink-muted opacity-70 dark:text-fog-muted";
    certId.textContent = "id " + id;
    inner.appendChild(certId);
  }

  li.appendChild(inner);
  return li;
}

function renderCertifications() {
  const root = document.getElementById("certs-root");
  if (!root) return;

  function groupBlock(title, accent) {
    const section = document.createElement("div");
    const heading = document.createElement("h3");
    heading.className = "font-mono text-sm font-semibold uppercase tracking-wider" +
      (accent ? " text-accent dark:text-accent-bright" : "");
    heading.textContent = title;
    section.appendChild(heading);
    return section;
  }

  // Highlights first: the index contours of the certification map
  const featured = CERTIFICATIONS.flatMap((g) => g.items.filter((i) => i.featured))
    .sort((a, b) => a.featured - b.featured);
  if (featured.length) {
    const section = groupBlock("Highlights", true);
    const grid = document.createElement("ul");
    grid.className = "mt-3 grid gap-3 sm:grid-cols-2";
    for (const item of featured) grid.appendChild(certCard(item, true));
    section.appendChild(grid);
    root.appendChild(section);
  }

  for (const { group, items } of CERTIFICATIONS) {
    const rest = items.filter((i) => !i.featured);
    if (rest.length === 0) continue;
    const section = groupBlock(group, false);
    const grid = document.createElement("ul");
    grid.className = "mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3";
    for (const item of rest) grid.appendChild(certCard(item, false));
    section.appendChild(grid);
    root.appendChild(section);
  }
}

// ---------------------------------------------------------------------------
// Theme toggle. Initial state is set by the inline script in <head>.
// ---------------------------------------------------------------------------
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  });
}

// ---------------------------------------------------------------------------
// Mobile nav
// ---------------------------------------------------------------------------
function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-mobile");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menu.classList.add("hidden");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ---------------------------------------------------------------------------
// Email: mailto links, plus a click-to-copy address in the contact section
// ---------------------------------------------------------------------------
function copyEmail() {
  if (!navigator.clipboard) return Promise.reject();
  return navigator.clipboard.writeText(EMAIL);
}

function initEmailLinks() {
  document.querySelectorAll("a.js-email").forEach((link) => {
    link.href = "mailto:" + EMAIL;
  });

  const btn = document.getElementById("email-text");
  if (!btn) return;
  btn.textContent = EMAIL;
  btn.classList.remove("hidden");
  let timer;
  btn.addEventListener("click", () => {
    copyEmail().then(() => {
      btn.textContent = "copied to clipboard";
      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.textContent = EMAIL;
      }, 1600);
    }).catch(() => {
      location.href = "mailto:" + EMAIL;
    });
  });
}

// ---------------------------------------------------------------------------
// Scroll effects: progress bar, scrollspy, section check marks, entrance fade
// ---------------------------------------------------------------------------
function initScrollEffects() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  const bar = document.getElementById("progress");
  // The contour layers parallax by shifting their mask position with scroll,
  // which composes with (rather than fights) the CSS drift transform. The
  // masks tile, so any offset is safe. Layer A and the accent layer share a
  // factor so the highlighted lines stay on their grey counterparts.
  const topoLayers = Array.from(document.querySelectorAll(".topo-fixed .topo-layer"))
    .map((el) => [el, el.classList.contains("topo-b") ? 0.16 : 0.1]);
  if (bar || topoLayers.length) {
    let ticking = false;
    const update = () => {
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      }
      if (!reduceMotion) {
        for (const [el, factor] of topoLayers) {
          const pos = "0px " + Math.round(-window.scrollY * factor) + "px";
          el.style.maskPosition = pos;
          el.style.webkitMaskPosition = pos;
        }
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  const navLinks = new Map(
    Array.from(document.querySelectorAll("#nav-links a")).map((a) => [a.hash.slice(1), a])
  );
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((link) => link.removeAttribute("aria-current"));
      const link = navLinks.get(entry.target.id);
      if (link) link.setAttribute("aria-current", "location");
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  // Sections "pass" as they come into view: check mark appears (and stays),
  // content fades up. The reveal resets when a section leaves the viewport,
  // so it plays again on every approach.
  const seen = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const check = entry.target.querySelector(".js-check");
        if (check) check.classList.remove("opacity-0");
        entry.target.classList.add("revealed");
      } else {
        entry.target.classList.remove("revealed");
      }
    }
  }, { rootMargin: "0px 0px -80px 0px" });
  sections.forEach((s) => {
    if (!reduceMotion && s.id !== "top") s.classList.add("reveal");
    seen.observe(s);
  });
}

// ---------------------------------------------------------------------------
// Command palette (ctrl/cmd+k)
// ---------------------------------------------------------------------------
function initCommandPalette() {
  const dialog = document.getElementById("cmdk");
  const input = document.getElementById("cmdk-input");
  const list = document.getElementById("cmdk-list");
  const openBtn = document.getElementById("cmdk-open");
  if (!dialog || !input || !list || typeof dialog.showModal !== "function") return;

  const go = (id) => () => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView();
  };
  const commands = [
    { label: "go / about", run: go("about") },
    { label: "go / approach", run: go("approach") },
    { label: "go / skills", run: go("skills") },
    { label: "go / experience", run: go("experience") },
    { label: "go / testimonials", run: go("testimonials") },
    { label: "go / certifications", run: go("certifications") },
    { label: "go / contact", run: go("contact") },
    { label: "go / top", run: () => window.scrollTo({ top: 0 }) },
    { label: "theme / toggle dark mode", run: () => document.getElementById("theme-toggle").click() },
    { label: "email / compose", run: () => { location.href = "mailto:" + EMAIL; } },
    { label: "email / copy address", run: () => { copyEmail().catch(() => {}); } },
    { label: "open / cv (pdf)", run: () => window.open("assets/Qasim_Mahmood_CV.pdf", "_blank", "noopener") },
    { label: "open / github", run: () => window.open("https://github.com/qasimmahmood95", "_blank", "noopener") },
    { label: "open / linkedin", run: () => window.open("https://www.linkedin.com/in/qmahmood95", "_blank", "noopener") },
  ];

  let matches = commands;
  let selected = 0;

  function run(cmd) {
    dialog.close();
    cmd.run();
  }

  function render() {
    list.textContent = "";
    matches.forEach((cmd, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = cmd.label;
      btn.className = "block w-full px-3 py-2 text-left " +
        (i === selected
          ? "bg-line text-ink dark:bg-line-dark dark:text-fog"
          : "text-ink-muted dark:text-fog-muted");
      btn.addEventListener("click", () => run(cmd));
      li.appendChild(btn);
      list.appendChild(li);
    });
    if (matches.length === 0) {
      const li = document.createElement("li");
      li.className = "px-3 py-2 text-ink-muted dark:text-fog-muted";
      li.textContent = "no matching command";
      list.appendChild(li);
    }
  }

  function filter() {
    const q = input.value.trim().toLowerCase();
    matches = commands.filter((c) => c.label.toLowerCase().includes(q));
    selected = 0;
    render();
  }

  function openPalette() {
    input.value = "";
    filter();
    dialog.showModal();
  }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (dialog.open) dialog.close();
      else openPalette();
    }
  });
  if (openBtn) openBtn.addEventListener("click", openPalette);
  input.addEventListener("input", filter);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selected = Math.min(selected + 1, matches.length - 1);
      render();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selected = Math.max(selected - 1, 0);
      render();
    } else if (e.key === "Enter" && matches[selected]) {
      e.preventDefault();
      run(matches[selected]);
    }
  });
  // Click on the backdrop closes the palette
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
}

// ---------------------------------------------------------------------------
// A word for anyone who checks the console
// ---------------------------------------------------------------------------
function consoleGreeting() {
  const mono = "font-family: ui-monospace, monospace;";
  console.log("%cqasimmahmood.org", mono + "font-weight: 600;");
  console.log("%cOpening the console on a personal site? Spoken like a tester.", mono);
  console.log("%cSuite is green: 7 sections passed, 0 failed, 0 flaky. Found a bug anyway? " + EMAIL, mono);
  console.log("%cTip: ctrl+k works here.", mono);
}

renderCertifications();
initThemeToggle();
initMobileNav();
initEmailLinks();
initScrollEffects();
initCommandPalette();
consoleGreeting();
document.getElementById("year").textContent = String(new Date().getFullYear());
