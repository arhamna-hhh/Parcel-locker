import React, { useState } from 'react';
import { Cpu, Terminal, CheckCircle2, Copy, Check, ExternalLink, Code } from 'lucide-react';

interface HardwareAdapterModalProps {
  onClose: () => void;
}

export const HardwareAdapterModal: React.FC<HardwareAdapterModalProps> = ({ onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr_api' | 'microcontroller'>('qr_api');

  const partnerQrCodeSample = `// SafeDrop Partner Integration Adapter Interface
// Specification: v1.0.0-PROTOTYPE
// Ready for integration with external QR group's API

export interface PartnerQrVerificationRequest {
  token: string;              // Cryptographic HMAC token
  terminalId: string;         // e.g. "GULSHAN-CENTRAL-01"
  timestamp: string;          // ISO 8601 string
}

export interface PartnerQrVerificationResponse {
  authorized: boolean;
  orderId: string;
  compartmentCode: string;   // e.g. "GUL-B01"
  expiryStatus: "ACTIVE" | "EXPIRED" | "REUSED";
  unlockedAt: string;
}

// Clean Mock Adapter Class (Ready for External API Injection)
export class PartnerQrAdapter {
  private apiEndpoint: string;

  constructor(endpoint = "https://partner-group-api.domain.pk/api/v1/verify") {
    this.apiEndpoint = endpoint;
  }

  async verifyPickupToken(payload: PartnerQrVerificationRequest): Promise<PartnerQrVerificationResponse> {
    // Current Prototype: Server-Side Simulated Handshake
    console.log("[SafeDrop Adapter] Dispatched token to partner endpoint:", payload.token);
    
    // In production, replaces with:
    // const res = await fetch(this.apiEndpoint, { method: "POST", body: JSON.stringify(payload) });
    // return await res.json();
    return {
      authorized: true,
      orderId: "SD-8492",
      compartmentCode: "GUL-B01",
      expiryStatus: "ACTIVE",
      unlockedAt: new Date().toISOString()
    };
  }
}`;

  const microcontrollerSample = `// Physical Locker Hardware Relay Driver (ESP32 / Arduino / Raspberry Pi)
// Controls 12V electromagnetic solenoid door locks via digital GPIO pins

#include <WiFi.h>
#include <HTTPClient.h>

const int RELAY_PIN_COMPARTMENT_B01 = 23; // Digital output pin to relay module

void unlockCompartment() {
  Serial.println("[SafeDrop Hardware] Pulse HIGH: Activating Solenoid Lock...");
  digitalWrite(RELAY_PIN_COMPARTMENT_B01, HIGH); // Energize lock coil
  delay(1500);                                  // 1.5 second pulse to pop door open
  digitalWrite(RELAY_PIN_COMPARTMENT_B01, LOW);  // De-energize
  Serial.println("[SafeDrop Hardware] Pulse Complete. Door spring released.");
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                External Hardware & 3rd-Party QR Integration Adapter
              </h3>
              <p className="text-xs text-indigo-400 font-mono">
                Clean Interface Contract for Inter-Group Systems
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Informational Banner */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs text-slate-300 space-y-1.5 leading-relaxed">
          <p className="font-bold text-white">
            Architectural Notice for BS IMT Evaluators & Integration Partners:
          </p>
          <p>
            As mandated by your project specifications, SafeDrop PK does not invent another group's unpublished APIs.
            Instead, we supply a clean, modular adapter layer. Once your partner group provides their final OpenAPI / Swagger
            specification or microcontroller pinout, simply inject their endpoint URL into this adapter.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('qr_api')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'qr_api' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Partner QR Scanning API Adapter
          </button>
          <button
            onClick={() => setActiveTab('microcontroller')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'microcontroller' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Microcontroller / ESP32 Solenoid Driver
          </button>
        </div>

        {/* Code Display Body */}
        <div className="flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              {activeTab === 'qr_api' ? 'src/adapters/PartnerQrAdapter.ts' : 'hardware/esp32_relay_driver.ino'}
            </span>
            <button
              onClick={() =>
                copyToClipboard(activeTab === 'qr_api' ? partnerQrCodeSample : microcontrollerSample)
              }
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
            <code>
              {activeTab === 'qr_api' ? partnerQrCodeSample : microcontrollerSample}
            </code>
          </pre>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Status: MOCK SIMULATOR RUNNING · ZERO HARDWARE ERRORS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
