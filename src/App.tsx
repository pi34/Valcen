import { StoreProvider } from './store';
import { Desktop } from './components/Desktop';
import { MenuBar } from './components/MenuBar';
import { Sidebar } from './components/Sidebar';
import { FullWindow } from './components/FullWindow';
import { SupermodeSummary } from './components/Supermode';
import { GuideBar } from './components/GuideBar';
import { IntroOverlay } from './components/IntroOverlay';
import { RetrievalMoment } from './components/RetrievalMoment';
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
          <RetrievalMoment />
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

  // Browser default — full fake desktop with sidebar overlay
  return (
    <StoreProvider>
      <div className="h-screen w-screen relative overflow-hidden select-none">
        {!electron && <Desktop />}
        {!electron && <MenuBar />}
        <Sidebar />
        <FullWindow />
        <SupermodeSummary />
        <GuideBar />
        <IntroOverlay />
        <RetrievalMoment />
      </div>
    </StoreProvider>
  );
}

export default App;
