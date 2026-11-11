# Portfolio Update & Audit Report

## Scope

Updated the existing GitHub Pages portfolio without redesigning its visual identity. The package contains the website source, assets, repository README, sitemap, robots file, and GitHub verification file.

## Changes made

- Removed manually maintained TryHackMe rank/level/room/badge totals and global-rank claims from the website and README. The official profile link and profile badge remain the source of current information.
- Replaced the outdated progress percentage and associated hardcoded TryHackMe room/badge totals.
- Reclassified vendor-topic self-study as training/self-study rather than earned Cisco, CompTIA, Fortinet, or Microsoft exam certifications.
- Removed unsupported employment performance metrics and rewrote the associated bullets as qualitative descriptions.
- Removed the unverified "Immediate" availability statement.
- Replaced an unsupported comparison with a factual description of infrastructure experience.
- Clearly labelled the interactive terminal as a local simulation and replaced simulated scan/SQLi output that appeared to report successful exploitation.
- Updated the TryHackMe terminal command to direct visitors to the official profile.
- Updated the Open Graph/Twitter image to the local portfolio social-preview asset.
- Re-rendered `assets/og-preview.png` from the existing SVG at 1200 × 630; the original PNG was invalid (1 byte).
- Generated `assets/hero-poster.jpg` from the existing hero video and referenced it as the video poster.
- Improved the JSON-LD `alumniOf` value to a structured educational organization.
- Added `media-src 'self'` to the existing CSP.
- Updated README positioning and removed stale TryHackMe statistics.

## Static checks completed

- HTML parsed with no parser errors.
- Inline JavaScript passed `node --check`.
- JSON-LD parsed as valid JSON.
- No duplicate HTML IDs detected.
- No broken in-page fragment links detected.
- No missing local image/video/link assets detected.
- All images have `alt` attributes.
- All `_blank` links include `noopener noreferrer`.
- Reduced-motion CSS support remains present.
- Social preview PNG is 1200 × 630.
- Hero poster image exists and is readable.

## Checks not completed

- Browser-based rendering and responsive interaction tests were not completed. Chromium navigation was blocked in the execution environment; this is not a passing browser test.
- Live TryHackMe profile statistics could not be fetched from this environment. No current rank, level, room count, streak, or badge count is asserted in the updated site.
- External certificate verification pages, external badge images, resume URL, and all third-party links were not independently checked for current availability.
- Lighthouse, screen-reader testing, and cross-browser testing were not run.

## Manual confirmation required before deployment

Please verify these personal facts and claims:

1. Current job title, employer display name, dates, and location.
2. The 180+ access-point and 200+ IP-camera figures.
3. Education institution, degree, and graduation year.
4. Relocation destinations and current preferred work location.
5. The CLLMSE credential details and issuer verification page.
6. The status of eJPT preparation.
7. The listed selected TryHackMe badge names.

The availability field was removed rather than guessing your notice period or start date.

## Security notes

- The terminal command echo uses `textContent`; the simulated commands do not execute scans, send HTTP requests, or access a database.
- Dynamic card markup uses the existing escaping helper. No exploitable XSS was confirmed by this static source review.
- The CSP still includes `unsafe-inline` for scripts and styles because the page currently uses inline JavaScript and CSS. This is a hardening limitation, not proof of an exploitable vulnerability.
- A browser-based security test was not possible in this environment.

## Deployment assessment

**Ready after manual confirmation and browser testing.**

No files were pushed to GitHub and no deployment was performed.

## TryHackMe live statistics update (2026-11-11)
- Added a browser-side `fetch()` request to TryHackMe's observed public-profile endpoint for `Hackth3Path` on each portfolio page load.
- Displays global rank, top-percentile, level, and completed-room count from the returned JSON. Values are validated and inserted using `textContent`.
- Added a 10-second timeout, accessible loading/status messaging, and an explicit unavailable state linking to the official profile. No stale rank is shown if the request fails.
- Updated the meta CSP `connect-src` directive to permit `https://tryhackme.com`.
- Static verification: HTML parser reports zero errors; no duplicate IDs; inline application JavaScript passes `node --check`.
- Runtime limitation: live endpoint/CORS could not be tested from this environment because outbound DNS resolution for `tryhackme.com` is unavailable. GitHub Pages browser access therefore remains unverified until the deployed page is opened in a browser. The endpoint is observed, undocumented, and may change.

## TryHackMe live-statistics CORS follow-up

- Browser console evidence supplied on 2026-11-11 confirmed direct browser fetches to `tryhackme.com/api/v2/public-profile` fail CORS because the upstream response does not include `Access-Control-Allow-Origin`.
- Added `thm-profile-proxy.js`, a Cloudflare Worker that calls the fixed public profile endpoint server-side and returns only username, rank, percentile, level, and completed room count.
- Worker CORS allows only `https://kyriloskamal.github.io`; it accepts GET/OPTIONS, has no arbitrary URL or username parameter, forwards no visitor credentials, and caches responses for 5 minutes.
- Updated the portfolio to request the Worker endpoint and allow `*.workers.dev` in `connect-src`.
- **Deployment dependency:** the Worker must be deployed by the repository owner and its actual `workers.dev` URL must replace the placeholder in `index.html`. Until that is done, live stats will remain unavailable. Cloudflare deployment and live end-to-end verification were not performed from this environment.
- Setup instructions: `THM-LIVE-SETUP.md`.
