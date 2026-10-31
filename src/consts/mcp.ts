export const MCP_URL = 'https://app.inspector.dev/mcp';

export const TERMINAL_CLIENTS = [
  'Claude Code',
  'Codex',
  'OpenCode',
  'Cursor',
  'VS Code',
  'Kilo',
];

export const WEB_CLIENTS = ['Claude', 'ChatGPT', 'Gemini', 'LibreChat'];

export const CLIENT_CONFIGS = [
  {
    caption: 'Claude Code',
    code: `claude mcp add --transport http inspector ${MCP_URL} --header "Authorization: Bearer YOUR_API_KEY"`,
  },
  {
    caption: 'VS Code',
    lang: 'json' as const,
    code: `{
    "mcp": {
        "servers": {
            "inspector": {
                "type": "http",
                "url": "${MCP_URL}",
                "headers": {
                    "Authorization": "Bearer YOUR_API_KEY"
                }
            }
        }
    }
}`,
  },
  {
    caption: 'Cursor',
    lang: 'json' as const,
    code: `{
  "mcpServers": {
    "inspector": {
      "url": "${MCP_URL}",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`,
  },
];

export const MCP_TOOLS = [
  {
    label: 'list_apps',
    value:
      'List the apps you have access to, with their platform and repository.',
  },
  {
    label: 'get_latest_production_errors',
    value:
      'Get recent production errors, with their frequency and the code they affect.',
  },
  {
    label: 'get_error_analysis',
    value:
      'Analyze one error, with the source file, its patterns and how often it occurs.',
  },
  {
    label: 'recent_transactions',
    value: 'See what the application is doing now, grouped by endpoint.',
  },
  {
    label: 'worst_performing_transactions',
    value: 'Get the ten slowest transactions in a time range.',
  },
  {
    label: 'transaction_details',
    value:
      'Read a transaction’s timeline, with every query, cache command and external call.',
  },
  {
    label: 'get_installation_instructions',
    value: 'Get the steps and ingestion key to install Inspector in a project.',
  },
  {
    label: 'create_app',
    value: 'Create a new app to monitor a project. Organization admins only.',
  },
];

export const MCP_READS = [
  'Your applications: names, platforms and connected repositories',
  'Production errors: stack traces, source code and frequency',
  'Performance data: requests, jobs and commands, with their timelines',
  'Ingestion keys, when you ask to install Inspector in a project',
];

export const MCP_LIMITS = [
  'It can’t change or delete your account, existing apps, alerts or settings',
  'It can’t access billing, team members or API keys',
  'It can’t see apps you haven’t been given access to',
];
