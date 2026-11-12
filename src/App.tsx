import { StoreProvider } from './store';
import { Sidebar } from './components/Sidebar';
import { FullWindow } from './components/FullWindow';
import { SupermodeSummary } from './components/Supermode';
import { GuideBar } from './components/GuideBar';
import { IntroOverlay } from './components/IntroOverlay';
import { DemoScript } from './components/DemoScript';
import { FloatingDock } from './components/FloatingDock';
import { getRoute, inElectron } from './electron-api';
import { FullWindowStandalone } from './components/FullWindowStandalone';

function App() {
  const route = getRoute();
  const electron = inElectron();

  // Electron sidebar window — just the sidebar fills the window
  if (route === 'sidebar') {
    return (
      <StoreProvider>
        <div
          className="h-screen w-screen relative overflow-hidden select-none"
          style={{ background: 'transparent' }}
        >
          <Sidebar asWindow />
          <SupermodeSummary />
          <GuideBar />
          <IntroOverlay />
        </div>
      </StoreProvider>
    );
  }

  // Electron full window — standalone project memory
  if (route === 'full') {
    return (
      <StoreProvider>
        <div
          className="h-screen w-screen relative overflow-hidden select-none"
          style={{ background: '#0A0A0C' }}
        >
          <FullWindowStandalone />
        </div>
      </StoreProvider>
    );
  }

  // Browser default — clean investor stage: dark backdrop + sidebar + demo director
  return (
    <StoreProvider>
      <div
        className="h-screen w-screen relative overflow-hidden select-none"
        style={{
          background:
            'radial-gradient(1200px 700px at 72% 22%, rgba(232,184,106,0.09) 0%, transparent 60%),' +
            'radial-gradient(900px 600px at 20% 85%, rgba(201,163,227,0.07) 0%, transparent 60%),' +
            'linear-gradient(180deg, #08080B 0%, #0A0A0C 100%)',
        }}
      >
        {!electron && <Backdrop />}
        <Sidebar />
        <FloatingDock />
        <FullWindow />
        <SupermodeSummary />
        <DemoScript />
      </div>
    </StoreProvider>
  );
}

function Backdrop() {
  return (
    <>
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at 60% 40%, black 30%, transparent 75%)',
        }}
      />

      {/* Valcen brand mark top-left */}
      <div className="absolute top-6 left-6 flex items-center gap-2.5 z-[20]">
        <ValcenGlyph size={22} />
        <div className="font-display text-[24px] text-white/95 leading-none">
          Valcen
        </div>
      </div>
    </>
  );
}

function ValcenGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <defs>
        <linearGradient id="vg" x1="0" y1="0" x2="20" y2="20">
          <stop offset="0" stopColor="#E8B86A" />
          <stop offset="1" stopColor="#C9A3E3" />
        </linearGradient>
      </defs>
      <path
        d="M4 3L10 17L16 3"
        stroke="url(#vg)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default App;
