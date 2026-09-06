# scatteredpearls.studio

Website for the **Scattered Pearls** studio. (Not built yet — placeholder.)

- **Domain:** `scatteredpearls.studio`
- **Apps as paths:** e.g. `scatteredpearls.studio/butterfingers` (no separate per-app domains,
  by design).
- **Later:** studio intro, app list / landing pages, privacy label ("no data"), contact/support.

Design & brand come from the studio repo `../scatteredpearls` (design system).

## Deployment

- **Hosting:** GitHub Pages, deployed from `main` (repo Settings → Pages).
- **Public repo** (required for free GitHub Pages).
- **Custom domain:** `scatteredpearls.studio` via the `CNAME` file in this repo.
- **DNS (apex, at the registrar):** four A records to GitHub Pages —
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
- **Domain verification:** a TXT record `_github-pages-challenge-alextitze` (token from
  GitHub → Settings → Pages).
- **HTTPS:** enforced (Let's Encrypt, auto-provisioned).
- Live at `https://scatteredpearls.studio`.

