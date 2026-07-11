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
- [x] **Certifications**: synced with the LinkedIn profile (18 certs with issue
      dates and credential IDs, grouped Cloud / Testing / DevOps / AI / Other;
      Claude Code Essentials corrected to ExamPro). Early Adopter badge variants
      and Google Analytics for Beginners left off deliberately.
- [ ] **Favicon**: currently a minimal teal "Q" monogram (inline SVG). Replace if wanted.
- [ ] **"Now" strip**: two items are real; add or update (cert in progress, reading, talks).
- [x] **Footer "View source" link**: points at the repo.

- [ ] **CV PDF**: `assets/Qasim_Mahmood_CV.pdf` is generated from the CV docx with the
      phone number removed. Regenerate it whenever the CV changes.
- [ ] **OG image**: `assets/og.png` is generated (1200x630). After deploying, paste the
      site URL into LinkedIn's Post Inspector to confirm the card renders.
- [x] **Testimonials**: three excerpts from LinkedIn recommendations (Mario Husha,
      Lucie Kovacsova, Rafal Ozog) now sit under the experience timeline. Confirm
      the picks and the trimming.
- [x] **Certification verify links**: 17 of 18 linked and confirmed resolving.
      AUSCIF has no public credential page, so its card stays plain.
- [ ] **ISTQB links point at Google Drive scans** (what LinkedIn uses). Cleaner
      option: register on the official ISTQB Successful Candidate Register
      (scr.istqb.org) and swap in those entries.
- [ ] **Metric discrepancies to reconcile**: LinkedIn About says 6 funds + 12 ETFs
      and deposits over £3.5m, team to "over 20", "over 200" interviews; the
      LinkedIn Moneybox entry says £2.4m and "over 150"; the CV says £2.4m,
      almost 200, almost 30. The site currently uses the CV figures. Pick one
      story and I'll align site, CV and LinkedIn.
- [ ] **Case studies**: the two expandables (Zodia headless handshake, Playroll QA
      from zero) are drafted from CV facts; review the narratives.
- [x] **Lighthouse line**: measured 100/100/100/100 on the pages.dev deployment
      (2026-07-11); colophon links to the PageSpeed report for qasimmahmood.org,
      which points at the old site until the domain cutover.
- [x] **README badge**: points at `qasimmahmood95/qasimmahmood.org`.

## Before/at launch

- [x] Create the GitHub repo under `qasimmahmood95` and push.
- [ ] Set up Cloudflare Pages and the custom domain (steps in README).
- [x] Run Lighthouse against the deployed site: 100 across the board.
- [ ] `BRIEF.md` is gitignored as a working note. Delete or un-ignore as preferred.
