// Example data for product UI. These figures illustrate the interface and are
// not measurements, so never reuse them as claims.

const OFFICES_QUERY =
  'select `offices`.*, `office_user`.`user_id` from `offices` inner join `office_user` on `offices`.`id` = `office_user`.`office_id` where `office_user`.`user_id` = ?';

export const N_PLUS_ONE_TRACE = {
  name: 'GET /api/users',
  duration: 412,
  result: '200',
  finding: '6 identical queries in one request',
  segments: [
    { label: 'select * from `users`', start: 0, duration: 38.2 },
    { label: OFFICES_QUERY, start: 60, duration: 48.1, out: true },
    { label: OFFICES_QUERY, start: 110, duration: 52.4, out: true },
    { label: OFFICES_QUERY, start: 164, duration: 44.7, out: true },
    { label: OFFICES_QUERY, start: 210, duration: 56.3, out: true },
    { label: OFFICES_QUERY, start: 268, duration: 48.9, out: true },
    { label: OFFICES_QUERY, start: 318, duration: 54.2, out: true },
    { label: 'redis:get', start: 376, duration: 22.6 },
  ],
};

export const AGENT_RUN_TRACE = {
  name: 'SupportAgent',
  duration: 2840,
  result: 'success',
  finding: 'Slowest step: the second LLM call',
  segments: [
    { label: 'LLM call', start: 0, duration: 620 },
    { label: 'Tool: searchOrders', start: 630, duration: 180 },
    {
      label: 'select * from `orders` where `customer_id` = ?',
      start: 650,
      duration: 92,
    },
    { label: 'LLM call', start: 820, duration: 1740, out: true },
    { label: 'Tool: sendReply', start: 2570, duration: 240 },
  ],
};

export const ERROR_ROWS = [
  {
    message: 'Call to a member function format() on null',
    app: 'shop-api',
    hits: '48',
    lastSeen: '2 minutes ago',
    action: { text: 'Read the fix', primary: true },
  },
  {
    message:
      'SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry',
    app: 'billing',
    hits: '12',
    lastSeen: '9 minutes ago',
    action: { text: 'Try AI Bug Fix' },
  },
  {
    message: 'cURL error 28: Operation timed out after 5000 milliseconds',
    app: 'shop-api',
    hits: '7',
    lastSeen: '1 hour ago',
    action: { text: 'Try AI Bug Fix' },
  },
];

export const TRANSACTION_ROWS = [
  {
    name: 'GET /api/users',
    type: 'request',
    hits: '57',
    duration: '412 ms',
    memory: '2.2 MB',
    result: '200',
  },
  {
    name: 'POST /api/orders',
    type: 'request',
    hits: '23',
    duration: '176 ms',
    memory: '3.1 MB',
    result: '200',
  },
  {
    name: 'GET /api/invoices/{id}',
    type: 'request',
    hits: '9',
    duration: '86 ms',
    memory: '1.9 MB',
    result: '500',
  },
  {
    name: 'orders:sync',
    type: 'command',
    hits: '7',
    duration: '1.2 sec',
    memory: '21.8 MB',
    result: 'success',
  },
  {
    name: 'App\\Jobs\\SendInvoice',
    type: 'job',
    hits: '112',
    duration: '640 ms',
    memory: '12.4 MB',
    result: 'success',
  },
];

export const SLOW_QUERY_SESSION = {
  title: 'Coding agent',
  status: 'Inspector MCP connected',
  label: 'Example coding agent session',
  steps: [
    { type: 'prompt', text: 'Why is GET /api/users slow in production?' },
    {
      type: 'calls',
      calls: [
        { tool: 'worst_performing_transactions', target: 'shop-api' },
        { tool: 'transaction_details', target: 'GET /api/users' },
      ],
    },
    {
      type: 'reply',
      html: 'N+1 query in UserController@index. It loads <code>offices</code> once per user, which adds 6 queries to every request.',
    },
    {
      type: 'diff',
      file: 'app/Http/Controllers/UserController.php',
      removed: '$users = User::all();',
      added: "$users = User::with('offices')->get();",
    },
  ],
} as const;

export const PHONE_SESSION = {
  title: 'Chat on your phone',
  status: 'Inspector connected',
  label: 'Example chat with an agent on a phone',
  steps: [
    { type: 'prompt', text: 'What broke in production this morning?' },
    {
      type: 'calls',
      calls: [
        { tool: 'get_latest_production_errors', target: 'shop-api' },
        {
          tool: 'get_error_analysis',
          target: 'Call to a member function format() on null',
        },
      ],
    },
    {
      type: 'reply',
      html: '<code>Invoice::dueDate()</code> returns null for invoices created by the import job. A guard in <code>InvoicePresenter</code> fixes it. Should I open a pull request?',
    },
    { type: 'prompt', text: 'Yes, open it.' },
  ],
} as const;

export const FIX_PROPOSAL = {
  title: 'Guard against a missing due date',
  file: 'app/Presenters/InvoicePresenter.php',
  explanation:
    'Invoices created by the import job have no due date, so <code>dueDate()</code> returns null and <code>format()</code> throws. Return a placeholder when the date is missing.',
  removed: "return $this->invoice->dueDate()->format('d/m/Y');",
  added: "return $this->invoice->dueDate()?->format('d/m/Y') ?? 'Not set';",
};
