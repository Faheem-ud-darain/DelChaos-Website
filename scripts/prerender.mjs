// Runs after `vite build` and `vite build --ssr`: renders the page to HTML, fills in the site address and
// structured data, and writes sitemap.xml, robots.txt and llms.txt. Crawlers then get real content, not an empty div.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const serverDir = resolve(root, 'dist-server');

const envFile = readFileSync(resolve(root, '.env'), 'utf8');
const fromFile = envFile.match(/^SITE_URL=(.+)$/m)?.[1]?.trim();
const siteUrl = (process.env.SITE_URL || fromFile || 'https://delchaos.pages.dev').replace(/\/+$/, '');

const { render, faq } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href);

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DelChaos',
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DelChaos',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Android, iOS',
    description: 'Attendance, payroll, leave, onboarding and chat in one HR system, sold as a complete product with its full source code.',
    url: siteUrl,
    image: `${siteUrl}/og.png`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  },
]
  .map((block) => `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`)
  .join('\n    ');

const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
const html = template
  .replaceAll('{{SITE_URL}}', siteUrl)
  .replace('<!--jsonld-->', jsonLd)
  .replace('<!--app-->', render());
writeFileSync(resolve(dist, 'index.html'), html);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
);
writeFileSync(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
writeFileSync(
  resolve(dist, 'llms.txt'),
  `# DelChaos\n\n> HR and workforce operations software: attendance, payroll, leave, onboarding and chat in one system. Sold as a complete product with its full source code, so a company can own, host and change it.\n\n## Pages\n\n- [Home](${siteUrl}/): features, roles, how it works, ownership and FAQ\n`,
);

rmSync(serverDir, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
console.log(`Prerendered ${siteUrl}/ (${html.length} bytes)`);
