# qasimmahmood.org

<!-- TODO: confirm badge URL once the repo is pushed (assumes repo name q-website) -->
![CI](https://github.com/qasimmahmood95/q-website/actions/workflows/ci.yml/badge.svg)

Single-page personal site for Qasim Mahmood, Senior SDET in regulated fintech and digital assets.

Plain HTML + Tailwind CSS v4, vanilla JS. No framework, no CMS, no tracking.

## Structure

```
index.html      the whole site (single page)
links.html      link-in-bio page, served at /links; edit the LINKS array inside it
404.html        custom not-found page (Cloudflare Pages serves it automatically)
src/input.css   Tailwind source (theme tokens, dark-mode variant, print styles)
css/site.css    compiled CSS (committed, rebuilt on deploy)
js/main.js      dark-mode toggle, mobile nav, certifications data, email links,
                scroll effects (progress bar, scrollspy, section reveals),
                command palette (ctrl/cmd+k)
assets/         og.png social card, public CV PDF (phone number removed),
                topo-*.svg contour tiles for the animated background
scripts/        generate-topo.mjs regenerates the contour tiles (plain Node)
tests/          Playwright suite covering the site's behaviour
```

The animated topographic background is pure CSS: two layers masked by the
pre-generated contour SVGs drift at different speeds, and freeze under
`prefers-reduced-motion`. Regenerate the tiles with `node scripts/generate-topo.mjs`.

To **add a certification**, add one line to the `CERTIFICATIONS` array in
[js/main.js](js/main.js). No rebuild needed.

## Local preview

```sh
npm install
npm run build        # compile css/site.css (or `npm run watch` while editing)
npx serve .          # any static server works; then open http://localhost:3000
```

The compiled CSS is committed, so simply opening `index.html` in a browser also
works. Just remember to run `npm run build` after changing Tailwind classes in
the HTML.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub (`github.com/qasimmahmood95`).
2. In the Cloudflare dashboard: **Workers & Pages > Create > Pages > Connect to Git**, and select the repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `/` (root)
4. Deploy. Every push to `main` triggers a new deployment; PRs get preview URLs automatically.
5. Custom domain: **Pages project > Custom domains > Set up a custom domain**, then enter `qasimmahmood.org`. If the domain's DNS is already on Cloudflare this is a one-click CNAME; otherwise move the nameservers first.

## Tests

The site ships with its own Playwright suite (yes, really):

```sh
npx playwright install chromium   # first run only
npm test
```

It covers section structure, certification rendering, email obfuscation,
theme persistence, the command palette, scroll effects, the mobile nav,
and the 404 page. The config starts its own static server, or reuses one
already running on port 8123.

## CI

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs on every push and PR:
CSS build, HTML validation (`html-validate`), a link check (`lychee`,
LinkedIn excluded because it blocks bots), and the Playwright suite.
