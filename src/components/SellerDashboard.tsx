import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory, DispatchMethod } from '../types';
import {
  Package,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  Lock,
  Building,
  Eye,
  MessageSquare,
  Send,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const {
    currentUser,
    orders,
    products,
    addProduct,
    updateProduct,
    sellerAcceptOrder,
    sellerDispatchOrder,
    chatMessages,
    sendMessage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'earnings'>('orders');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [chatInput, setChatInput] = useState('');

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('shoes');
  const [newPrice, setNewPrice] = useState(3500);
  const [newStock, setNewStock] = useState(10);
  const [newSizes, setNewSizes] = useState('40, 41, 42, 43');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/product_leather_sneakers_1793268019857.jpg');

  // Filter orders for this seller
  const sellerOrders = orders.filter((o) => o.sellerId === currentUser.uid);

  // Statistics
  const newOrdersCount = sellerOrders.filter((o) => o.status === 'ORDER_PLACED').length;
  const preparingCount = sellerOrders.filter(
    (o) => o.status === 'SELLER_ACCEPTED' || o.status === 'PREPARING_PARCEL'
  ).length;
  const readyDispatchCount = sellerOrders.filter(
    (o) => o.status === 'READY_FOR_DISPATCH' || o.status === 'AWAITING_RIDER'
  ).length;
  const inTransitCount = sellerOrders.filter((o) => o.status === 'IN_TRANSIT').length;
  const completedCount = sellerOrders.filter((o) => o.status === 'COLLECTED').length;

  // Earnings: sum of itemPrice for collected/paid orders
  const simulatedEarned = sellerOrders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.itemPrice, 0);

  const pendingSettlement = sellerOrders
    .filter((o) => o.paymentStatus === 'PENDING')
    .reduce((sum, o) => sum + o.itemPrice, 0);

  const selectedOrder = sellerOrders.find((o) => o.id === selectedOrderId) || sellerOrders[0];
  const orderMessages = chatMessages.filter((m) => m.orderId === selectedOrder?.id);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newPrice <= 0 || newStock < 0) return;

    const sizesArr = newSizes.split(',').map((s) => s.trim()).filter(Boolean);

    addProduct({
      name: newTitle.trim(),
      description: newDesc.trim() || 'High quality apparel crafted for Pakistani market.',
      category: newCategory,
      price: Number(newPrice),
      stock: Number(newStock),
      sizes: sizesArr.length ? sizesArr : ['Standard'],
      imageUrl: newImageUrl,
      status: newStock > 0 ? 'active' : 'out_of_stock',
    });

    setIsAddProductOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedOrder) return;
    sendMessage(selectedOrder.id, chatInput);
    setChatInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Seller Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
              Seller Merchant Console
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Inventory & Dispatch Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            {currentUser.displayName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fulfill orders with zero customer phone number or residential address exposure.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded-md transition-all ${
              activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fulfillment Orders ({sellerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-1.5 rounded-md transition-all ${
              activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Catalog & Stock ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-1.5 rounded-md transition-all ${
              activeTab === 'earnings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Simulated Ledger
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            NEW ORDERS
          </span>
          <div className="text-xl font-extrabold font-mono text-blue-600 mt-1">{newOrdersCount}</div>
          <span className="text-[11px] text-slate-500">Requires acceptance</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            PACKING
          </span>
          <div className="text-xl font-extrabold font-mono text-indigo-600 mt-1">{preparingCount}</div>
          <span className="text-[11px] text-slate-500">In warehouse</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            READY TO DISPATCH
          </span>
          <div className="text-xl font-extrabold font-mono text-amber-600 mt-1">{readyDispatchCount}</div>
          <span className="text-[11px] text-slate-500">Awaiting transit</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            IN TRANSIT
          </span>
          <div className="text-xl font-extrabold font-mono text-purple-600 mt-1">{inTransitCount}</div>
          <span className="text-[11px] text-slate-500">With rider</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            COLLECTED
          </span>
          <div className="text-xl font-extrabold font-mono text-emerald-600 mt-1">{completedCount}</div>
          <span className="text-[11px] text-slate-500">Completed pickups</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            EARNED (SIMULATED)
          </span>
          <div className="text-base font-extrabold font-mono text-slate-900 mt-1">
            Rs. {simulatedEarned.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Excludes rider/locker fee</span>
        </div>
      </div>

      {/* Tab 1: Orders Management & Dispatch */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Order List */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Assigned Orders Queue
            </h2>

            {sellerOrders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-xs text-slate-500">
                No orders assigned to your merchant account yet.
              </div>
            ) : (
              <div className="space-y-3">
                {sellerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedOrder?.id === ord.id
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          #{ord.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100/70 text-blue-800">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-xs text-slate-900">
                        Item Price: Rs. {ord.itemPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-2 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Items: {ord.items.map((i) => `${i.productName} (${i.size})`).join(', ')}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Target Hub: <strong>{ord.assignedHubName || ord.primaryHubName}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Action Panel & Privacy Verification */}
          <div className="lg:col-span-5 space-y-6">
            {selectedOrder ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    ORDER WORKFLOW ACTIONS
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Fulfill Order #{selectedOrder.id}
                  </h3>
                </div>

                {/* Privacy Proof Box */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>Customer Privacy Firewall Active</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Customer Name: <strong>{selectedOrder.customerName}</strong><br />
                    Customer Phone: <span className="text-slate-400 font-mono">[PROTECTED - MASKED]</span><br />
                    Delivery Destination: <strong>{selectedOrder.primaryHubName} (Locker Hub)</strong>
                  </p>
                </div>

                {/* Seller Actions based on Status */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">
                    Permitted Operational Actions:
                  </span>

                  {selectedOrder.status === 'ORDER_PLACED' && (
                    <div className="space-y-2">
                      <button
                        onClick={() => sellerAcceptOrder(selectedOrder.id)}
                        className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Order & Start Packing</span>
                      </button>
                    </div>
                  )}

                  {(selectedOrder.status === 'SELLER_ACCEPTED' ||
                    selectedOrder.status === 'PREPARING_PARCEL') && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500">
                        Parcel packed in protective logistics packaging. Select dispatch workflow:
                      </p>

                      <button
                        onClick={() => sellerDispatchOrder(selectedOrder.id, 'RIDER_PICKUP')}
                        className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Request Rider Pickup from Warehouse</span>
                      </button>

                      <button
                        onClick={() =>
                          sellerDispatchOrder(selectedOrder.id, 'SELLER_DROPOFF', 'Karachi Drop Station A')
                        }
                        className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Building className="w-4 h-4 text-slate-500" />
                        <span>Drop off at Approved Station (Zamzama Depot)</span>
                      </button>
                    </div>
                  )}

                  {selectedOrder.status === 'AWAITING_RIDER' && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                      Rider collection task published. Waiting for fleet rider to accept and scan package.
                    </div>
                  )}

                  {selectedOrder.status === 'IN_TRANSIT' && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900">
                      Parcel picked up by Fleet Rider. Currently en route to {selectedOrder.primaryHubName}.
                    </div>
                  )}

                  {(selectedOrder.status === 'PARCEL_DEPOSITED' ||
                    selectedOrder.status === 'PAYMENT_PENDING' ||
                    selectedOrder.status === 'READY_FOR_PICKUP') && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                      Parcel safely deposited inside locker terminal [{selectedOrder.compartmentCode || 'Locker Hub'}]. Awaiting customer QR pickup.
                    </div>
                  )}

                  {selectedOrder.status === 'COLLECTED' && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                      ✓ Order successfully collected by customer! Simulated earnings of Rs. {selectedOrder.itemPrice.toLocaleString()} settled.
                    </div>
                  )}
                </div>

                {/* Customer In-App Chat */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Chat with {selectedOrder.customerName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Order-Linked</span>
                  </div>

                  <div className="h-32 overflow-y-auto space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    {orderMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2 rounded text-xs max-w-[85%] ${
                          msg.senderId === currentUser.uid
                            ? 'ml-auto bg-blue-600 text-white'
                            : 'mr-auto bg-white border border-slate-200 text-slate-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChat} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Reply to customer..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                    />
                    <button
                      type="submit"
                      className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
                Select an order from the queue to view details and process dispatch.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Inventory & Catalog Management */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Store Catalog ({products.length} Products)
            </h2>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5 text-right">Price (PKR)</th>
                  <th className="p-3.5 text-right">Stock</th>
                  <th className="p-3.5">Sizes</th>
                  <th className="p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{prod.name}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1">{prod.description}</span>
                      </div>
                    </td>
                    <td className="p-3.5 capitalize text-slate-600">{prod.category}</td>
                    <td className="p-3.5 font-mono font-bold text-right text-slate-900">
                      Rs. {prod.price.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-mono text-right">
                      <span className={prod.stock <= 5 ? 'text-red-600 font-bold' : 'text-slate-800'}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{prod.sizes.join(', ')}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => updateProduct(prod.id, { stock: prod.stock + 5 })}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        +5 Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Simulated Earnings & Allocations */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono text-blue-400 uppercase">
                SELLER ACCOUNTING SETTLEMENT
              </span>
              <h2 className="text-2xl font-bold font-mono mt-1">
                Rs. {simulatedEarned.toLocaleString()} PKR
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Total item revenues accrued from verified locker collections. Delivery & locker fees are allocated separately.
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-xs space-y-1 min-w-[200px]">
              <div className="flex justify-between text-slate-400">
                <span>Pending in Transit:</span>
                <span className="font-mono text-white">Rs. {pendingSettlement.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Orders:</span>
                <span className="font-mono text-white">{sellerOrders.length}</span>
              </div>
              <div className="text-[10px] text-emerald-400 pt-1">
                ✓ 100% Simulated Demonstration Ledger
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Demo Product</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Handmade Leather Chukka Boots"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="shoes">Footwear (Shoes)</option>
                    <option value="clothing">Apparel (Clothing)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Price (PKR)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Sizes (Comma separated)</label>
                  <input
                    type="text"
                    value={newSizes}
                    onChange={(e) => setNewSizes(e.target.value)}
                    placeholder="S, M, L or 41, 42, 43"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Product Photograph</label>
                <select
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-xs truncate"
                >
                  <option value="/src/assets/images/product_leather_sneakers_1793268019857.jpg">
                    White & Navy Leather Sneakers
                  </option>
                  <option value="/src/assets/images/product_oxford_shoes_1793268020592.jpg">
                    Heritage Oxford Dress Shoes
                  </option>
                  <option value="/src/assets/images/product_cotton_jacket_1793268021266.jpg">
                    Cotton Canvas Utility Jacket
                  </option>
                  <option value="/src/assets/images/product_linen_shirt_1793268021220.jpg">
                    Tailored Crisp Linen Shirt
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
