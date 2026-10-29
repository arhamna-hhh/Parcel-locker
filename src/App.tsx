import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { DemoShop } from './components/DemoShop';
import { KarachiHubsView } from './components/KarachiHubsView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { RiderDashboard } from './components/RiderDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { QrScannerModal } from './components/QrScannerModal';
import { HardwareAdapterModal } from './components/HardwareAdapterModal';
import { BsImtGuideModal } from './components/BsImtGuideModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { FaqModal } from './components/FaqModal';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, currentUser, activeNotification, clearNotification } = useApp();

  // Modals state
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [scannerToken, setScannerToken] = useState<string>('');
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [isBsImtModalOpen, setIsBsImtModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  const handleOpenQrScanner = (token: string) => {
    setScannerToken(token);
    setIsQrScannerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        onOpenHardwareAdapter={() => setIsHardwareModalOpen(true)}
        onOpenBsImtGuide={() => setIsBsImtModalOpen(true)}
      />

      {/* Floating Notification Toast */}
      {activeNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-white border border-slate-200 rounded-xl shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-4 duration-200">
          {activeNotification.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          {activeNotification.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          {activeNotification.type === 'warning' && (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          {activeNotification.type === 'info' && (
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs space-y-0.5">
            <h4 className="font-bold text-slate-900">{activeNotification.title}</h4>
            <p className="text-slate-600 leading-relaxed">{activeNotification.message}</p>
          </div>

          <button
            onClick={clearNotification}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <PublicHome
            onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
            onOpenFaq={() => setIsFaqModalOpen(true)}
            onOpenBsImtGuide={() => setIsBsImtModalOpen(true)}
          />
        )}

        {activeView === 'shop' && <DemoShop />}

        {activeView === 'hubs' && <KarachiHubsView />}

        {activeView === 'dashboard' && (
          <>
            {currentUser.role === 'customer' && (
              <CustomerDashboard onOpenQrScanner={handleOpenQrScanner} />
            )}
            {currentUser.role === 'seller' && <SellerDashboard />}
            {currentUser.role === 'rider' && <RiderDashboard />}
            {currentUser.role === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Global Modals */}
      {isQrScannerOpen && (
        <QrScannerModal
          initialToken={scannerToken}
          onClose={() => setIsQrScannerOpen(false)}
        />
      )}

      {isHardwareModalOpen && (
        <HardwareAdapterModal onClose={() => setIsHardwareModalOpen(false)} />
      )}

      {isBsImtModalOpen && (
        <BsImtGuideModal onClose={() => setIsBsImtModalOpen(false)} />
      )}

      {isPrivacyModalOpen && (
        <PrivacyPolicyModal onClose={() => setIsPrivacyModalOpen(false)} />
      )}

      {isFaqModalOpen && (
        <FaqModal onClose={() => setIsFaqModalOpen(false)} />
      )}

      {/* Footer */}
      <Footer
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenFaq={() => setIsFaqModalOpen(true)}
        onOpenBsImtGuide={() => setIsBsImtModalOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
