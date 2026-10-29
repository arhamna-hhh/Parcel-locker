import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqModalProps {
  onClose: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ onClose }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the 48-hour pickup expiration rule work?',
      a: 'Once a parcel is deposited into a locker compartment by the rider, a 48-hour countdown timer begins. The customer receives an in-app notification and email with their single-use QR code. If the parcel is not picked up within 48 hours, the QR code automatically deactivates to prevent locker hoarding, and the order is escalated to the Admin control tower for investigation. SafeDrop never returns parcels automatically without an authorized review.',
    },
    {
      q: 'What happens if my primary chosen locker hub is full?',
      a: 'During checkout, you explicitly authorize both a Primary Hub and an Alternative Backup Hub. If the primary hub has zero free compartments of your parcel size upon rider arrival, the server automatically routes the rider to your authorized alternative hub and immediately updates your tracking status.',
    },
    {
      q: 'How does the Pay After Locker Deposit timing option work?',
      a: 'SafeDrop gives you full control. If you choose "Pay After Deposit", no simulated funds are charged at order placement. You are notified the moment the parcel is locked inside the hub. You then complete simulated payment in your dashboard, which immediately activates your single-use pickup QR code.',
    },
    {
      q: 'Does the delivery rider see my home address or personal phone number?',
      a: 'Never. For all locker deliveries, the rider receives only the order tracking ID, the destination locker terminal address, and the package size. All direct communication is handled securely in-app without revealing private telephone numbers.',
    },
    {
      q: 'How are delivery and locker fees distributed?',
      a: 'SafeDrop demonstrates a transparent triple-split accounting ledger: For a Rs. 690 order, the Seller receives Rs. 600 for the product, the Fleet Courier receives Rs. 30, and the Smart Locker Operator receives Rs. 60. In this demonstration, all balances are simulated.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Frequently Asked Questions (FAQ)
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold text-sm">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50"
              >
                <span>{faq.q}</span>
                {openIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {openIndex === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Close FAQ
          </button>
        </div>
      </div>
    </div>
  );
};
