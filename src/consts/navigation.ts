import { INTEGRATIONS, NEURON_PATH } from '~consts/frameworks';

export interface NavItem {
  name: string;
  description: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Features',
    items: [
      {
        name: 'Monitoring tool',
        description: 'See every request, job and error in production.',
        href: '/product-features/',
      },
      {
        name: 'MCP Server',
        description: 'Connect your coding agent to production data.',
        href: '/mcp-server/',
      },
      {
        name: 'AI Bug Analysis',
        description:
          'Investigate new errors before your coding agent fixes them.',
        href: '/ai-bug-analysis/',
      },
    ],
  },
  {
    label: 'Supported frameworks',
    items: INTEGRATIONS,
  },
  {
    label: 'Resources',
    items: [
      {
        name: 'Blog',
        description: 'Tutorials on monitoring and scaling PHP.',
        href: '/blog/',
      },
      {
        name: 'Testimonials',
        description: 'What teams say about Inspector.',
        href: '/testimonials/',
      },
      {
        name: 'The company',
        description: 'Who builds Inspector, and why.',
        href: '/about/',
      },
    ],
  },
];
