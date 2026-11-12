export type Teammate = {
  id: string;
  name: string;
  initial: string;
  color: string;
  role: string;
};

export type DecisionStatus = 'pending' | 'approved' | 'archived';

export type Decision = {
  id: string;
  title: string;
  body: string;
  source: string;
  sourceDetail?: string;
  author: string;
  status: DecisionStatus;
  createdAt: string;
  retrievedBy?: { teammate: string; agent: string; at: string }[];
  tags?: string[];
};

export type AgentEvent = {
  id: string;
  kind: 'retrieval' | 'update' | 'reasoning';
  teammate: string;
  agentName: string;
  text: string;
  decisionId?: string;
  at: string;
};

export type RunningAgent = {
  id: string;
  owner: string;
  name: string;
  task: string;
  state: 'thinking' | 'retrieving' | 'writing' | 'idle';
};
