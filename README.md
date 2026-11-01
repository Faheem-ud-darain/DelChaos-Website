# DelChaos website

The marketing site for DelChaos. A static Vite + React + Tailwind v4 page: no server, no database. Animation is Motion; the 3D tile field is three.js through react-three-fiber.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks, then builds to dist/
npm run lint
```

## Deploy on Cloudflare Pages

The build prerenders the page (`scripts/prerender.mjs`), so crawlers get real HTML, and writes `sitemap.xml`, `robots.txt` and `llms.txt`.

1. Push this folder to its own Git repository.
2. In Cloudflare, create a Pages project from that repository.
3. Build command: `npm run build`. Output directory: `dist`.
4. Set `SITE_URL` (build variable, or in `.env`) to the public address, for example `https://delchaos.pages.dev`. Change it to the custom domain once connected; canonical URLs, social tags, structured data and the sitemap all follow it.

Or from the terminal: `npm run deploy` (needs `wrangler login` once).

`public/_headers` sets the security headers and long caching for built files.

## Change things

- **Contact address, name, tagline, nav links:** `src/site.ts` (email and WhatsApp number live here; the prerender script repeats them in the structured data).
- **Colours and both themes:** the CSS variables at the top of `src/index.css`. Components use only those tokens, never hex values. The accent is one variable, `--accent`.
- **Copy:** each section lives in `src/components/sections/`.
- **Shared pieces:** `src/components/ui/` (button, tabs, accordion, tile, badge, logo, window frame). Use these before writing a new one.
- **Product previews:** `src/components/app/` (the animated desktop and phone app) and `src/components/previews/` (the animated feature cards). They are real components with made-up sample data, so no real employee or company data is on the site. `useSequence` drives their loops and only runs while they are on screen; with reduced motion they stay on the finished picture.
- **3D:** `src/components/three/`. `ChaosField` is the tile field (scattered, then snapping into a grid). It is lazy-loaded after the page is up, takes its colours from the CSS variables, pauses off-screen, and is drawn still under reduced motion. `Backdrop3D` places it in the hero and the closing section.
