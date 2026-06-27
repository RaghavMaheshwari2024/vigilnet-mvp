import { useState } from 'react';
import { LayoutProvider, useLayout } from './context/LayoutContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { Dashboard } from './pages/Dashboard';
import { NewTransaction } from './pages/NewTransaction';
import { Cases } from './pages/Cases';
import { StrReview } from './pages/StrReview';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { SplashEntry } from './components/dashboard/SplashEntry';

function MainContent() {
  const { activeTab } = useLayout();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashEntry onEnterWorkspace={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0C0F] text-[#E8EBF0] font-sans">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <TopNavbar />

        {/* Active View workspace */}
        {activeTab === 'Transactions' ? (
          <NewTransaction />
        ) : activeTab === 'Cases' || activeTab === 'Priority queue' ? (
          <Cases />
        ) : activeTab === 'STR / SAR' ? (
          <StrReview />
        ) : activeTab === 'Period reports' ? (
          <OfficerDashboard />
        ) : activeTab === 'Alerts' ? (
          <Dashboard />
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <LayoutProvider>
      <MainContent />
    </LayoutProvider>
  );
}

export default App;
