import { LINKS, SUPPORT_EMAIL } from '~consts/links';

const SITE_URL = new URL('/', import.meta.env.SITE).href;

export const ORGANIZATION = {
  '@type': 'Organization',
  name: 'Inspector',
  url: SITE_URL,
  logo: new URL('/images/logo-square-flat.png', SITE_URL).href,
};

export const HOME_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', name: 'Inspector', url: SITE_URL },
    {
      ...ORGANIZATION,
      legalName: 'Inspector S.R.L.',
      email: SUPPORT_EMAIL,
      sameAs: [LINKS.linkedin, LINKS.twitter, LINKS.facebook],
    },
  ],
};
