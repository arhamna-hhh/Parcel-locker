import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import QRCode from 'qrcode';
import {
  Package,
  QrCode,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileText,
  CreditCard,
  MapPin,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Lock,
  Send,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const CustomerDashboard: React.FC<{ onOpenQrScanner: (token: string) => void }> = ({
  onOpenQrScanner,
}) => {
  const {
    currentUser,
    orders,
    simulatePayment,
    verifyAndCollectParcel,
    expirePickupManually,
    createTicket,
    tickets,
    chatMessages,
    sendMessage,
    updateProfile,
    setActiveView,
  } = useApp();

  const customerOrders = orders.filter((o) => o.customerId === currentUser.uid);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(customerOrders[0]?.id || '');
  const activeOrder = customerOrders.find((o) => o.id === selectedOrderId) || customerOrders[0];

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [chatInput, setChatInput] = useState('');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Size does not fit');
  const [returnDescription, setReturnDescription] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editAddress, setEditAddress] = useState(currentUser.address || '');

  // Generate QR Code when pickupToken is available
  useEffect(() => {
    if (activeOrder?.pickupToken) {
      QRCode.toDataURL(activeOrder.pickupToken, {
        width: 240,
        margin: 1.5,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    } else {
      setQrDataUrl('');
    }
  }, [activeOrder?.pickupToken, activeOrder?.status]);

  const activeOrderMessages = chatMessages.filter((m) => m.orderId === activeOrder?.id);

  // Time left calculation for 48h expiry
  const getRemainingHours = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.floor(diff / 3600000);
  };

  const remainingHours = getRemainingHours(activeOrder?.pickupTokenExpiresAt);

  const handlePayPending = async () => {
    if (!activeOrder) return;
    setIsPaying(true);
    await simulatePayment(activeOrder.id, 'DEMO_WALLET', true);
    setIsPaying(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeOrder) return;
    sendMessage(activeOrder.id, chatInput);
    setChatInput('');
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    createTicket({
      orderId: activeOrder.id,
      type: 'RETURN',
      reason: returnReason,
      description: returnDescription || 'Customer initiated return request from dashboard.',
      status: 'OPEN',
      simulatedRefundAmount: activeOrder.totalAmount,
    });
    setIsReturnModalOpen(false);
    setReturnDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Customer Header & Privacy Shield Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
              Customer Portal
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">SafeDrop Vault Protection</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Welcome, {currentUser.displayName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your home address and personal mobile number are completely masked from riders and merchants.
          </p>
        </div>

        {/* Private Data Capsule */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1.5 min-w-[280px]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Protected Profile Data</span>
            </span>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-[11px] text-blue-600 font-semibold hover:underline"
            >
              {isEditingProfile ? 'Done' : 'Edit'}
            </button>
          </div>

          {isEditingProfile ? (
            <div className="space-y-2 pt-1">
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Phone"
                className="w-full px-2 py-1 text-xs border rounded bg-white"
              />
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="Address"
                className="w-full px-2 py-1 text-xs border rounded bg-white"
              />
              <button
                onClick={() => {
                  updateProfile({ phone: editPhone, address: editAddress });
                  setIsEditingProfile(false);
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-white bg-blue-600 rounded"
              >
                Save Profile
              </button>
            </div>
          ) : (
            <div className="space-y-0.5 text-slate-600 text-[11px]">
              <div className="truncate">
                <span className="text-slate-400">Phone:</span> {currentUser.phone || '+92 300 1234567'}
              </div>
              <div className="truncate">
                <span className="text-slate-400">Home:</span> {currentUser.address || 'North Karachi'}
              </div>
              <div className="text-[10px] text-emerald-700 font-medium pt-1">
                ✓ PII Firewall: Never disclosed to delivery personnel
              </div>
            </div>
          )}
        </div>
      </div>

      {customerOrders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Orders in Your Account</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You have not placed any orders yet. Visit our demo apparel & footwear shop to create your first privacy-protected locker delivery.
          </p>
          <button
            onClick={() => setActiveView('shop')}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
          >
            Go to Demo Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Selector & Timeline */}
          <div className="lg:col-span-7 space-y-6">
            {/* Order Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {customerOrders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    activeOrder?.id === ord.id
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-mono">{ord.id}</div>
                  <div className="text-[10px] font-normal text-slate-500 capitalize">
                    {ord.status.replace(/_/g, ' ').toLowerCase()}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Order Summary Card */}
            {activeOrder && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold font-mono text-slate-900">
                        Order #{activeOrder.id}
                      </h2>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {activeOrder.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Placed on {new Date(activeOrder.createdAt).toLocaleDateString()} at{' '}
                      {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">TOTAL AMOUNT</span>
                    <span className="text-base font-bold font-mono text-slate-900">
                      Rs. {activeOrder.totalAmount.toLocaleString()} PKR
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Status: <strong className={activeOrder.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}>{activeOrder.paymentStatus}</strong>
                    </span>
                  </div>
                </div>

                {/* Locker Hub Routing Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                      ASSIGNED LOCKER TERMINAL
                    </span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {activeOrder.assignedHubName || activeOrder.primaryHubName}
                    </p>
                    {activeOrder.compartmentCode && (
                      <p className="text-blue-600 font-mono font-bold mt-0.5">
                        Compartment: [{activeOrder.compartmentCode}]
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                      AUTHORIZED ALTERNATIVE
                    </span>
                    <p className="text-slate-600 mt-0.5">{activeOrder.alternativeHubName}</p>
                    <span className="text-[10px] text-slate-400 italic">
                      Automated fallback if primary hub is occupied
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Purchased Goods
                  </h3>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-10 h-10 object-cover rounded border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{item.productName}</span>
                            <span className="text-slate-500 text-[11px]">
                              Size: {item.size} · Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-slate-900">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-Time Linear Tracking Timeline */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Live Server-Authoritative Progress
                  </h3>
                  <div className="relative pl-6 space-y-4 border-l-2 border-blue-200 ml-2">
                    {activeOrder.statusHistory.map((step, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {step.status.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            By {step.actor} {step.note ? `· ${step.note}` : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Action Bar: Return & Support */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsReturnModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Request Return / Refund</span>
                    </button>
                  </div>

                  {/* Testing Helper Buttons for Academic Evaluator */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => expirePickupManually(activeOrder.id)}
                      className="px-2.5 py-1 text-[11px] text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded font-medium"
                      title="Simulates 48 hours passing without collection to trigger Admin review"
                    >
                      Test 48h Expiry Trigger
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: QR Pickup Code & Chat */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Single-Use Pickup QR Code Module */}
            {activeOrder && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">Pickup Authorization</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Single-Use Token
                  </span>
                </div>

                {/* State A: Collected / Used */}
                {activeOrder.status === 'COLLECTED' ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-900">Parcel Successfully Collected</h4>
                    <p className="text-xs text-emerald-700">
                      Locker door [{activeOrder.compartmentCode}] was opened. The pickup QR token has been securely burned and invalidated.
                    </p>
                    <p className="text-[10px] text-emerald-800/80 font-mono mt-2">
                      Collected at: {activeOrder.collectedAt ? new Date(activeOrder.collectedAt).toLocaleString() : 'Just now'}
                    </p>
                  </div>
                ) : activeOrder.status === 'EXPIRED_PICKUP' ? (
                  /* State B: Expired 48h */
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center space-y-2">
                    <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
                    <h4 className="text-sm font-bold text-amber-900">Pickup Window Expired</h4>
                    <p className="text-xs text-amber-800">
                      The 48-hour collection window has elapsed. As per security rules, the locker remains locked and has been routed to Admin Exception Review.
                    </p>
                    <span className="text-[11px] text-amber-700 font-semibold block pt-1">
                      SafeDrop Operations will contact you or authorize extension.
                    </span>
                  </div>
                ) : activeOrder.status === 'PAYMENT_PENDING' ? (
                  /* State C: Deposited, but payment required to unlock QR */
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-start gap-2.5">
                      <CreditCard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-900 space-y-1">
                        <p className="font-bold">Parcel Deposited in Locker [{activeOrder.compartmentCode}]</p>
                        <p className="text-blue-800/80 leading-relaxed">
                          You selected <em>Pay After Deposit</em>. Complete your simulated payment of{' '}
                          <strong>Rs. {activeOrder.totalAmount.toLocaleString()}</strong> to activate your pickup QR code.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handlePayPending}
                      disabled={isPaying}
                      className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>
                        {isPaying ? 'Verifying with Mock Gateway...' : `Authorize Payment (Rs. ${activeOrder.totalAmount.toLocaleString()})`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : activeOrder.status === 'READY_FOR_PICKUP' && qrDataUrl ? (
                  /* State D: QR Code Active & Ready */
                  <div className="space-y-4 text-center">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block shadow-inner">
                      <img
                        src={qrDataUrl}
                        alt="SafeDrop Single-Use Pickup QR Code"
                        className="w-48 h-48 mx-auto rounded-lg"
                      />
                    </div>

                    {/* Expiry Countdown */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>
                        Validity: <strong className="font-mono text-slate-900">{remainingHours !== null ? `${remainingHours} Hours` : '48 Hours'}</strong> remaining
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-left space-y-1">
                      <p className="font-semibold text-slate-700">Instructions at Terminal:</p>
                      <p>1. Go to {activeOrder.assignedHubName || activeOrder.primaryHubName}.</p>
                      <p>2. Scan this QR on the scanner beneath the touchscreen.</p>
                      <p>3. Compartment <strong>[{activeOrder.compartmentCode}]</strong> will unlock automatically.</p>
                    </div>

                    {/* Simulate Terminal Scan Button */}
                    <button
                      onClick={() => onOpenQrScanner(activeOrder.pickupToken || '')}
                      className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Simulate Locker Terminal Scan</span>
                    </button>
                  </div>
                ) : (
                  /* State E: In Transit or Preparation */
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center space-y-2">
                    <Clock className="w-8 h-8 text-slate-400 mx-auto animate-pulse" />
                    <h4 className="text-xs font-bold text-slate-800">QR Code Inactive</h4>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Your parcel is currently being prepared and transported to {activeOrder.primaryHubName}.
                      The pickup QR will unlock automatically once deposited in your locker.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 2. Order-Linked Chat with Merchant (Privacy-Preserved) */}
            {activeOrder && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      Seller In-App Chat (Order #{activeOrder.id})
                    </h3>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Phone Masked</span>
                  </span>
                </div>

                <div className="h-44 overflow-y-auto space-y-2.5 p-2 bg-slate-50/60 rounded-lg border border-slate-200 text-xs">
                  {activeOrderMessages.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No messages yet. Send a query to {activeOrder.sellerName}.
                    </div>
                  ) : (
                    activeOrderMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2.5 rounded-lg max-w-[85%] space-y-0.5 ${
                          msg.senderId === currentUser.uid
                            ? 'ml-auto bg-blue-600 text-white'
                            : 'mr-auto bg-white border border-slate-200 text-slate-800'
                        }`}
                      >
                        <div
                          className={`text-[9px] font-semibold ${
                            msg.senderId === currentUser.uid ? 'text-blue-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.senderName} ({msg.senderRole})
                        </div>
                        <p className="text-xs leading-relaxed">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message seller regarding packing/sizing..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                  <button
                    type="submit"
                    className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {isReturnModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Request Return for Order #{activeOrder.id}
              </h3>
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Size does not fit">Size does not fit</option>
                  <option value="Defective or damaged fabric">Defective or damaged fabric</option>
                  <option value="Incorrect item received">Incorrect item received</option>
                  <option value="Not as described in photographs">Not as described in photographs</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Detailed Description</label>
                <textarea
                  rows={3}
                  value={returnDescription}
                  onChange={(e) => setReturnDescription(e.target.value)}
                  placeholder="Explain why you wish to return this item..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 space-y-1">
                <p className="font-semibold">Simulated Refund Amount:</p>
                <p className="font-mono text-sm font-bold text-blue-600">
                  Rs. {activeOrder.totalAmount.toLocaleString()} PKR
                </p>
                <p className="text-[10px] text-slate-400">
                  Requires Admin review and approval in operations control tower.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Submit Return Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
