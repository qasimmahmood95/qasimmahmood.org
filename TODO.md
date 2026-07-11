# TODO: needs Q's input

All facts now come from the up-to-date CV (Qasim_Mahmood_CV.docx). Remaining items
are reviews and launch steps rather than gaps.

## To review

- [ ] **Public email**: switched to `qasim.mahmood13@alumni.imperial.ac.uk` to match the CV
      (was `qasimm999@gmail.com`). One-line change in `js/main.js` plus the noscript
      fallback in `index.html` if you want the gmail instead.
- [ ] **Zodia Custody details now public**: named employer, Notabene as the Travel Rule
      vendor, the IOTA Rebased staking first, 100% CI/CD reliability claim. All from your
      CV, but a public website is more visible than a CV; confirm you're comfortable.
- [ ] **CV metrics on the site**: 900%/1000% release speed-ups, £2.4m deposits, 50M+ users,
      ~200 interviews, QA team 1 to ~30.
- [ ] **Moneybox "more than 50 releases" bullet**: the new CV dropped it; the site still
      has it. Remove if that was a deliberate cut.
- [ ] **All copy**: hero line, about narrative and contact blurb are drafts to edit.
- [ ] **Certifications**: the site lists more than the CV (AI Practitioner, AI-900, SC-900,
      GCP Digital Leader, ISTQB Agile, GitHub certs, AUSCIF) per the brief, and now also
      Claude Code Essentials from the CV. Check the full list is current.
- [ ] **Favicon**: currently a minimal teal "Q" monogram (inline SVG). Replace if wanted.
- [ ] **"Now" strip**: two items are real; add or update (cert in progress, reading, talks).
- [x] **Footer "View source" link**: points at the repo.

- [ ] **CV PDF**: `assets/Qasim_Mahmood_CV.pdf` is generated from the CV docx with the
      phone number removed. Regenerate it whenever the CV changes.
- [ ] **OG image**: `assets/og.png` is generated (1200x630). After deploying, paste the
      site URL into LinkedIn's Post Inspector to confirm the card renders.
- [ ] **Testimonials**: gather two or three one-line quotes from LinkedIn
      recommendations or colleagues; a quotes block can then slot in near the
      experience section.
- [ ] **Case studies**: the two expandables (Zodia headless handshake, Playroll QA
      from zero) are drafted from CV facts; review the narratives.
- [ ] **Lighthouse line**: after launch, run PageSpeed on the live site and add the
      score to the footer colophon (TODO comment marks the spot).
- [x] **README badge**: points at `qasimmahmood95/q-website`.

## Before/at launch

- [x] Create the GitHub repo under `qasimmahmood95` and push.
- [ ] Set up Cloudflare Pages and the custom domain (steps in README).
- [ ] Run Lighthouse against the deployed site (local static-server numbers aren't representative).
- [ ] `BRIEF.md` is gitignored as a working note. Delete or un-ignore as preferred.
