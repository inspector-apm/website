import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { INTEGRATIONS } from '~consts/frameworks';
import { LINKS, SUPPORT_EMAIL } from '~consts/links';
import { MCP_URL, TERMINAL_CLIENTS } from '~consts/mcp';
import { NAV_GROUPS } from '~consts/navigation';
import { FREE_NOTE, PLANS } from '~consts/pricing';

// The llms.txt index for AI tools, in the format described at https://llmstxt.org.
export const GET: APIRoute = async ({ site }) => {
  const url = (href: string) => new URL(href, site).href;
  const link = (name: string, href: string, note: string) =>
    `- [${name}](${url(href)}): ${note}`;

  const features = NAV_GROUPS[0].items.map((item) =>
    link(item.name, item.href, item.description),
  );

  const frameworks = INTEGRATIONS.map((item) =>
    link(
      item.name,
      item.href,
      `${item.description} Install with \`${item.command}\`.`,
    ),
  );

  const plans = PLANS.map((plan) => {
    const price =
      plan.monthly === 0
        ? '€0'
        : `€${plan.monthly} a month or €${plan.yearly} a year`;
    const channels = `${plan.channels} notification ${plan.channels === '1' ? 'channel' : 'channels'}`;
    const overage =
      plan.overage === 'None'
        ? 'no usage-based billing'
        : `${plan.overage} for each extra 50K transactions`;

    return `- ${plan.name}: ${price}. ${plan.transactions} transactions a month, ${plan.retention} of data retention, ${plan.users.toLowerCase()} users, ${channels.toLowerCase()}, ${overage}.`;
  });

  const posts = (await getCollection('blog'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post) => link(post.data.title, `/${post.id}/`, post.data.summary));

  const body = [
    '# Inspector',
    '',
    '> Inspector monitors your PHP application in production and gives coding agents the errors, slow queries and stack traces they need to fix your code.',
    '',
    `Inspector records every HTTP request, background job and command in a PHP application, with the database queries and errors inside them. Its MCP server at ${MCP_URL} gives coding agents such as ${TERMINAL_CLIENTS.slice(0, -1).join(', ')} and ${TERMINAL_CLIENTS.at(-1)} access to that production data. AI Bug Fix proposes a fix for production errors, and a coding agent connected through the MCP server changes the code.`,
    '',
    `Inspector is billed by transactions: one HTTP request, background job or scheduled command. The events inside a transaction are unlimited. ${FREE_NOTE} Sign up at ${LINKS.register}.`,
    '',
    '## Product',
    '',
    ...features,
    link('Pricing', '/pricing/', 'Plans, quotas and usage-based billing.'),
    '',
    '## Supported frameworks',
    '',
    ...frameworks,
    '',
    '## Pricing',
    '',
    'Prices in EUR. Transactions are per month.',
    '',
    ...plans,
    '',
    '## Documentation',
    '',
    link(
      'Inspector documentation',
      `${LINKS.docs}/llms.txt`,
      'Index of the developer docs: installation guides, configuration, alerts, notification channels and the REST API.',
    ),
    link(
      'MCP server',
      LINKS.mcpDocs,
      'Connect a coding agent to your production data.',
    ),
    link(
      'AI Bug Fix',
      LINKS.bugFixDocs,
      'Get a proposed fix for production errors.',
    ),
    link(
      'Neuron AI documentation',
      'https://docs.neuron-ai.dev/llms.txt',
      'The PHP framework for AI agents, with built-in observability powered by Inspector.',
    ),
    '',
    '## Company',
    '',
    ...NAV_GROUPS[2].items
      .filter((item) => item.href !== '/blog/')
      .map((item) => link(item.name, item.href, item.description)),
    link('Status', LINKS.status, 'Service status of the Inspector platform.'),
    `- Support: ${SUPPORT_EMAIL}`,
    '',
    '## Optional',
    '',
    ...posts,
    '',
  ].join('\n');

  return new Response(body);
};
