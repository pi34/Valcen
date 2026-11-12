import { createContext, useContext, useMemo, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Decision, AgentEvent, RunningAgent } from './types';
import {
  INITIAL_DECISIONS,
  PENDING_REVIEW,
  INITIAL_EVENTS,
  RUNNING_AGENTS,
} from './data/demoData';

type State = {
  sidebarOpen: boolean;
  fullWindowOpen: boolean;
  supermodeRecording: boolean;
  supermodeSummaryOpen: boolean;
  decisions: Decision[];
  pendingReview: Decision[];
  events: AgentEvent[];
  runningAgents: RunningAgent[];
  highlightDecisionId?: string;
  teamUpdateFlash?: string;
};

type Action =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'OPEN_SIDEBAR' }
  | { type: 'CLOSE_SIDEBAR' }
  | { type: 'OPEN_FULL' }
  | { type: 'CLOSE_FULL' }
  | { type: 'START_SUPERMODE' }
  | { type: 'STOP_SUPERMODE' }
  | { type: 'CLOSE_SUPERMODE_SUMMARY' }
  | { type: 'ADD_PENDING'; decision: Decision }
  | { type: 'APPROVE_DECISION'; id: string }
  | { type: 'DISCARD_DECISION'; id: string }
  | { type: 'ADD_EVENT'; event: AgentEvent }
  | { type: 'HIGHLIGHT'; id?: string }
  | { type: 'TEAM_UPDATE_FLASH'; text?: string }
  | { type: 'SET_AGENT_STATE'; id: string; state: RunningAgent['state'] };

const initialState: State = {
  sidebarOpen: true,
  fullWindowOpen: false,
  supermodeRecording: false,
  supermodeSummaryOpen: false,
  decisions: INITIAL_DECISIONS,
  pendingReview: PENDING_REVIEW,
  events: INITIAL_EVENTS,
  runningAgents: RUNNING_AGENTS,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'OPEN_SIDEBAR':
      return { ...state, sidebarOpen: true };
    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false };
    case 'OPEN_FULL':
      return { ...state, fullWindowOpen: true };
    case 'CLOSE_FULL':
      return { ...state, fullWindowOpen: false };
    case 'START_SUPERMODE':
      return { ...state, supermodeRecording: true };
    case 'STOP_SUPERMODE':
      return { ...state, supermodeRecording: false, supermodeSummaryOpen: true };
    case 'CLOSE_SUPERMODE_SUMMARY':
      return { ...state, supermodeSummaryOpen: false };
    case 'ADD_PENDING':
      return { ...state, pendingReview: [action.decision, ...state.pendingReview] };
    case 'APPROVE_DECISION': {
      const found = state.pendingReview.find((d) => d.id === action.id);
      if (!found) return state;
      const approved = { ...found, status: 'approved' as const, createdAt: 'just now' };
      return {
        ...state,
        pendingReview: state.pendingReview.filter((d) => d.id !== action.id),
        decisions: [approved, ...state.decisions],
      };
    }
    case 'DISCARD_DECISION':
      return {
        ...state,
        pendingReview: state.pendingReview.filter((d) => d.id !== action.id),
      };
    case 'ADD_EVENT':
      return { ...state, events: [action.event, ...state.events] };
    case 'HIGHLIGHT':
      return { ...state, highlightDecisionId: action.id };
    case 'TEAM_UPDATE_FLASH':
      return { ...state, teamUpdateFlash: action.text };
    case 'SET_AGENT_STATE':
      return {
        ...state,
        runningAgents: state.runningAgents.map((a) =>
          a.id === action.id ? { ...a, state: action.state } : a,
        ),
      };
    default:
      return state;
  }
}

type Ctx = State & {
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  openFull: () => void;
  closeFull: () => void;
  startSupermode: () => void;
  stopSupermode: () => void;
  closeSupermodeSummary: () => void;
  addPending: (d: Decision) => void;
  approveDecision: (id: string) => void;
  discardDecision: (id: string) => void;
  addEvent: (e: AgentEvent) => void;
  highlight: (id?: string) => void;
  flashTeamUpdate: (t?: string) => void;
  setAgentState: (id: string, s: RunningAgent['state']) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const openSidebar = useCallback(() => dispatch({ type: 'OPEN_SIDEBAR' }), []);
  const closeSidebar = useCallback(() => dispatch({ type: 'CLOSE_SIDEBAR' }), []);
  const openFull = useCallback(() => dispatch({ type: 'OPEN_FULL' }), []);
  const closeFull = useCallback(() => dispatch({ type: 'CLOSE_FULL' }), []);
  const startSupermode = useCallback(() => dispatch({ type: 'START_SUPERMODE' }), []);
  const stopSupermode = useCallback(() => dispatch({ type: 'STOP_SUPERMODE' }), []);
  const closeSupermodeSummary = useCallback(
    () => dispatch({ type: 'CLOSE_SUPERMODE_SUMMARY' }),
    [],
  );
  const addPending = useCallback(
    (d: Decision) => dispatch({ type: 'ADD_PENDING', decision: d }),
    [],
  );
  const approveDecision = useCallback(
    (id: string) => dispatch({ type: 'APPROVE_DECISION', id }),
    [],
  );
  const discardDecision = useCallback(
    (id: string) => dispatch({ type: 'DISCARD_DECISION', id }),
    [],
  );
  const addEvent = useCallback((e: AgentEvent) => dispatch({ type: 'ADD_EVENT', event: e }), []);
  const highlight = useCallback((id?: string) => dispatch({ type: 'HIGHLIGHT', id }), []);
  const flashTeamUpdate = useCallback(
    (text?: string) => dispatch({ type: 'TEAM_UPDATE_FLASH', text }),
    [],
  );
  const setAgentState = useCallback(
    (id: string, s: RunningAgent['state']) => dispatch({ type: 'SET_AGENT_STATE', id, state: s }),
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      toggleSidebar,
      openSidebar,
      closeSidebar,
      openFull,
      closeFull,
      startSupermode,
      stopSupermode,
      closeSupermodeSummary,
      addPending,
      approveDecision,
      discardDecision,
      addEvent,
      highlight,
      flashTeamUpdate,
      setAgentState,
    }),
    [
      state,
      toggleSidebar,
      openSidebar,
      closeSidebar,
      openFull,
      closeFull,
      startSupermode,
      stopSupermode,
      closeSupermodeSummary,
      addPending,
      approveDecision,
      discardDecision,
      addEvent,
      highlight,
      flashTeamUpdate,
      setAgentState,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
