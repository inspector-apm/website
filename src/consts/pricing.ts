export interface Plan {
  name: string;
  monthly: number;
  yearly: number;
  transactions: string;
  retention: string;
  users: string;
  channels: string;
  overage: string;
}

export const PLANS: Plan[] = [
  {
    name: 'Free',
    monthly: 0,
    yearly: 0,
    transactions: '30K',
    retention: '3 days',
    users: 'Up to 3',
    channels: '1',
    overage: 'None',
  },
  {
    name: 'Beginner',
    monthly: 15,
    yearly: 150,
    transactions: '300K',
    retention: '7 days',
    users: 'Unlimited',
    channels: 'Unlimited',
    overage: '€2.50',
  },
  {
    name: 'Developer',
    monthly: 39,
    yearly: 390,
    transactions: '800K',
    retention: '14 days',
    users: 'Unlimited',
    channels: 'Unlimited',
    overage: '€2.25',
  },
  {
    name: 'Team',
    monthly: 69,
    yearly: 690,
    transactions: '1.5M',
    retention: '14 days',
    users: 'Unlimited',
    channels: 'Unlimited',
    overage: '€2.00',
  },
  {
    name: 'Scale',
    monthly: 99,
    yearly: 990,
    transactions: '3M',
    retention: '21 days',
    users: 'Unlimited',
    channels: 'Unlimited',
    overage: '€1.65',
  },
  {
    name: 'Enterprise',
    monthly: 169,
    yearly: 1690,
    transactions: '6M',
    retention: '21 days',
    users: 'Unlimited',
    channels: 'Unlimited',
    overage: '€1.40',
  },
];

export const INCLUDED = [
  'Unlimited events',
  'Unlimited hosts and apps',
  'AI Bug Fix',
  'Live chat support',
];

export const PRICING_REASONS = [
  {
    title: 'Detailed monitoring costs nothing extra',
    text: 'When you pay per event, every extra detail raises the bill. Here, the events inside a transaction are unlimited, so 30K transactions can carry more than 500K events.',
  },
  {
    title: 'An N+1 query can’t spike your bill',
    text: 'One chatty ORM relationship can multiply your event count overnight. With transactions, your cost follows your traffic, and you have time to catch the problem.',
  },
  {
    title: 'Capacity is easy to plan',
    text: 'You already think in requests, jobs and commands, so you can estimate your plan from the traffic you know.',
  },
];

export const PRICING_FAQ = [
  {
    question: 'What is a transaction?',
    answer:
      'One execution cycle of your application, such as an HTTP request, a background job or a scheduled command. The events inside a transaction are unlimited.',
  },
  {
    question: 'How does the Free plan work?',
    answer:
      'You get unlimited data for the first 7 days, then 30K transactions every month with no deadline. You don’t need a credit card, and it isn’t a trial.',
  },
  {
    question: 'What does the Free plan leave out?',
    answer:
      'It has 3 days of data retention, up to 3 team members, 1 notification channel and no REST API access.',
  },
  {
    question: 'What happens when I reach my quota?',
    answer:
      'Inspector drops new data until your next monthly cycle. To keep it flowing, upgrade your plan or turn on usage-based billing.',
  },
  {
    question: 'How does usage-based billing work?',
    answer:
      'Monitoring continues past your quota, and each extra slot of 50K transactions costs the rate shown for your plan. You turn it on or off in the billing section.',
  },
  {
    question: 'Can I change plan at any time?',
    answer:
      'Yes. You can upgrade or downgrade whenever you want. Changes during the month are prorated, and monitoring is not interrupted.',
  },
  {
    question: 'Will Inspector slow down my application?',
    answer:
      'No. Inspector works asynchronously, so it stays invisible to your users.',
  },
];
