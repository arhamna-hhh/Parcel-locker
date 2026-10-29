import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Database, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface BsImtGuideModalProps {
  onClose: () => void;
}

export const BsImtGuideModal: React.FC<BsImtGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-indigo-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                BS Industrial Management & Technology (BS IMT) Defense Reference
              </h2>
              <p className="text-xs text-indigo-700 font-medium">
                Simple English & Roman Urdu Technical Explanations for Academic Presentation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold text-sm px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 text-xs leading-relaxed text-slate-700">
          {/* Section 1: Project Objective */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>1. Project Core Objective & Problem Statement</span>
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <p>
                <strong>In English:</strong> Conventional e-commerce delivery in Pakistan relies heavily on doorstep courier riders.
                This exposes the customer's phone number, residential address, family movement routines, and lifestyle to third-party riders
                and marketplace sellers. SafeDrop PK introduces <em>Automated Smart Parcel Lockers</em> in public Karachi hubs
                (Gulshan, Clifton, PECHS, Nazimabad), achieving <strong>Zero PII Exposure</strong>.
              </p>
              <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-100 text-indigo-950">
                <strong>Roman Urdu Mein Wazaahat (Simple Explanation):</strong><br />
                Pakistan mein aam delivery boys aur sellers ko customer ka mobile number aur ghar ka mukammal pata mil jata hai,
                jis se privacy aur hifazat (safety) ke masayel paida hote hain. SafeDrop system mein delivery boy ya seller ko customer
                ka phone number ya ghar ka pata bilkul nahi milta. Rider sirf parcel ko Karachi ke automated smart locker hub mein deposit karta hai,
                aur customer apne digital single-use QR code ke zariye apni marzi ke waqt parcel collect kar leta hai.
              </div>
            </div>
          </div>

          {/* Section 2: Industrial Management Concepts Applied */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>2. Key Industrial Management & Technology (IMT) Concepts</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
                <span className="font-bold text-slate-900 block">A. Last-Mile Logistics Optimization</span>
                <p className="text-slate-600 text-[11px]">
                  Traditional doorstep courier visits have a 18-25% first-attempt delivery failure rate because customers are not home.
                  Consolidating drops into smart locker hubs lowers vehicle mileage, fuel consumption, and urban carbon emissions.
                </p>
                <p className="text-indigo-900 text-[11px] italic bg-indigo-50/50 p-2 rounded mt-1">
                  <strong>Urdu:</strong> Rider ko har ghar jane ki zaroorat nahi padti. Ek hi hub par 10 parcels drop ho jate hain,
                  jis se waqt aur petrol dono bachtay hain.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
                <span className="font-bold text-slate-900 block">B. Automated Locker Allocation & Mutex</span>
                <p className="text-slate-600 text-[11px]">
                  The system prevents "double booking" of compartments. If Hub A is 100% full, the server automatically routes
                  to the Customer's pre-authorized Alternative Backup Hub without manual re-entry.
                </p>
                <p className="text-indigo-900 text-[11px] italic bg-indigo-50/50 p-2 rounded mt-1">
                  <strong>Urdu:</strong> Agar Gulshan hub full ho, to system khud customer ke manzoor shuda PECHS hub ko select kar leta hai.
                  Kisi dabba (compartment) mein do parcels ek sath deposit nahi ho saktay.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
                <span className="font-bold text-slate-900 block">C. Role-Based Access Control (RBAC)</span>
                <p className="text-slate-600 text-[11px]">
                  Four strict security roles: Customer, Seller, Rider, and Admin. Neither the Seller nor the Rider has database
                  permission to query customer PII or activate the pickup QR code.
                </p>
                <p className="text-indigo-900 text-[11px] italic bg-indigo-50/50 p-2 rounded mt-1">
                  <strong>Urdu:</strong> Har role ke apne makhsoos ikhtiyaraat hain. Rider ya Seller kisi halat mein customer ka data ya QR code hack nahi kar saktay.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
                <span className="font-bold text-slate-900 block">D. 48-Hour Pickup Expiration Watchdog</span>
                <p className="text-slate-600 text-[11px]">
                  Parcels can only occupy a compartment for 48 hours. If unclaimed, the QR code expires and an Admin exception task is triggered.
                  Parcels are never returned automatically without human review.
                </p>
                <p className="text-indigo-900 text-[11px] italic bg-indigo-50/50 p-2 rounded mt-1">
                  <strong>Urdu:</strong> 48 ghante ke baad QR code expire ho jata hai taake locker block na rahay, aur Admin faisla karta hai ke customer ko mazeed time dena hai ya return karna hai.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Technical Architecture & Firebase */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>3. Cloud Database & Architecture Defense</span>
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <p>
                <strong>Cloud Firestore Security:</strong> We configured <code>firebase-blueprint.json</code> and deployed
                hardened <code>firestore.rules</code> enforcing Attribute-Based Access Control (ABAC). PII is isolated from
                the order manifest. All payments (Demo Card / Demo Wallet) and financial splits (Seller Rs. 600, Courier Rs. 30, Locker Rs. 60)
                are strictly simulated demonstrations.
              </p>
              <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 text-emerald-950">
                <strong>Viva / Defense Tips:</strong> Jab professors poochein ke payments real hain ya nahi, to saf bataiye ke:
                <em>"Payments proof-of-concept simulation hain jo Pakistani banking system ki accounting breakdown ko model karti hain.
                Real cards ki zaroorat nahi hai taake customer ka financial data mehfooz rahay."</em>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Prepared for BS Industrial Management & Technology Final Defense
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
