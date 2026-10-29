import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Lock, CheckCircle2, Clock, ShieldCheck, Building } from 'lucide-react';

export const KarachiHubsView: React.FC = () => {
  const { hubs, setActiveView } = useApp();
  const [selectedHubId, setSelectedHubId] = useState(hubs[0]?.id || '');
  const activeHub = hubs.find((h) => h.id === selectedHubId) || hubs[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Network Topology
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Karachi Automated Locker Hubs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status, address directions, and live compartment availability across our pilot terminal network.
          </p>
        </div>

        <button
          onClick={() => setActiveView('shop')}
          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors self-start md:self-auto"
        >
          Select Hub at Checkout
        </button>
      </div>

      {/* Hub Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hubs.map((hub) => (
          <div
            key={hub.id}
            onClick={() => setSelectedHubId(hub.id)}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeHub.id === hub.id
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 truncate">{hub.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {hub.status.toUpperCase()}
              </span>
            </div>

            <div className="pt-3 space-y-2 text-xs text-slate-600">
              <p className="text-[11px] text-slate-500 line-clamp-2">{hub.address}</p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 font-semibold">FREE COMPARTMENTS</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {hub.availableCompartments} / {hub.totalCompartments}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Interactive Hub Terminal Viewer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">{activeHub.name}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">{activeHub.address}</p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">HOURS</span>
              <span className="font-semibold text-slate-800">{activeHub.operatingHours}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">AREA</span>
              <span className="font-semibold text-slate-800">{activeHub.area}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">AVAILABILITY</span>
              <span className="font-mono font-bold text-emerald-600">
                {activeHub.availableCompartments} Free Lockers
              </span>
            </div>
          </div>
        </div>

        {/* Compartment Door Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Terminal Compartment Architecture
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Ready for Parcel
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Occupied / Holding
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {activeHub.compartments.map((comp) => (
              <div
                key={comp.id}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  comp.isOccupied
                    ? 'border-amber-300 bg-amber-50/70 text-amber-900'
                    : 'border-emerald-300 bg-emerald-50/70 text-emerald-900'
                }`}
              >
                <div className="font-mono font-bold text-base">{comp.code}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                  Size: {comp.size}
                </div>
                <div className="mt-2 text-[10px] font-bold">
                  {comp.isOccupied ? 'Locked (Holding)' : 'Empty / Ready'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
