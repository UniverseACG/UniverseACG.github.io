# UACG address pages

Standalone static address directory. Keep it independent of business services.

- Never publish origin server addresses, including in link targets or generated HTML.
- Maintain destinations in `src/sites.json`. Do not invent health or latency results.
- Keep this a links-only page. All content and navigation must work without JavaScript.
- Keep assets local; no analytics, fonts, SDKs, credentials or authenticated API requests.
- Preserve UACG branding and desktop/mobile keyboard and touch access.
- Build with `npm run build`; preview with `python3 -m http.server 3309 --bind 127.0.0.1 --directory dist`.
- Verify all four pages in desktop/mobile browsers and with JavaScript disabled.
- Publish only `dist`; never upload `.git`, workspace paths or personal Git metadata.
- Commits use `UACG-TEAM <uacg-team@users.noreply.github.com>` as author and committer,
  without personal signatures or co-author trailers. Do not change other repositories' identity.
- Preserve repository visibility unless the user explicitly authorizes a change.
  A team commit identity does not change the hosting provider's authenticated deployment actor.
