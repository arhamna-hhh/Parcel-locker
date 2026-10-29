import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, LockerHub } from '../types';
import {
  Truck,
  CheckCircle2,
  MapPin,
  Lock,
  Box,
  Building,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Clock,
  Compass,
} from 'lucide-react';

export const RiderDashboard: React.FC = () => {
  const { currentUser, orders, hubs, riderAcceptTask, riderDepositParcel } = useApp();

  const [selectedTaskOrderId, setSelectedTaskOrderId] = useState<string>('');
  const [selectedHubId, setSelectedHubId] = useState<string>('');
  const [selectedCompSize, setSelectedCompSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Tasks needing pickup or in transit
  const availableTasks = orders.filter(
    (o) => o.status === 'READY_FOR_DISPATCH' || o.status === 'AWAITING_RIDER'
  );
  const myActiveDeliveries = orders.filter(
    (o) => o.riderId === currentUser.uid && o.status === 'IN_TRANSIT'
  );
  const myCompletedDeposits = orders.filter(
    (o) =>
      o.riderId === currentUser.uid &&
      (o.status === 'PARCEL_DEPOSITED' ||
        o.status === 'PAYMENT_PENDING' ||
        o.status === 'READY_FOR_PICKUP' ||
        o.status === 'COLLECTED')
  );

  const activeTask =
    myActiveDeliveries.find((o) => o.id === selectedTaskOrderId) ||
    myActiveDeliveries[0] ||
    availableTasks[0];

  const targetHub =
    hubs.find((h) => h.id === selectedHubId) ||
    hubs.find((h) => h.id === activeTask?.primaryHubId) ||
    hubs[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Rider Header & Zero PII Assurance */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
              Rider Fleet Console
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Mobile-First Courier Dispatch</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            {currentUser.displayName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Zero Customer Phone Numbers or Home Addresses Exposed. Deliver directly to automated smart locker hubs.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="text-blue-900">
            <span className="font-bold block">SafeDrop PII Masking Protocol</span>
            <span className="text-[11px] text-blue-800/80">
              Only delivery ID, authorized locker hub, and package size are transmitted.
            </span>
          </div>
        </div>
      </div>

      {/* Rider Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Available Tasks</span>
            <Box className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-2">
            {availableTasks.length}
          </div>
          <span className="text-xs text-slate-500">Awaiting courier pickup</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">In Custody / Transit</span>
            <Truck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-purple-700 mt-2">
            {myActiveDeliveries.length}
          </div>
          <span className="text-xs text-slate-500">En route to locker hubs</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Deposited Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-700 mt-2">
            {myCompletedDeposits.length}
          </div>
          <span className="text-xs text-slate-500">Lockers successfully loaded</span>
        </div>
      </div>

      {/* Main Delivery Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Tasks List */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Deliveries */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-600" />
              <span>Parcels in Your Custody ({myActiveDeliveries.length})</span>
            </h2>

            {myActiveDeliveries.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500">
                You have no parcels in transit right now. Accept a task below!
              </div>
            ) : (
              <div className="space-y-3">
                {myActiveDeliveries.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => {
                      setSelectedTaskOrderId(ord.id);
                      setSelectedHubId(ord.primaryHubId);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      activeTask?.id === ord.id
                        ? 'border-purple-600 bg-purple-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        Order #{ord.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        IN TRANSIT
                      </span>
                    </div>

                    <div className="pt-2 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>Target: {ord.primaryHubName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pl-5">
                        Backup: {ord.alternativeHubName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Pickup Tasks */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Box className="w-4 h-4 text-blue-600" />
              <span>Available Tasks for Collection ({availableTasks.length})</span>
            </h2>

            {availableTasks.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500">
                All seller parcels have been picked up. Great job!
              </div>
            ) : (
              <div className="space-y-3">
                {availableTasks.map((ord) => (
                  <div key={ord.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        Order #{ord.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {ord.dispatchMethod === 'SELLER_DROPOFF' ? 'Drop-off Station' : 'Seller Pickup'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600">
                      <div>
                        <strong>Pickup Point:</strong> {ord.sellerName} (Warehouse / Depot)
                      </div>
                      <div>
                        <strong>Destination Hub:</strong> {ord.primaryHubName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Package: {ord.items.map((i) => i.productName).join(', ')}
                      </div>
                    </div>

                    <button
                      onClick={() => riderAcceptTask(ord.id)}
                      className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Accept Task & Collect Parcel</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Hub Navigation & Deposit Workflow */}
        <div className="lg:col-span-6 space-y-6">
          {activeTask && activeTask.status === 'IN_TRANSIT' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-mono text-purple-600 uppercase font-bold">
                  ACTIVE DELIVERY IN PROGRESS
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Deposit Order #{activeTask.id} into Locker
                </h3>
              </div>

              {/* Zero-PII Manifest Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                <span className="font-semibold text-slate-700 uppercase text-[10px]">
                  Rider Manifest Details (Privacy Guaranteed)
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Customer Name:</span>
                    <strong className="text-slate-800">{activeTask.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone & Address:</span>
                    <strong className="text-emerald-700 font-mono">[PROTECTED - NONE]</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Primary Authorized Hub:</span>
                    <span className="text-slate-800">{activeTask.primaryHubName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Authorized Alternative:</span>
                    <span className="text-slate-800">{activeTask.alternativeHubName}</span>
                  </div>
                </div>
              </div>

              {/* Target Hub & Real-Time Capacity Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  Select Locker Hub for Deposit:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Option 1: Primary Hub */}
                  {hubs
                    .filter((h) => h.id === activeTask.primaryHubId || h.id === activeTask.alternativeHubId)
                    .map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedHubId(h.id)}
                        className={`p-3 text-left rounded-xl border text-xs transition-all ${
                          targetHub.id === h.id
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold text-slate-900 truncate">{h.name}</div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {h.id === activeTask.primaryHubId ? 'Primary Choice' : 'Authorized Backup'}
                        </div>
                        <div className="text-xs font-mono font-semibold text-emerald-700 mt-1">
                          {h.availableCompartments} compartments free
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Compartment Size Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  Select Parcel Compartment Size:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['small', 'medium', 'large'] as const).map((size) => {
                    const freeCount = targetHub.compartments.filter(
                      (c) => c.size === size && !c.isOccupied
                    ).length;
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={freeCount === 0}
                        onClick={() => setSelectedCompSize(size)}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          selectedCompSize === size
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                            : freeCount === 0
                            ? 'opacity-40 border-slate-200 bg-slate-100 cursor-not-allowed'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="capitalize">{size}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {freeCount} Free
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Confirm Locker Deposit Action */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => riderDepositParcel(activeTask.id, targetHub.id, selectedCompSize)}
                  className="w-full py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Lock className="w-4 h-4" />
                  <span>Reserve & Deposit in {targetHub.name}</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  Door will lock automatically. System assigns compartment, logs timestamp, and activates customer notification.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
              <Compass className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-xs font-bold text-slate-800">No Active Parcel in Transit</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Accept one of the available pickup tasks on the left to begin the route to the automated locker hub.
              </p>
            </div>
          )}

          {/* Completed Deposits History */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recent Completed Locker Drops ({myCompletedDeposits.length})
            </h3>
            {myCompletedDeposits.length === 0 ? (
              <p className="text-xs text-slate-400">No deposits recorded yet today.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {myCompletedDeposits.slice(0, 4).map((d) => (
                  <div key={d.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900 block">
                        Order #{d.id}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {d.assignedHubName} · Compartment [{d.compartmentCode || 'Locker'}]
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      DEPOSITED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
