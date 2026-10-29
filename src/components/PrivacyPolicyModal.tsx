import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              SafeDrop PK Privacy Policy & PII Decoupling Charter
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold text-sm">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">1. Zero-Exposure Principle</h4>
            <p>
              SafeDrop PK was architected to protect consumers from identity exposure and harassment.
              Delivery riders, transport contractors, and third-party merchants are never provided customer
              home addresses, apartment numbers, or telephone contact information for locker deliveries.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">2. What Data Is Shared</h4>
            <p>
              When an order is created, the system generates a sanitary manifest containing strictly:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>SafeDrop Delivery ID (e.g. <code>SD-8492</code>)</li>
              <li>Customer First Name only for package verification</li>
              <li>Authorized Locker Hub station name and terminal address</li>
              <li>Parcel volumetric size class (Small, Medium, or Large)</li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">3. Cryptographic Single-Use QR Tokens</h4>
            <p>
              Pickup QR tokens are cryptographically randomized, server-validated, and valid for exactly 48 hours.
              Once scanned at the terminal, the token is permanently invalidated (burned) to prevent replay attacks.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">4. Simulated Financial Data</h4>
            <p>
              In accordance with academic testing protocols, all payment transactions, wallet balances, and fee allocations
              are demonstrations. No real credit card numbers or bank credentials are ever requested or stored.
            </p>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
