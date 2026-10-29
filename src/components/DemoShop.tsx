import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory, PaymentTiming, PaymentMethod } from '../types';
import {
  ShoppingBag,
  Search,
  Filter,
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Wallet,
  AlertCircle,
  MapPin,
  Building,
} from 'lucide-react';

export const DemoShop: React.FC = () => {
  const {
    products,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    hubs,
    createOrder,
    simulatePayment,
    currentUser,
    setActiveView,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'all' | ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Checkout Form State
  const [primaryHubId, setPrimaryHubId] = useState<string>(hubs[0]?.id || 'hub-gulshan');
  const [alternativeHubId, setAlternativeHubId] = useState<string>(hubs[1]?.id || 'hub-clifton');
  const [paymentTiming, setPaymentTiming] = useState<PaymentTiming>('AFTER_DEPOSIT');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('DEMO_WALLET');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+92 300 1234567');
  const [customerAddress, setCustomerAddress] = useState(currentUser.address || 'House 42-B, Sector 11-A, North Karachi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 30 : 0; // Rs. 30 as specified in prompt
  const lockerFee = cart.length > 0 ? 60 : 0; // Rs. 60 as specified in prompt
  const orderTotal = cartSubtotal + deliveryFee + lockerFee;

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || 'Standard');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (primaryHubId === alternativeHubId) {
      setCheckoutError('Please select a different hub for your authorized alternative backup.');
      return;
    }

    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        category: item.product.category,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
      }));

      const newOrder = await createOrder({
        items: orderItems,
        itemPrice: cartSubtotal,
        deliveryFee,
        lockerFee,
        primaryHubId,
        alternativeHubId,
        paymentTiming,
        customerPhone,
        customerAddress,
      });

      // If user selected "Pay Now", execute simulated payment immediately
      if (paymentTiming === 'UPFRONT') {
        await simulatePayment(newOrder.id, paymentMethod, true);
      }

      setIsCheckoutOpen(false);
      setActiveView('dashboard');
    } catch (err) {
      setCheckoutError('Could not process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Category Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            SafeDrop Demo Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Footwear & Apparel Store
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose items to test the automated locker delivery and privacy-shielded fulfillment workflow.
          </p>
        </div>

        {/* Search & Cart Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search shoes or clothes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 w-56"
            />
          </div>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs relative"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            <span className="bg-white/20 px-1.5 py-0.2 rounded text-[11px] font-mono">
              {cart.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Tabs (Interactive Segmented Control - Allowed by Anti-Slop Constitution) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center p-1 bg-slate-200/60 rounded-lg">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              selectedCategory === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setSelectedCategory('shoes')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              selectedCategory === 'shoes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Footwear Only
          </button>
          <button
            onClick={() => setSelectedCategory('clothing')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              selectedCategory === 'clothing'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Apparel Only
          </button>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredProducts.length} items
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">No matching items found</p>
          <p className="text-xs text-slate-500">Try adjusting your category filter or search keywords.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  className="aspect-4/3 bg-slate-100 cursor-pointer overflow-hidden relative"
                  onClick={() => handleOpenProduct(prod)}
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 text-[10px] uppercase font-bold bg-white/95 px-2 py-0.5 rounded text-slate-800 shadow-xs">
                    {prod.category}
                  </span>
                </div>
                <div className="p-4 space-y-1.5">
                  <span className="text-[11px] text-slate-400 block truncate">
                    Seller: {prod.sellerName}
                  </span>
                  <h3
                    onClick={() => handleOpenProduct(prod)}
                    className="text-xs font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                  >
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">PRICE</span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    Rs. {prod.price.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenProduct(prod)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="aspect-4/3 sm:aspect-auto bg-slate-100">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="uppercase font-semibold tracking-wider">
                      {selectedProduct.category}
                    </span>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{selectedProduct.name}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="text-base font-bold font-mono text-blue-600">
                    Rs. {selectedProduct.price.toLocaleString()}{' '}
                    <span className="text-[11px] text-slate-400 font-normal">PKR</span>
                  </div>

                  {/* Size Selector */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Select Size / Option:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all ${
                            selectedSize === s
                              ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-emerald-700 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock · Available for Automated Locker Delivery</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, selectedSize);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart & Privacy Checkout Drawer / Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Privacy-Protected Locker Checkout
                </h2>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">Your shopping bag is empty</p>
                  <p className="text-xs text-slate-500">
                    Add apparel or shoes from the demo catalog to proceed.
                  </p>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg"
                  >
                    Browse Items
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  {/* Itemized Cart List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Selected Items ({cart.length})
                    </h3>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      {cart.map((item) => (
                        <div key={`${item.product.id}-${item.size}`} className="p-3.5 flex items-center justify-between gap-4 bg-white">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{item.product.name}</h4>
                              <div className="text-[11px] text-slate-500">
                                Size: {item.size} · Rs. {item.product.price.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-slate-200 rounded-md">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.product.id, item.size, -1)}
                                className="p-1 text-slate-500 hover:text-slate-800"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-mono font-bold text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.product.id, item.size, 1)}
                                className="p-1 text-slate-500 hover:text-slate-800"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs font-bold font-mono text-slate-900 w-20 text-right">
                              Rs. {(item.product.price * item.quantity).toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id, item.size)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Notice Banner */}
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <Lock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-900 space-y-1">
                      <p className="font-bold">Customer Privacy Decoupling Active</p>
                      <p className="text-blue-800/80 leading-relaxed">
                        Your phone number and street address entered below are strictly for customer profile verification.
                        They are <strong>NEVER transmitted</strong> to the delivery rider or clothing seller.
                        Fulfillment is routed solely through your authorized locker hubs.
                      </p>
                    </div>
                  </div>

                  {/* Customer Information (Private) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Contact Phone (Encrypted in SafeDrop Vault)
                      </label>
                      <input
                        type="text"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Home Address (Private - Never Shared with Riders)
                      </label>
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        placeholder="House / Sector, Karachi"
                      />
                    </div>
                  </div>

                  {/* Dual Hub Selection (Primary + Backup Authorized Alternative) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Authorized Locker Hub Selection (Karachi)
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        Both must be explicitly authorized
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Primary Hub */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>1. Primary Preferred Hub</span>
                        </label>
                        <select
                          value={primaryHubId}
                          onChange={(e) => setPrimaryHubId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        >
                          {hubs.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name} ({h.availableCompartments} lockers free)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Alternative Hub */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-indigo-600" />
                          <span>2. Authorized Alternative Hub (If Primary Full)</span>
                        </label>
                        <select
                          value={alternativeHubId}
                          onChange={(e) => setAlternativeHubId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        >
                          {hubs.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name} ({h.availableCompartments} lockers free)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment Timing Choice (As requested in user prompt) */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Simulated Payment Timing
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                          paymentTiming === 'AFTER_DEPOSIT'
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentTiming"
                          checked={paymentTiming === 'AFTER_DEPOSIT'}
                          onChange={() => setPaymentTiming('AFTER_DEPOSIT')}
                          className="mt-0.5 text-blue-600"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Pay After Locker Deposit (Recommended)
                          </span>
                          <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                            Pay only when the rider deposits the parcel into your locker. QR code activates upon payment.
                          </span>
                        </div>
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                          paymentTiming === 'UPFRONT'
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentTiming"
                          checked={paymentTiming === 'UPFRONT'}
                          onChange={() => setPaymentTiming('UPFRONT')}
                          className="mt-0.5 text-blue-600"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Pay Now at Checkout
                          </span>
                          <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                            Complete simulated payment immediately. QR code unlocks instantly once parcel is deposited.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Simulated Payment Method */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Simulated Payment Method (No Real Funds Moved)
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                          paymentMethod === 'DEMO_WALLET'
                            ? 'border-blue-600 bg-blue-50/50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'DEMO_WALLET'}
                          onChange={() => setPaymentMethod('DEMO_WALLET')}
                          className="text-blue-600"
                        />
                        <Wallet className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-slate-800">Demo SafeDrop Wallet</span>
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                          paymentMethod === 'DEMO_CARD'
                            ? 'border-blue-600 bg-blue-50/50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'DEMO_CARD'}
                          onChange={() => setPaymentMethod('DEMO_CARD')}
                          className="text-blue-600"
                        />
                        <CreditCard className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-semibold text-slate-800">Demo Bank Card (Mock)</span>
                      </label>
                    </div>
                  </div>

                  {/* Transparent Fee Breakdown (As required by prompt Section 6.E) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Products Subtotal (Payable to Seller):</span>
                      <span className="font-mono font-medium">Rs. {cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Delivery Fee (Payable to Courier):</span>
                      <span className="font-mono font-medium">Rs. {deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Smart Locker Terminal Fee (Payable to Operator):</span>
                      <span className="font-mono font-medium">Rs. {lockerFee.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900 text-sm">
                      <span>Total Amount Payable:</span>
                      <span className="font-mono text-blue-600">Rs. {orderTotal.toLocaleString()} PKR</span>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{checkoutError}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Back to Shopping
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <span>
                        {paymentTiming === 'UPFRONT'
                          ? `Pay & Confirm Order (Rs. ${orderTotal.toLocaleString()})`
                          : 'Confirm Locker Order (Pay After Deposit)'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
