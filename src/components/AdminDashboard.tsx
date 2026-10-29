import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LockerHub, SupportTicket } from '../types';
import {
  ShieldAlert,
  Building,
  Package,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileText,
  DollarSign,
  TrendingUp,
  Sliders,
  Lock,
  Compass,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    hubs,
    toggleHubStatus,
    tickets,
    updateTicketStatus,
    updateOrderStatus,
    auditLogs,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'lockers' | 'returns' | 'exceptions' | 'audit'>('overview');
  const [selectedHubId, setSelectedHubId] = useState<string>(hubs[0]?.id || '');
  const [adminNotesInput, setAdminNotesInput] = useState('');

  // Statistics
  const totalOrders = orders.length;
  const activeDeliveries = orders.filter(
    (o) => o.status === 'IN_TRANSIT' || o.status === 'READY_FOR_DISPATCH' || o.status === 'AWAITING_RIDER'
  ).length;
  const readyPickupCount = orders.filter((o) => o.status === 'READY_FOR_PICKUP').length;
  const expiredPickupCount = orders.filter((o) => o.status === 'EXPIRED_PICKUP').length;
  const returnRequestsCount = orders.filter((o) => o.status === 'RETURN_REQUESTED').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'OPEN' || t.status === 'INVESTIGATING').length;

  const totalCapacity = hubs.reduce((sum, h) => sum + h.totalCompartments, 0);
  const totalAvailable = hubs.reduce((sum, h) => sum + h.availableCompartments, 0);
  const occupiedCompartments = totalCapacity - totalAvailable;
  const utilizationRate = totalCapacity > 0 ? Math.round((occupiedCompartments / totalCapacity) * 100) : 0;

  // Financial allocations (Simulated demonstration ledger)
  const totalVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalSellerAlloc = orders.filter((o) => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.itemPrice, 0);
  const totalCourierAlloc = orders.filter((o) => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.deliveryFee, 0);
  const totalLockerAlloc = orders.filter((o) => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.lockerFee, 0);

  const activeHub = hubs.find((h) => h.id === selectedHubId) || hubs[0];
  const expiredOrders = orders.filter((o) => o.status === 'EXPIRED_PICKUP');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded uppercase">
              Control Tower & System Admin
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Logistics Operations Oversight</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            SafeDrop Karachi Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time locker occupancy, return authorizations, 48h expiry resolution, and simulated accounting.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('lockers')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              activeTab === 'lockers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Locker Network ({hubs.length})
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              activeTab === 'returns' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Returns & Complaints ({openTicketsCount})
          </button>
          <button
            onClick={() => setActiveTab('exceptions')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              activeTab === 'exceptions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            48h Expiry Holds ({expiredOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit & Ledger
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            TOTAL ORDERS
          </span>
          <div className="text-xl font-extrabold font-mono text-slate-900 mt-1">{totalOrders}</div>
          <span className="text-[11px] text-slate-500">Across Karachi</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            ACTIVE EN ROUTE
          </span>
          <div className="text-xl font-extrabold font-mono text-blue-600 mt-1">{activeDeliveries}</div>
          <span className="text-[11px] text-slate-500">With fleet riders</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            READY FOR PICKUP
          </span>
          <div className="text-xl font-extrabold font-mono text-emerald-600 mt-1">{readyPickupCount}</div>
          <span className="text-[11px] text-slate-500">Active QR codes</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            LOCKER OCCUPANCY
          </span>
          <div className="text-xl font-extrabold font-mono text-indigo-600 mt-1">
            {utilizationRate}%
          </div>
          <span className="text-[11px] text-slate-500">
            {occupiedCompartments} / {totalCapacity} filled
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            OPEN TICKETS
          </span>
          <div className="text-xl font-extrabold font-mono text-amber-600 mt-1">{openTicketsCount}</div>
          <span className="text-[11px] text-slate-500">Returns & claims</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            EXPIRED PICKUPS
          </span>
          <div className="text-xl font-extrabold font-mono text-red-600 mt-1">{expiredPickupCount}</div>
          <span className="text-[11px] text-slate-500">48h window passed</span>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Live Karachi Hub Status Summary */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Karachi Terminal Operations
              </h2>
              <span className="text-xs text-slate-400 font-mono">4 Pilot Stations</span>
            </div>

            <div className="space-y-3">
              {hubs.map((hub) => (
                <div key={hub.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{hub.name}</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                        {hub.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{hub.area} · {hub.operatingHours}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {hub.availableCompartments} / {hub.totalCompartments} Free
                    </span>
                    <div className="w-24 bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{
                          width: `${Math.round(((hub.totalCompartments - hub.availableCompartments) / hub.totalCompartments) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Simulated Financial Allocations Breakdown */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Simulated Revenue Allocations (PKR)
              </h2>
              <p className="text-[11px] text-slate-400">
                Triple-split accounting demonstrator for academic presentation.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 block">Seller Item Share:</span>
                  <span className="text-[10px] text-blue-700">Cost of clothes & shoes</span>
                </div>
                <span className="font-mono font-bold text-sm text-blue-900">
                  Rs. {totalSellerAlloc.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-900 block">Fleet Delivery Fees:</span>
                  <span className="text-[10px] text-indigo-700">Rs. 30 per delivery route</span>
                </div>
                <span className="font-mono font-bold text-sm text-indigo-900">
                  Rs. {totalCourierAlloc.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 block">Locker Terminal Fees:</span>
                  <span className="text-[10px] text-emerald-700">Rs. 60 per compartment usage</span>
                </div>
                <span className="font-mono font-bold text-sm text-emerald-900">
                  Rs. {totalLockerAlloc.toLocaleString()}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-bold text-slate-900">
                <span>Total Settled Volume:</span>
                <span className="font-mono">
                  Rs. {(totalSellerAlloc + totalCourierAlloc + totalLockerAlloc).toLocaleString()} PKR
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Locker Network Management */}
      {activeTab === 'lockers' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {hubs.map((hub) => (
              <button
                key={hub.id}
                onClick={() => setSelectedHubId(hub.id)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                  activeHub.id === hub.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {hub.name}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{activeHub.name}</h3>
                <p className="text-xs text-slate-500">{activeHub.address}</p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-500">Terminal Mode:</span>
                <button
                  onClick={() =>
                    toggleHubStatus(
                      activeHub.id,
                      activeHub.status === 'online' ? 'maintenance' : 'online'
                    )
                  }
                  className={`px-3 py-1 rounded font-bold transition-colors ${
                    activeHub.status === 'online'
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  {activeHub.status.toUpperCase()} (Toggle)
                </button>
              </div>
            </div>

            {/* Compartment Grid */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Individual Compartments ({activeHub.compartments.length})
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {activeHub.compartments.map((comp) => (
                  <div
                    key={comp.id}
                    className={`p-3 rounded-xl border text-center text-xs space-y-1 transition-all ${
                      comp.isOccupied
                        ? 'border-amber-300 bg-amber-50/70 text-amber-900'
                        : 'border-emerald-300 bg-emerald-50/70 text-emerald-900'
                    }`}
                  >
                    <div className="font-mono font-bold text-sm">{comp.code}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{comp.size}</div>
                    <div className="font-semibold text-[10px]">
                      {comp.isOccupied ? `Order ${comp.currentOrderId || 'Occupied'}` : 'Empty / Ready'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Returns & Complaints Review */}
      {activeTab === 'returns' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Support & Return Tickets ({tickets.length})
            </h2>
            <span className="text-xs text-slate-400">Review & Approve Refunds</span>
          </div>

          {tickets.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No customer complaint or return tickets logged.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 space-y-3">
              {tickets.map((tck) => (
                <div key={tck.id} className="pt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">#{tck.id}</span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        Order #{tck.orderId}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-semibold">{tck.type}</span>
                    </div>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        tck.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tck.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tck.status}
                    </span>
                  </div>

                  <p className="text-slate-700">
                    <strong>Reason:</strong> {tck.reason} — {tck.description}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Filed by {tck.customerName} on {new Date(tck.createdAt).toLocaleString()}
                  </p>

                  {tck.status === 'OPEN' && (
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => updateTicketStatus(tck.id, 'APPROVED', 'Approved by Operations', tck.simulatedRefundAmount)}
                        className="px-3 py-1 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded text-xs"
                      >
                        Approve Return & Simulated Refund
                      </button>
                      <button
                        onClick={() => updateTicketStatus(tck.id, 'REJECTED', 'Item does not meet return conditions')}
                        className="px-3 py-1 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: 48-Hour Pickup Expiry Exceptions */}
      {activeTab === 'exceptions' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              48-Hour Expired Pickup Review ({expiredOrders.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              As required by the specification, parcels never automatically return to the seller. Admin review is mandatory.
            </p>
          </div>

          {expiredOrders.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No expired pickup cases. All parcels are within their 48-hour pickup window.
            </div>
          ) : (
            <div className="space-y-3">
              {expiredOrders.map((ord) => (
                <div key={ord.id} className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">
                      Order #{ord.id} · Locker [{ord.compartmentCode}]
                    </span>
                    <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                      EXPIRED PICKUP
                    </span>
                  </div>

                  <p className="text-slate-700">
                    Customer <strong>{ord.customerName}</strong> has not collected the parcel within 48 hours of deposit at {ord.assignedHubName}.
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          ord.id,
                          'READY_FOR_PICKUP',
                          'Admin granted a 24-hour pickup grace extension.'
                        )
                      }
                      className="px-3 py-1.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded text-xs"
                    >
                      Extend Window (+24h Grace)
                    </button>
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          ord.id,
                          'RETURNED',
                          'Admin authorized return to merchant due to non-collection.'
                        )
                      }
                      className="px-3 py-1.5 font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded text-xs"
                    >
                      Authorize Return to Seller
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Security & Operations Audit Trail
            </h2>
            <span className="text-xs text-slate-400 font-mono">{auditLogs.length} Events</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-mono max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-blue-600 block">{log.action}</span>
                  <span className="text-slate-600 font-sans text-xs">{log.details}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Actor: {log.actorName} ({log.actorRole})
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
