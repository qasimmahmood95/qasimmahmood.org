// ---------------------------------------------------------------------------
// Certifications — add a cert by adding one line to the relevant group.
// ---------------------------------------------------------------------------
const CERTIFICATIONS = [
  {
    group: "Cloud",
    items: [
      { name: "AWS Certified Solutions Architect — Associate", issuer: "Amazon Web Services" },
      { name: "AWS Certified AI Practitioner", issuer: "Amazon Web Services" },
      { name: "AWS Certified Machine Learning Engineer — Associate", issuer: "Amazon Web Services" },
      { name: "Azure Fundamentals (AZ-900)", issuer: "Microsoft" },
      { name: "Azure AI Fundamentals (AI-900)", issuer: "Microsoft" },
      { name: "Security, Compliance & Identity Fundamentals (SC-900)", issuer: "Microsoft" },
      { name: "Cloud Digital Leader", issuer: "Google Cloud" },
    ],
  },
  {
    group: "Testing",
    items: [
      { name: "ISTQB Certified Tester — Foundation Level", issuer: "ISTQB" },
      { name: "ISTQB Foundation Level — Agile Tester", issuer: "ISTQB" },
      { name: "ISTQB Advanced Level — Test Analyst", issuer: "ISTQB" },
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
// Theme toggle — initial state is set by the inline script in <head>.
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
// Email — assembled at runtime so the address isn't in the static HTML.
// ---------------------------------------------------------------------------
function initEmailLink() {
  const link = document.getElementById("email-link");
  if (!link) return;
  const address = ["qasimm999", "gmail.com"].join("@");
  link.href = "mailto:" + address;
}

renderCertifications();
initThemeToggle();
initMobileNav();
initEmailLink();
document.getElementById("year").textContent = String(new Date().getFullYear());
