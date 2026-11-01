// Everything that is "about the site" lives here, so a rename, a new contact address or a new link is a one-line change.
export const SITE = {
  name: 'DelChaos',
  tagline: 'Run your people without the chaos.',
  contactEmail: 'studiosparx@gmail.com',
  // WhatsApp is the only phone channel. The link form drops the + and spaces.
  whatsappDisplay: '+90 548 828 18 64',
  whatsappNumber: '905488281864',
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

export const whatsappHref = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent('Hi, I would like to talk about DelChaos.')}`;
