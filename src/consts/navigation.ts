import { FRAMEWORKS } from '~consts/frameworks';

export interface NavItem {
  name: string;
  description: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

const NEURON_PATH = '/neuron-ai/';

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
        name: 'AI Bug Fix',
        description: 'Get a proposed fix for production errors.',
        href: '/ai-bug-fixer/',
      },
      {
        name: 'Neuron AI framework',
        description: 'Build AI agents in PHP, monitored by Inspector.',
        href: NEURON_PATH,
      },
    ],
  },
  {
    label: 'Supported frameworks',
    items: [
      ...FRAMEWORKS.map(({ slug, name, description }) => ({
        name,
        description,
        href: `/${slug}/`,
      })),
      {
        name: 'Neuron AI',
        description: 'Agent runs, LLM calls and tool calls.',
        href: NEURON_PATH,
      },
    ],
  },
  {
    label: 'Resources',
    items: [
      {
        name: 'Newsletter',
        description: 'Tutorials on building AI agents in PHP.',
        href: '/newsletter/',
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
