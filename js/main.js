// Assembled at runtime so the address isn't in the static HTML.
const EMAIL = ["qasim.mahmood13", "alumni.imperial.ac.uk"].join("@");

// ---------------------------------------------------------------------------
// Certifications: add a cert by adding one line to the relevant group.
// ---------------------------------------------------------------------------
const CERTIFICATIONS = [
  {
    group: "Cloud",
    items: [
      { name: "AWS Certified Solutions Architect - Associate", issuer: "Amazon Web Services" },
      { name: "AWS Certified AI Practitioner", issuer: "Amazon Web Services" },
      { name: "AWS Certified Machine Learning Engineer - Associate", issuer: "Amazon Web Services" },
      { name: "Azure Fundamentals (AZ-900)", issuer: "Microsoft" },
      { name: "Azure AI Fundamentals (AI-900)", issuer: "Microsoft" },
      { name: "Security, Compliance & Identity Fundamentals (SC-900)", issuer: "Microsoft" },
      { name: "Cloud Digital Leader", issuer: "Google Cloud" },
    ],
  },
  {
    group: "Testing",
    items: [
      { name: "ISTQB Certified Tester Foundation Level", issuer: "ISTQB" },
      { name: "ISTQB Foundation Level Agile Tester", issuer: "ISTQB" },
      { name: "ISTQB Advanced Level Test Analyst", issuer: "ISTQB" },
    ],
  },
  {
    group: "DevOps",
    items: [
      { name: "GitHub Actions", issuer: "GitHub" },
      { name: "GitHub Advanced Security", issuer: "GitHub" },
      { name: "GitHub Foundations", issuer: "GitHub" },
    ],
  },
  {
    group: "Other",
    items: [
      { name: "Claude Code Essentials", issuer: "Anthropic" },
      { name: "Islamic Finance", issuer: "AUSCIF" },
    ],
  },
];

function renderCertifications() {
  const root = document.getElementById("certs-root");
  if (!root) return;

  for (const { group, items } of CERTIFICATIONS) {
    const section = document.createElement("div");

    const heading = document.createElement("h3");
    heading.className = "font-mono text-sm font-semibold uppercase tracking-wider";
    heading.textContent = group;
    section.appendChild(heading);

    const grid = document.createElement("ul");
    grid.className = "mt-3 grid gap-3 sm:grid-cols-2";
    for (const { name, issuer } of items) {
      const li = document.createElement("li");
      li.className = "border border-line dark:border-line-dark px-4 py-3";

      const certName = document.createElement("p");
      certName.className = "text-sm font-medium leading-snug";
      certName.textContent = name;

      const certIssuer = document.createElement("p");
      certIssuer.className = "mt-1 font-mono text-xs text-ink-muted dark:text-fog-muted";
      certIssuer.textContent = issuer;

      li.append(certName, certIssuer);
      grid.appendChild(li);
    }
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
  if (bar) {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
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

  // Sections "pass" as they come into view: check mark appears, content fades up
  const seen = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const check = entry.target.querySelector(".js-check");
      if (check) check.classList.remove("opacity-0");
      entry.target.classList.add("revealed");
      seen.unobserve(entry.target);
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
    { label: "go / skills", run: go("skills") },
    { label: "go / experience", run: go("experience") },
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
  console.log("%cSuite is green: 5 sections passed, 0 failed, 0 flaky. Found a bug anyway? " + EMAIL, mono);
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
