import React from 'react';
import { ShieldCheck, MapPin, Lock, FileText, HelpCircle } from 'lucide-react';

interface FooterProps {
  onOpenPrivacyPolicy: () => void;
  onOpenFaq: () => void;
  onOpenBsImtGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacyPolicy,
  onOpenFaq,
  onOpenBsImtGuide,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Overview */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                SafeDrop PK
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              An automated, privacy-first parcel locker network designed for Pakistani e-commerce.
              Eliminates the exposure of customer residential addresses and phone numbers to riders and merchants
              through secure physical locker terminals in Karachi.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300 pt-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full PII Privacy Decoupling · Single-Use 48h Pickup QR</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Governance & Policies
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={onOpenPrivacyPolicy}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Privacy Policy & PII Protection</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFaq}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>Frequently Asked Questions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBsImtGuide}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors text-left font-medium"
                >
                  BS IMT Project Reference & Roman Urdu Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Pilot Hubs in Karachi */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Karachi Pilot Hubs</span>
            </h4>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Gulshan-e-Iqbal Central Hub (Block 13-D)</li>
              <li>• Clifton Marine Drive Hub (Phase 5)</li>
              <li>• PECHS Commercial Terminal (Block 2)</li>
              <li>• North Nazimabad Metro Hub (Block H)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Notice */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4">
          <p>
            © {new Date().getFullYear()} SafeDrop PK. Academic Capstone Project for BS Industrial Management & Technology.
          </p>
          <p className="text-slate-300 text-[11px] bg-slate-800/80 px-3 py-1 rounded border border-slate-700">
            Simulated Demonstration Environment · No Real Financial Transactions
          </p>
        </div>
      </div>
    </footer>
  );
};
