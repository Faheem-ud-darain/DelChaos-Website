// Everything that is "about the site" lives here, so a rename, a new contact address or a new link is a one-line change.
export const SITE = {
  name: 'DelChaos',
  tagline: 'Run your people without the chaos.',
  // Replace with the real address before launch. Used by every contact button on the page.
  contactEmail: 'hello@delchaos.com',
  contactLabel: 'Talk to us',
} as const;

export const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#roles', label: 'Roles' },
  { href: '#how', label: 'How it works' },
  { href: '#ownership', label: 'Ownership' },
  { href: '#faq', label: 'FAQ' },
] as const;

export const contactHref = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent('DelChaos enquiry')}`;
