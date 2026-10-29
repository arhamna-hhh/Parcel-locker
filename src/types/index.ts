export type UserRole = 'customer' | 'seller' | 'rider' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  address?: string; // Private, never sent to Rider/Seller for locker deliveries
  createdAt: string;
}

export type ProductCategory = 'shoes' | 'clothing';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number; // in PKR
  sizes: string[];
  stock: number;
  imageUrl: string;
  status: 'active' | 'out_of_stock' | 'archived';
}

export interface Compartment {
  id: string;
  code: string; // e.g. "A-01", "B-04"
  size: 'small' | 'medium' | 'large';
  isOccupied: boolean;
  currentOrderId?: string;
  updatedAt: string;
}

export interface LockerHub {
  id: string;
  name: string;
  area: string; // e.g., "Gulshan-e-Iqbal", "Clifton", "PECHS", "North Nazimabad"
  address: string;
  operatingHours: string;
  totalCompartments: number;
  availableCompartments: number;
  status: 'online' | 'maintenance' | 'offline';
  compartments: Compartment[];
}

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'SELLER_ACCEPTED'
  | 'PREPARING_PARCEL'
  | 'READY_FOR_DISPATCH'
  | 'AWAITING_RIDER'
  | 'IN_TRANSIT'
  | 'PARCEL_DEPOSITED'
  | 'PAYMENT_PENDING'
  | 'READY_FOR_PICKUP'
  | 'COLLECTED'
  | 'CANCELLED'
  | 'EXPIRED_PICKUP'
  | 'RETURN_REQUESTED'
  | 'RETURNED';

export type PaymentTiming = 'UPFRONT' | 'AFTER_DEPOSIT';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type PaymentMethod = 'DEMO_CARD' | 'DEMO_WALLET';
export type DispatchMethod = 'RIDER_PICKUP' | 'SELLER_DROPOFF';

export interface OrderItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  size: string;
  quantity: number;
  price: number; // in PKR
  imageUrl: string;
}

export interface Order {
  id: string; // e.g. "SD-8921"
  customerId: string;
  customerName: string;
  customerPhone?: string; // Private to Customer/Admin only
  customerAddress?: string; // Private to Customer/Admin only
  sellerId: string;
  sellerName: string;
  riderId?: string;
  riderName?: string;
  items: OrderItem[];
  itemPrice: number; // e.g. Rs. 600
  deliveryFee: number; // e.g. Rs. 30
  lockerFee: number; // e.g. Rs. 60
  totalAmount: number; // e.g. Rs. 690
  primaryHubId: string;
  primaryHubName: string;
  alternativeHubId: string;
  alternativeHubName: string;
  assignedHubId?: string;
  assignedHubName?: string;
  compartmentId?: string;
  compartmentCode?: string;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    actor: string;
    note?: string;
  }[];
  paymentTiming: PaymentTiming;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentTransactionId?: string;
  pickupToken?: string;
  pickupTokenExpiresAt?: string; // 48 hours from deposit
  pickupTokenUsed?: boolean;
  dispatchMethod?: DispatchMethod;
  dropoffStationId?: string;
  createdAt: string;
  updatedAt: string;
  depositedAt?: string;
  collectedAt?: string;
  returnReason?: string;
  returnStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface SupportTicket {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  type: 'COMPLAINT' | 'RETURN';
  reason: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
  adminNotes?: string;
  simulatedRefundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}
