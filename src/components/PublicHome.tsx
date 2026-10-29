import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HERO_IMAGE } from '../data/initialData';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Package,
  QrCode,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  EyeOff,
  UserCheck,
  CreditCard,
  Truck,
  Building,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

interface PublicHomeProps {
  onOpenPrivacyPolicy: () => void;
  onOpenFaq: () => void;
  onOpenBsImtGuide: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  onOpenPrivacyPolicy,
  onOpenFaq,
  onOpenBsImtGuide,
}) => {
  const { products, hubs, setActiveView, switchRole, addToCart } = useApp();
  const [selectedHubId, setSelectedHubId] = useState(hubs[0]?.id || 'hub-gulshan');
  const activeHub = hubs.find((h) => h.id === selectedHubId) || hubs[0];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide">
                <Lock className="w-3.5 h-3.5" />
                <span>CONFIDENTIAL LOGISTICS INFRASTRUCTURE</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">KARACHI PILOT</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
                Zero Home Address Exposure. <br />
                <span className="text-blue-600">Smart Automated Parcel Lockers.</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                SafeDrop PK eliminates the security and privacy risks of conventional doorstep delivery.
                Your residential address and personal phone number remain completely confidential from riders
                and third-party sellers. Pick up your orders 24/7 from secure automated lockers using a single-use 48-hour QR code.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView('shop')}
                  className="px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Explore Demo Shop</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    switchRole('customer');
                    setActiveView('dashboard');
                  }}
                  className="px-5 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  View Active Tracking
                </button>
                <button
                  onClick={onOpenBsImtGuide}
                  className="px-4 py-3 text-sm font-medium text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  BS IMT Guide (Roman Urdu)
                </button>
              </div>

              {/* Trust Indicators (Zero-Pill Unboxed Text with Separators) */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">Key Pillars:</span>
                <span>PII Privacy Decoupling</span>
                <span aria-hidden="true">·</span>
                <span>Automated Locker Mutex Allocation</span>
                <span aria-hidden="true">·</span>
                <span>Single-Use 48h Pickup QR</span>
                <span aria-hidden="true">·</span>
                <span>Simulated Dual Payment</span>
              </div>
            </div>

            {/* Right Column: Hero Locker Station Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 aspect-16/10">
                <img
                  src={HERO_IMAGE}
                  alt="Modern automated parcel locker station in urban Karachi"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white text-xs space-y-1">
                    <p className="font-bold text-sm">SafeDrop Pilot Terminal #01</p>
                    <p className="text-slate-300">Gulshan-e-Iqbal Central Hub · 24/7 Automated Touchscreen Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Privacy Firewall Comparison: Traditional vs SafeDrop PK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Architecture of Trust
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How SafeDrop Shields Your Personal Data
          </h2>
          <p className="text-sm text-slate-600">
            Comparing conventional Pakistani courier delivery against SafeDrop’s role-segregated locker protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Courier (Insecure) */}
          <div className="bg-red-50/50 border border-red-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Traditional Doorstep Courier Model</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span><strong>Exposed Phone Number:</strong> Rider calls multiple times, saves your number in personal WhatsApp, risking unsolicited contact.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span><strong>Exposed Home Address:</strong> House number, street, and floor printed on public manifest stickers visible to all handlers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span><strong>Schedule Interruption:</strong> Customer must stay home waiting for hours for courier arrival.</span>
              </li>
            </ul>
          </div>

          {/* SafeDrop PK (Secure) */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>SafeDrop Privacy Locker System</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span><strong>Zero PII Transmission:</strong> Riders and Sellers only receive Delivery ID, Hub address, and parcel dimensions. Phone & home address never leave secure user profile.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span><strong>Single-Use 48h Pickup QR:</strong> Compartment opens only via cryptographic single-use QR token valid for 48 hours post-deposit.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span><strong>Full 24/7 Autonomy:</strong> Customer collects parcel at their own convenience without coordinating with strangers.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. The 6-Step Fulfillment Workflow */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Step-by-Step Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How The Locker Network Operates
            </h2>
            <p className="text-sm text-slate-600">
              From checkout to compartment collection, every event is tracked and verified on the server.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Order & Hub Selection',
                desc: 'Customer chooses items and authorizes both a Primary Locker Hub and an Alternative Hub in Karachi.',
                icon: Package,
              },
              {
                step: '02',
                title: 'Seller Fulfillment',
                desc: 'Seller packs the shoes or clothing. Dispatches via scheduled Rider Pickup or drops off at an approved station.',
                icon: Building,
              },
              {
                step: '03',
                title: 'Transport to Hub',
                desc: 'Rider receives task with ZERO customer PII. Transports package directly to the customer-authorized locker hub.',
                icon: Truck,
              },
              {
                step: '04',
                title: 'Automated Compartment Deposit',
                desc: 'Locker compartment is reserved in real-time. Rider deposits parcel and confirms deposit; door locks securely.',
                icon: Lock,
              },
              {
                step: '05',
                title: 'Simulated Payment Verification',
                desc: 'If customer selected Pay After Deposit, payment is completed. Server confirms receipt and activates QR token.',
                icon: CreditCard,
              },
              {
                step: '06',
                title: 'QR Scan & Collection (48h)',
                desc: 'Customer scans single-use QR at locker terminal. Compartment door pops open. Token is consumed and expired.',
                icon: QrCode,
              },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    STEP {item.step}
                  </span>
                  <item.icon className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Karachi Locker Hub Network Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Terminal Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Karachi Smart Locker Terminals
            </h2>
            <p className="text-sm text-slate-600">
              Live capacity and compartment status across all pilot operational hubs.
            </p>
          </div>
          <button
            onClick={() => setActiveView('hubs')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Hub Grid</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hub Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {hubs.map((hub) => (
            <button
              key={hub.id}
              onClick={() => setSelectedHubId(hub.id)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                selectedHubId === hub.id
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-slate-900 truncate">{hub.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{hub.area}</div>
              <div className="mt-2 text-xs font-mono">
                <span className="font-semibold text-emerald-700 tabular-nums">
                  {hub.availableCompartments}
                </span>{' '}
                <span className="text-slate-400">/ {hub.totalCompartments} Free</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Hub Detail Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">{activeHub.name}</h3>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  {activeHub.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{activeHub.address}</p>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-4">
              <div>
                <span className="text-slate-400 block text-[10px]">OPERATING HOURS</span>
                <span className="font-semibold">{activeHub.operatingHours}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">TOTAL CAPACITY</span>
                <span className="font-semibold font-mono">{activeHub.totalCompartments} Lockers</span>
              </div>
            </div>
          </div>

          {/* Interactive Compartments Visualizer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Compartment Occupancy Grid</span>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Free / Ready
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" /> Parcel Deposited
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {activeHub.compartments.map((comp) => (
                <div
                  key={comp.id}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    comp.isOccupied
                      ? 'bg-amber-50/60 border-amber-300 text-amber-900'
                      : 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                  }`}
                >
                  <div className="text-xs font-mono font-bold">{comp.code}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{comp.size}</div>
                  <div className="text-[9px] font-semibold mt-1">
                    {comp.isOccupied ? 'Occupied' : 'Available'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Demo Product Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Demo Storefront
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Apparel & Footwear
            </h2>
          </div>
          <button
            onClick={() => setActiveView('shop')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col hover:border-slate-300 transition-all"
            >
              <div className="aspect-4/3 bg-slate-100 relative overflow-hidden">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 text-[10px] uppercase font-bold bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-slate-800">
                  {prod.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{prod.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold font-mono text-slate-900">
                    Rs. {prod.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      addToCart(prod, prod.sizes[0]);
                      setActiveView('shop');
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                  >
                    Select & Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Frequently Asked Questions Accordion Trigger */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Got Questions?
            </span>
            <h3 className="text-2xl font-bold tracking-tight">
              Everything You Need to Know About SafeDrop PK
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find answers on how the 48-hour pickup window works, what happens if both chosen hubs are full,
              how simulated fee allocations function, and how your privacy is protected by law.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onOpenFaq}
              className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Read Full FAQ</span>
            </button>
            <button
              onClick={onOpenPrivacyPolicy}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
