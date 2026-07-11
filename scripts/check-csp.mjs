// Guards the Content-Security-Policy in _headers: every inline <script> in
// the HTML must have a matching sha256 hash in the CSP, and every hash in the
// CSP must correspond to a current inline script. Runs in CI so an edited
// inline script can't silently break script execution in production (local
// servers don't apply _headers, so nothing else would catch it).
//
//   node scripts/check-csp.mjs

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const PAGES = ["index.html", "404.html", "links.html"];

const actual = new Map(); // hash -> where it came from
for (const page of PAGES) {
  // Git normalises to LF on commit, so that's what Cloudflare serves; hash
  // the LF form regardless of local checkout line endings.
  const html = readFileSync(page, "utf8").replace(/\r\n/g, "\n");
  // Bare <script> only: external scripts are covered by 'self', and data
  // blocks like application/ld+json are never executed, so neither needs a hash.
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    const hash = "sha256-" + createHash("sha256").update(match[1]).digest("base64");
    actual.set(hash, (actual.get(hash) ? actual.get(hash) + ", " : "") + page);
  }
}

const headers = readFileSync("_headers", "utf8");
const declared = new Set([...headers.matchAll(/'(sha256-[^']+)'/g)].map((m) => m[1]));

let ok = true;
for (const [hash, pages] of actual) {
  if (!declared.has(hash)) {
    console.error(`missing from _headers: '${hash}' (inline script in ${pages})`);
    ok = false;
  }
}
for (const hash of declared) {
  if (!actual.has(hash)) {
    console.error(`stale hash in _headers: '${hash}' matches no current inline script`);
    ok = false;
  }
}

if (ok) {
  console.log(`CSP in sync: ${actual.size} unique inline script hash(es) across ${PAGES.length} pages`);
} else {
  console.error("CSP hash mismatch. Recompute with: node scripts/check-csp.mjs --print");
}
if (process.argv.includes("--print")) {
  for (const [hash, pages] of actual) console.log(`'${hash}'  # ${pages}`);
}
process.exit(ok ? 0 : 1);
