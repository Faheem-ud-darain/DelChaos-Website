// Runs after `vite build` and `vite build --ssr`: renders the page to HTML, fills in the site address and
// structured data, and writes sitemap.xml, robots.txt and llms.txt. Crawlers then get real content, not an empty div.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const serverDir = resolve(root, 'dist-server');

// .env is optional (it is gitignored); on Cloudflare the SITE_URL build variable is used instead.
const envPath = resolve(root, '.env');
const fromFile = existsSync(envPath) ? readFileSync(envPath, 'utf8').match(/^SITE_URL=(.+)$/m)?.[1]?.trim() : undefined;
const siteUrl = (process.env.SITE_URL || fromFile || 'https://delchaos.pages.dev').replace(/\/+$/, '');

const { render, faq } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href);

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'DelChaos', url: siteUrl },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DelChaos',
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    email: 'studiosparx@gmail.com',
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'studiosparx@gmail.com', telephone: '+905488281864', availableLanguage: 'English' },
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
    publisher: { '@type': 'Organization', name: 'DelChaos', url: siteUrl },
    featureList: ['Attendance and shift tracking', 'Payroll built from attendance and leave', 'Leave requests and approvals', 'Guided employee onboarding', 'Team chat, tickets and an assistant', 'Full source code included'],
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
