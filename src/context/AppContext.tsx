import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
  Product,
  LockerHub,
  Order,
  OrderStatus,
  SupportTicket,
  ChatMessage,
  AuditLog,
  CartItem,
  PaymentMethod,
  PaymentTiming,
  DispatchMethod,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_PRODUCTS,
  INITIAL_HUBS,
  INITIAL_ORDERS,
  INITIAL_TICKETS,
} from '../data/initialData';
import { db, testFirestoreConnection } from '../lib/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

interface AppContextType {
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  products: Product[];
  addProduct: (newProd: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  cart: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, size: string, delta: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  hubs: LockerHub[];
  toggleHubStatus: (hubId: string, status: LockerHub['status']) => void;
  orders: Order[];
  createOrder: (params: {
    items: Order['items'];
    itemPrice: number;
    deliveryFee: number;
    lockerFee: number;
    primaryHubId: string;
    alternativeHubId: string;
    paymentTiming: PaymentTiming;
    customerPhone: string;
    customerAddress: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  sellerAcceptOrder: (orderId: string) => void;
  sellerDispatchOrder: (orderId: string, method: DispatchMethod, dropoffStationId?: string) => void;
  riderAcceptTask: (orderId: string) => void;
  riderDepositParcel: (orderId: string, hubId: string, compartmentSize: 'small' | 'medium' | 'large') => void;
  simulatePayment: (orderId: string, method: PaymentMethod, forceSuccess?: boolean) => Promise<boolean>;
  verifyAndCollectParcel: (token: string) => { success: boolean; message: string; order?: Order };
  expirePickupManually: (orderId: string) => void;
  tickets: SupportTicket[];
  createTicket: (data: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'customerId' | 'customerName'>) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status'], adminNotes?: string, refundAmount?: number) => void;
  chatMessages: ChatMessage[];
  sendMessage: (orderId: string, text: string) => void;
  auditLogs: AuditLog[];
  activeNotification: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' } | null;
  clearNotification: () => void;
  firebaseConnected: boolean;
  activeView: string;
  setActiveView: (view: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.customer);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [hubs, setHubs] = useState<LockerHub[]>(INITIAL_HUBS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      orderId: 'SD-8492',
      senderId: 'user-seller-001',
      senderRole: 'seller',
      senderName: 'Karachi Apparel & Footwear Co.',
      text: 'Salam! Your linen shirt has been ironed and packed in our moisture-sealed eco parcel bag.',
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: 'msg-2',
      orderId: 'SD-8492',
      senderId: 'user-cust-001',
      senderRole: 'customer',
      senderName: 'Arham Nawaz (BS IMT)',
      text: 'Walaikum Assalam. Thank you! Will collect from Gulshan Central Hub once deposited.',
      timestamp: new Date(Date.now() - 3600000 * 5.5).toISOString(),
    },
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      actorId: 'user-admin-001',
      actorRole: 'admin',
      actorName: 'SafeDrop Control Tower',
      action: 'SYSTEM_BOOT',
      details: 'Karachi smart automated parcel locker network initialized across 4 pilot hubs.',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ]);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<{
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  } | null>(null);
  const [activeView, setActiveView] = useState<string>('home');

  // Check Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setFirebaseConnected(connected);
      if (connected) {
        logAction('FIREBASE_CONNECTED', 'Connected to Firebase Cloud Firestore successfully.');
      }
    });
  }, []);

  const showNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setActiveNotification({ title, message, type });
    setTimeout(() => {
      setActiveNotification((prev) => (prev?.message === message ? null : prev));
    }, 6000);
  };

  const clearNotification = () => setActiveNotification(null);

  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorId: currentUser.uid,
      actorRole: currentUser.role,
      actorName: currentUser.displayName,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Async sync with Firestore if online
    if (firebaseConnected) {
      setDoc(doc(db, 'audit_logs', newLog.id), newLog).catch(() => {});
    }
  };

  const switchRole = (role: UserRole) => {
    const targetUser = DEMO_USERS[role];
    setCurrentUser(targetUser);
    logAction('ROLE_SWITCH', `Switched active preview role to: ${role.toUpperCase()}`);
    showNotification('Role Switched', `Now acting as ${targetUser.displayName} (${role.toUpperCase()})`, 'info');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...data }));
    logAction('PROFILE_UPDATE', 'Updated user profile attributes.');
    showNotification('Profile Updated', 'Your profile settings have been saved.', 'success');
  };

  // Cart operations
  const addToCart = (product: Product, size: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, size, quantity }];
    });
    showNotification('Added to Bag', `${product.name} (Size: ${size}) added to your shopping bag.`, 'success');
  };

  const updateCartQuantity = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  };

  const clearCart = () => setCart([]);

  // Product management for Seller
  const addProduct = (newProd: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id,
      sellerId: currentUser.uid,
      sellerName: currentUser.displayName,
    };
    setProducts((prev) => [product, ...prev]);
    logAction('PRODUCT_CREATED', `Seller added new product: ${product.name} (Rs. ${product.price})`);
    showNotification('Product Listed', `"${product.name}" has been published to the demo catalog.`, 'success');

    if (firebaseConnected) {
      setDoc(doc(db, 'products', id), product).catch(() => {});
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    logAction('PRODUCT_UPDATED', `Product ID ${id} attributes updated.`);
    showNotification('Product Updated', 'Product catalog details saved.', 'info');
  };

  // Hub management
  const toggleHubStatus = (hubId: string, status: LockerHub['status']) => {
    setHubs((prev) => prev.map((h) => (h.id === hubId ? { ...h, status } : h)));
    logAction('HUB_STATUS_CHANGE', `Hub ${hubId} status toggled to ${status}`);
    showNotification('Hub Status Updated', `Terminal hub status set to ${status}.`, 'info');
  };

  // Orders workflow
  const createOrder = async (params: {
    items: Order['items'];
    itemPrice: number;
    deliveryFee: number;
    lockerFee: number;
    primaryHubId: string;
    alternativeHubId: string;
    paymentTiming: PaymentTiming;
    customerPhone: string;
    customerAddress: string;
  }): Promise<Order> => {
    const orderId = `SD-${Math.floor(1000 + Math.random() * 9000)}`;
    const primaryHub = hubs.find((h) => h.id === params.primaryHubId) || hubs[0];
    const alternativeHub = hubs.find((h) => h.id === params.alternativeHubId) || hubs[1];

    const newOrder: Order = {
      id: orderId,
      customerId: currentUser.uid,
      customerName: currentUser.displayName,
      customerPhone: params.customerPhone,
      customerAddress: params.customerAddress,
      sellerId: 'user-seller-001',
      sellerName: 'Karachi Apparel & Footwear Co.',
      items: params.items,
      itemPrice: params.itemPrice,
      deliveryFee: params.deliveryFee,
      lockerFee: params.lockerFee,
      totalAmount: params.itemPrice + params.deliveryFee + params.lockerFee,
      primaryHubId: primaryHub.id,
      primaryHubName: primaryHub.name,
      alternativeHubId: alternativeHub.id,
      alternativeHubName: alternativeHub.name,
      status: 'ORDER_PLACED',
      statusHistory: [
        {
          status: 'ORDER_PLACED',
          timestamp: new Date().toISOString(),
          actor: currentUser.displayName,
          note: `Primary: ${primaryHub.name} · Alt: ${alternativeHub.name}`,
        },
      ],
      paymentTiming: params.paymentTiming,
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    logAction('ORDER_PLACED', `New locker delivery order created: #${orderId} (Rs. ${newOrder.totalAmount})`);
    showNotification(
      'Order Placed!',
      `Order #${orderId} confirmed. Primary Hub: ${primaryHub.name}. Your phone number & home address are strictly protected.`,
      'success'
    );

    if (firebaseConnected) {
      setDoc(doc(db, 'orders', orderId), newOrder).catch(() => {});
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const historyEntry = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          actor: `${currentUser.displayName} (${currentUser.role})`,
          note,
        };
        const updated: Order = {
          ...order,
          status: newStatus,
          statusHistory: [...order.statusHistory, historyEntry],
          updatedAt: new Date().toISOString(),
        };

        if (newStatus === 'COLLECTED') {
          updated.collectedAt = new Date().toISOString();
          updated.pickupTokenUsed = true;
        }

        return updated;
      })
    );
    logAction('ORDER_STATUS_UPDATE', `Order #${orderId} transitioned to ${newStatus}`);
    showNotification('Order Updated', `Order #${orderId} is now: ${newStatus.replace(/_/g, ' ')}`, 'info');
  };

  // Seller specific actions
  const sellerAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'SELLER_ACCEPTED', 'Seller verified inventory and accepted order.');
  };

  const sellerDispatchOrder = (orderId: string, method: DispatchMethod, dropoffStationId?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const newStatus: OrderStatus = method === 'RIDER_PICKUP' ? 'AWAITING_RIDER' : 'READY_FOR_DISPATCH';
        const note =
          method === 'RIDER_PICKUP'
            ? 'Rider dispatch task generated for collection from Seller warehouse.'
            : `Seller drop-off scheduled at authorized station (${dropoffStationId || 'Karachi Drop Station A'}).`;
        return {
          ...order,
          status: newStatus,
          dispatchMethod: method,
          dropoffStationId,
          statusHistory: [
            ...order.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              actor: currentUser.displayName,
              note,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logAction('SELLER_DISPATCH', `Order #${orderId} marked ready via ${method}`);
    showNotification('Dispatch Initiated', `Order #${orderId} ready for transport.`, 'success');
  };

  // Rider specific actions
  const riderAcceptTask = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          riderId: currentUser.uid,
          riderName: currentUser.displayName,
          status: 'IN_TRANSIT',
          statusHistory: [
            ...order.statusHistory,
            {
              status: 'IN_TRANSIT',
              timestamp: new Date().toISOString(),
              actor: currentUser.displayName,
              note: 'Parcel collected from seller. En route to designated locker hub.',
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logAction('RIDER_TASK_ACCEPT', `Rider ${currentUser.displayName} took custody of Order #${orderId}`);
    showNotification('Task Assigned', `You are now delivering Order #${orderId} to locker hub.`, 'info');
  };

  const riderDepositParcel = (
    orderId: string,
    hubId: string,
    compartmentSize: 'small' | 'medium' | 'large'
  ) => {
    const targetHub = hubs.find((h) => h.id === hubId);
    if (!targetHub) return;

    // Find first available compartment of chosen size
    const availableComp = targetHub.compartments.find((c) => c.size === compartmentSize && !c.isOccupied);
    if (!availableComp) {
      showNotification('Hub Full', `No ${compartmentSize} compartments free at ${targetHub.name}. Try alternative hub!`, 'error');
      return;
    }

    // Lock compartment atomically
    setHubs((prev) =>
      prev.map((h) => {
        if (h.id !== hubId) return h;
        return {
          ...h,
          availableCompartments: Math.max(0, h.availableCompartments - 1),
          compartments: h.compartments.map((c) =>
            c.id === availableComp.id
              ? { ...c, isOccupied: true, currentOrderId: orderId, updatedAt: new Date().toISOString() }
              : c
          ),
        };
      })
    );

    // Update order with deposit details and generate Pickup Token
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 48 * 3600000).toISOString();
        const pickupToken = `SAFEDROP-${availableComp.code}-${order.id}-AUTH`;

        // If customer paid upfront, go straight to READY_FOR_PICKUP; if deferred, go to PAYMENT_PENDING
        const nextStatus: OrderStatus = order.paymentStatus === 'PAID' ? 'READY_FOR_PICKUP' : 'PAYMENT_PENDING';
        const note = `Deposited in ${targetHub.name}, Compartment: ${availableComp.code}. Locker locked.`;

        return {
          ...order,
          assignedHubId: hubId,
          assignedHubName: targetHub.name,
          compartmentId: availableComp.id,
          compartmentCode: availableComp.code,
          status: nextStatus,
          depositedAt: now.toISOString(),
          pickupToken,
          pickupTokenExpiresAt: expiresAt,
          pickupTokenUsed: false,
          statusHistory: [
            ...order.statusHistory,
            { status: 'PARCEL_DEPOSITED', timestamp: now.toISOString(), actor: currentUser.displayName, note },
            ...(nextStatus === 'READY_FOR_PICKUP'
              ? [{ status: 'READY_FOR_PICKUP' as OrderStatus, timestamp: now.toISOString(), actor: 'SafeDrop System', note: 'Pickup QR activated (Valid for 48 hours).' }]
              : [{ status: 'PAYMENT_PENDING' as OrderStatus, timestamp: now.toISOString(), actor: 'SafeDrop System', note: 'Awaiting customer simulated payment to activate pickup QR.' }]),
          ],
          updatedAt: now.toISOString(),
        };
      })
    );

    logAction('PARCEL_DEPOSITED', `Order #${orderId} deposited in ${targetHub.name} (Compartment: ${availableComp.code})`);
    showNotification(
      'Parcel Deposited Successfully',
      `Placed in ${targetHub.name} - Locker [${availableComp.code}]. Customer notified with 48h window.`,
      'success'
    );
  };

  // Payment simulation
  const simulatePayment = async (orderId: string, method: PaymentMethod, forceSuccess = true): Promise<boolean> => {
    // Artificial 600ms latency for real-world feel
    await new Promise((res) => setTimeout(res, 600));

    if (!forceSuccess) {
      logAction('SIMULATED_PAYMENT_FAILED', `Simulated payment attempt failed for Order #${orderId}`);
      showNotification('Payment Failed', 'Simulated transaction declined by mock card issuer. You can retry safely.', 'error');
      return false;
    }

    const txnId = `TXN-SIM-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const now = new Date();
        const isAlreadyDeposited = !!order.compartmentCode;
        const nextStatus: OrderStatus = isAlreadyDeposited ? 'READY_FOR_PICKUP' : order.status;

        return {
          ...order,
          paymentStatus: 'PAID',
          paymentMethod: method,
          paymentTransactionId: txnId,
          status: nextStatus,
          statusHistory: [
            ...order.statusHistory,
            {
              status: nextStatus,
              timestamp: now.toISOString(),
              actor: 'Simulated Payment Gateway',
              note: `Payment verified (Txn: ${txnId}). Split: Seller Rs. ${order.itemPrice}, Rider Rs. ${order.deliveryFee}, Locker Rs. ${order.lockerFee}.`,
            },
          ],
          updatedAt: now.toISOString(),
        };
      })
    );

    logAction(
      'SIMULATED_PAYMENT_SUCCESS',
      `Order #${orderId} paid via ${method} (Txn: ${txnId}). Ledger allocations recorded.`
    );
    showNotification(
      'Payment Confirmed (Simulated)',
      `Rs. ${orders.find((o) => o.id === orderId)?.totalAmount} authorized. QR code is now activated!`,
      'success'
    );
    return true;
  };

  // Single-use QR verification and locker unlock
  const verifyAndCollectParcel = (token: string): { success: boolean; message: string; order?: Order } => {
    const trimmed = token.trim();
    const order = orders.find((o) => o.pickupToken === trimmed);

    if (!order) {
      logAction('QR_VERIFICATION_REJECTED', `Invalid or unrecognized token: ${trimmed}`);
      return { success: false, message: 'Invalid QR Token. No matching order found in SafeDrop registry.' };
    }

    if (order.pickupTokenUsed || order.status === 'COLLECTED') {
      logAction('QR_REUSE_ATTEMPT_BLOCKED', `Token already redeemed for Order #${order.id}`);
      return { success: false, message: 'Security Alert: This pickup QR has already been redeemed and is now expired.' };
    }

    if (order.pickupTokenExpiresAt && new Date(order.pickupTokenExpiresAt).getTime() < Date.now()) {
      logAction('QR_EXPIRED_ATTEMPT', `Expired token attempt for Order #${order.id}`);
      return {
        success: false,
        message: 'This pickup QR has expired (48-hour pickup window elapsed). Parcel is in Admin exception hold.',
      };
    }

    if (order.paymentStatus !== 'PAID') {
      logAction('QR_PAYMENT_UNPAID', `Pickup attempt without payment for Order #${order.id}`);
      return { success: false, message: 'Payment required before locker door can open.' };
    }

    // Release compartment in hub
    if (order.assignedHubId && order.compartmentId) {
      setHubs((prev) =>
        prev.map((h) => {
          if (h.id !== order.assignedHubId) return h;
          return {
            ...h,
            availableCompartments: Math.min(h.totalCompartments, h.availableCompartments + 1),
            compartments: h.compartments.map((c) =>
              c.id === order.compartmentId ? { ...c, isOccupied: false, currentOrderId: undefined } : c
            ),
          };
        })
      );
    }

    // Mark order collected and token burned
    updateOrderStatus(order.id, 'COLLECTED', `Locker [${order.compartmentCode}] opened. Parcel successfully collected.`);
    logAction('PARCEL_COLLECTED', `Order #${order.id} collected from ${order.assignedHubName}. Compartment unlocked.`);

    return {
      success: true,
      message: `Access Granted! Compartment [${order.compartmentCode || 'A-01'}] unlocked. Please take your parcel and close the locker door.`,
      order,
    };
  };

  // Test simulation for 48h expiry
  const expirePickupManually = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: 'EXPIRED_PICKUP',
          pickupTokenExpiresAt: new Date(Date.now() - 3600000).toISOString(),
          statusHistory: [
            ...order.statusHistory,
            {
              status: 'EXPIRED_PICKUP',
              timestamp: new Date().toISOString(),
              actor: 'Automated 48h Expiry Watchdog',
              note: '48-hour pickup duration elapsed without customer retrieval. Admin review task created.',
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logAction('48H_EXPIRY_TRIGGERED', `Order #${orderId} marked EXPIRED_PICKUP. Escalated to Admin console.`);
    showNotification(
      'Pickup Expired (Simulated)',
      `Order #${orderId} pickup window expired. Sent to Admin exception review.`,
      'warning'
    );
  };

  // Support Tickets & Complaints
  const createTicket = (
    data: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'customerId' | 'customerName'>
  ) => {
    const id = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      ...data,
      id,
      customerId: currentUser.uid,
      customerName: currentUser.displayName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets((prev) => [newTicket, ...prev]);
    logAction('TICKET_CREATED', `Customer logged support ticket #${id} (${data.type})`);
    showNotification('Ticket Submitted', `Ticket #${id} received. Our operations team will review it.`, 'success');

    if (data.type === 'RETURN') {
      updateOrderStatus(data.orderId, 'RETURN_REQUESTED', `Customer requested return: ${data.reason}`);
    }
  };

  const updateTicketStatus = (
    ticketId: string,
    status: SupportTicket['status'],
    adminNotes?: string,
    refundAmount?: number
  ) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, adminNotes, simulatedRefundAmount: refundAmount, updatedAt: new Date().toISOString() } : t))
    );
    logAction('TICKET_RESOLVED', `Admin updated Ticket #${ticketId} to ${status}`);
    showNotification('Ticket Updated', `Ticket #${ticketId} is now ${status}.`, 'info');
  };

  // Chat
  const sendMessage = (orderId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      orderId,
      senderId: currentUser.uid,
      senderRole: currentUser.role,
      senderName: currentUser.displayName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    logAction('CHAT_MESSAGE_SENT', `Order #${orderId} message sent by ${currentUser.displayName}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        updateProfile,
        products,
        addProduct,
        updateProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        hubs,
        toggleHubStatus,
        orders,
        createOrder,
        updateOrderStatus,
        sellerAcceptOrder,
        sellerDispatchOrder,
        riderAcceptTask,
        riderDepositParcel,
        simulatePayment,
        verifyAndCollectParcel,
        expirePickupManually,
        tickets,
        createTicket,
        updateTicketStatus,
        chatMessages,
        sendMessage,
        auditLogs,
        activeNotification,
        clearNotification,
        firebaseConnected,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
