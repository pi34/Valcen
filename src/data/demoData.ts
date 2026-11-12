import type { Teammate, Decision, AgentEvent, RunningAgent } from '../types';

export const TEAMMATES: Teammate[] = [
  { id: 'riya', name: 'Riya', initial: 'R', color: '#E8B86A', role: 'you' },
  { id: 'manahil', name: 'Manahil', initial: 'M', color: '#8FBCB9', role: 'eng' },
  { id: 'huzaifa', name: 'Huzaifa', initial: 'H', color: '#C9A3E3', role: 'design' },
];

export const INITIAL_DECISIONS: Decision[] = [
  {
    id: 'd-01',
    title: 'Guest checkout stays — gated by one tap',
    body: 'Keep guest checkout for launch. A single "Continue as guest" tap required before the card form appears.',
    source: 'Linear › HR-412',
    sourceDetail: 'Pricing meeting · Oct 24',
    author: 'manahil',
    status: 'approved',
    createdAt: '2 days ago',
    retrievedBy: [
      { teammate: 'huzaifa', agent: 'Loom', at: '1d ago' },
    ],
    tags: ['checkout', 'auth'],
  },
  {
    id: 'd-02',
    title: 'Apple Pay first, Google Pay in v1.1',
    body: 'Launch ships with Apple Pay only. Google Pay deferred to v1.1 to avoid Android testing matrix blowup before Nov launch.',
    source: 'Slack › #hr-launch',
    sourceDetail: 'Thread from Huzaifa · Oct 25',
    author: 'huzaifa',
    status: 'approved',
    createdAt: '1 day ago',
    retrievedBy: [{ teammate: 'manahil', agent: 'Harbor', at: '18h ago' }],
    tags: ['payments'],
  },
];

export const PENDING_REVIEW: Decision[] = [];

export const INITIAL_EVENTS: AgentEvent[] = [
  {
    id: 'e-03',
    kind: 'retrieval',
    teammate: 'manahil',
    agentName: 'Harbor',
    text: 'retrieved "Guest checkout stays" while reviewing PR #1189.',
    decisionId: 'd-01',
    at: '6 hr ago',
  },
];

export const RUNNING_AGENTS: RunningAgent[] = [
  { id: 'ra-1', owner: 'riya', name: 'Scout', task: 'drafting checkout spec v4', state: 'writing' },
  { id: 'ra-2', owner: 'manahil', name: 'Harbor', task: 'reviewing PR #1189', state: 'thinking' },
  { id: 'ra-3', owner: 'huzaifa', name: 'Loom', task: 'generating form mock', state: 'idle' },
];

export const PROJECT = {
  id: 'happyrobots-checkout',
  client: 'HappyRobots',
  name: 'Checkout launch',
  repo: 'happyrobots/web',
  team: TEAMMATES,
};

export const DEMO_DECISION_SUGGESTIONS = [
  'Shipping address: default to billing on first order; secondary link to ship elsewhere',
  'Checkout CTA copy: "Place order" → "Confirm order" (per Riya + legal)',
  'Hard constraint: no third-party scripts on the /pay route (PCI)',
];
