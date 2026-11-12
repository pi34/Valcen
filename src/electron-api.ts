export type ElectronApi = {
  isElectron: true;
  openFullWindow: () => void;
  closeSidebar: () => void;
  quit: () => void;
  broadcast: (payload: unknown) => void;
  onBroadcast: (handler: (payload: any) => void) => () => void;
};

declare global {
  interface Window {
    context?: ElectronApi;
  }
}

export function getRoute(): 'sidebar' | 'full' | 'both' {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === 'sidebar') return 'sidebar';
  if (hash === 'full') return 'full';
  return 'both';
}

export const inElectron = () => Boolean(window.context?.isElectron);
