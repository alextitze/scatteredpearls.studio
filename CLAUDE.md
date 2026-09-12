# scatteredpearls.studio — instructions

> ⚠️ **THIS REPO IS PUBLIC** (GitHub Pages serves it at scatteredpearls.studio).
> Everything committed here is world-readable. **Never commit secrets, private paths,
> personal data, or internal/maintainer notes — in any file, Markdown and docs
> included.** Keep runbooks (deploy steps, DNS, verification tokens) in the private
> studio repo.

Follow the Scattered Pearls studio conventions:

@../scatteredpearls/CONVENTIONS.md

## App-specific

- Static site (GitHub Pages), custom domain via `CNAME`. Apps live as paths
  (e.g. `scatteredpearls.studio/blitzfingers`).
- Consumes the shared design system: `tokens.css` is **vendored** (a copy) from
  `../scatteredpearls/design-system/tokens.css`. Re-sync it when the tokens change.
- Brand fonts are **self-hosted** in `fonts/` (no CDN) so no visitor data leaves to a
  third party — see `fonts/README.md` (SIL OFL 1.1).
