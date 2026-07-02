# TODO: needs Q's input

Experience, education and location were filled in from the CV (Qasim_Mahmood_CV_AI.docx).
The CV ends at July 2024, so the current role still needs details.
Each remaining item has a matching `<!-- TODO -->` comment in `index.html` where relevant.

## Facts to fill in

- [ ] **LinkedIn URL**: `linkedin.com/in/qasimmahmood95` is a guess, used in the hero. Confirm or correct.
- [ ] **Current role**: start date (sometime after July 2024), and how to name the employer (currently the generic "Digital asset custody firm").
- [ ] **Current role bullets**: add concrete achievements and metrics; the three bullets only restate facts from the brief.

## To review

- [ ] **CV-sourced metrics now public**: 900%/1000% release speed-ups, £2.4m deposits, 50M+ users, ~200 interviews, QA team 1 to ~30. Fine on a CV; confirm they should be on a public site attached to named employers.
- [ ] **Non-fintech entries**: Visible (contract) and Wyman Gordon are included for continuity and the career-change story. Cut them if the site should be purely fintech.
- [ ] **All copy**: hero line, about narrative and contact blurb are drafts to edit.
- [ ] **Certification names**: check they match the actual certs, especially the ISTQB Agile one and "AUSCIF Islamic Finance". The site lists more certs than the CV (per the brief); the CV only has AZ-900 + three ISTQB, so update whichever is stale.
- [ ] **Email**: `qasimm999@gmail.com` is shown publicly (assembled at runtime). The CV placeholder says "[Email address]", so confirm this is the one to publish.
- [ ] **Favicon**: currently a minimal teal "Q" monogram (inline SVG). Replace if wanted.
- [ ] **"Now" strip**: two items are real; add or update (cert in progress, reading, talks).
- [ ] **Footer "View source" link**: points at the GitHub profile; update to the repo URL once pushed.

## Before/at launch

- [ ] Create the GitHub repo under `qasimmahmood95` and push (`git remote add origin ... && git push -u origin main`).
- [ ] Set up Cloudflare Pages and the custom domain (steps in README).
- [ ] Run Lighthouse against the deployed site (local static-server numbers aren't representative).
- [ ] `BRIEF.md` is gitignored as a working note. Delete or un-ignore as preferred.
