// Assembled at runtime so the address isn't in the static HTML.
var EMAIL = ["qasim.mahmood13", "alumni.imperial.ac.uk"].join("@");

// One entry per button; edits are one-line changes.
var LINKS = [
  { label: "GitHub", detail: "github.com/qasimmahmood95", href: "https://github.com/qasimmahmood95" },
  { label: "LinkedIn", detail: "linkedin.com/in/qmahmood95", href: "https://www.linkedin.com/in/qmahmood95" },
  { label: "Instagram", detail: "instagram.com/toastq", href: "https://www.instagram.com/toastq/" },
  { label: "Main site", detail: "qasimmahmood.org", href: "https://qasimmahmood.org/" },
  { label: "Email", detail: EMAIL, href: "mailto:" + EMAIL },
];

var root = document.getElementById("links-root");
LINKS.forEach(function (item) {
  var li = document.createElement("li");
  var a = document.createElement("a");
  a.href = item.href;
  a.className = "flex min-h-14 flex-wrap items-center justify-between gap-x-4 gap-y-1 border border-line px-5 py-4 hover:border-accent hover:text-accent dark:border-line-dark dark:hover:border-accent-bright dark:hover:text-accent-bright";

  var label = document.createElement("span");
  label.className = "font-semibold";
  label.textContent = item.label;

  var detail = document.createElement("span");
  detail.className = "font-mono text-xs text-ink-muted dark:text-fog-muted";
  detail.textContent = item.detail;

  a.append(label, detail);
  li.appendChild(a);
  root.appendChild(li);
});

document.getElementById("theme-toggle").addEventListener("click", function () {
  var dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
});

document.getElementById("year").textContent = String(new Date().getFullYear());
