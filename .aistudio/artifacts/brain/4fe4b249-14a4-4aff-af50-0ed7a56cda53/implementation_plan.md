# SafeDrop PK - Privacy-Based Automated Parcel Locker Delivery System

SafeDrop PK is a modular, privacy-first automated parcel locker delivery web application designed for e-commerce in Pakistan (Karachi pilot hubs). It protects customer personal identifiable information (PII) like home addresses and phone numbers from being exposed to Sellers and Riders by utilizing automated smart locker hubs, single-use pickup QR authorization, server-authoritative role workflows, and simulated financial settlement.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions have been confirmed from your answers to shape the architecture:

- **Brand Identity Confirmed**: `SafeDrop PK - Privacy Locker Network`
- **Backend & Database Architecture Confirmed**: Full-stack Express Node.js server with atomic persistent JSON storage (`/data/storage.json`), enforcing all business rules, role-based access control (RBAC), and transactional compartment locking on the server.
- **Simulated Payment Timing Confirmed**: Dual payment options enabled in checkout. The customer can freely choose between **"Pay at Order Placement"** or **"Pay After Locker Deposit Before Pickup"**.
- **Student & Academic Context (BS IMT Project Defense)**: All technical design decisions include clear, beginner-friendly explanations and a **Roman Urdu Technical Guide** so you can confidently explain the engineering and industrial management concepts to your evaluators and professors without needing coding expertise.

---

## 1. Overview & Core Concept

### What It Does
In traditional Pakistani courier delivery, riders and third-party vendors have access to customer phone numbers, complete residential addresses, and daily movement patterns, leading to privacy and safety concerns. **SafeDrop PK** solves this by decoupling parcel delivery from customer home addresses:
1. The **Customer** buys items from a demo shop (apparel & shoes), chooses a primary and an authorized alternative smart locker hub, and provides payment either upfront or post-deposit.
2. The **Seller** prepares and dispatches the parcel with a generated delivery manifest. They see only the destination hub and package dimensions—never the customer's phone number or residential address.
3. The **Rider** collects the parcel, transports it to the authorized hub, and reserves an available compartment in real-time. Concurrent reservation conflicts are prevented by server-side locking.
4. Once deposited into the locker compartment, the customer is notified.
5. If payment was deferred, the customer completes simulated payment. Once payment is confirmed by the server, an authorized **Single-Use Pickup QR code** is unlocked (valid for 48 hours).
6. The customer visits the hub, scans the QR code at the locker terminal, the compartment unlocks, and the parcel is collected.
7. If 48 hours pass without collection, the pickup token automatically expires, the parcel enters an exception hold, and an Admin review task is triggered.

### Target Personas & Four Role Dashboards
```
┌────────────────────────────────────────────────────────────────────────┐
│                        SAFEDROP PK ROLES                               │
├─────────────────┬─────────────────┬──────────────────┬─────────────────┤
│    CUSTOMER     │     SELLER      │      RIDER       │      ADMIN      │
├─────────────────┼─────────────────┼──────────────────┼─────────────────┤
│ • Demo catalog  │ • Inventory mgmt│ • Delivery tasks │ • Hub & lockers │
│ • Multi-hub auth│ • Order packing │ • Hub navigation │ • Return reviews│
│ • Order tracking│ • Rider pickup  │ • Locker deposit │ • 48h exceptions│
│ • Pickup QR (48h│ • Station drop  │ • Hardware adapt │ • Financial ledger
│ • In-app chat   │ • Earnings book │ • Safe privacy   │ • Audit logs    │
└─────────────────┴─────────────────┴──────────────────┴─────────────────┘
```

---

## 2. User Experience & Visual Design

### Aesthetic Direction
- **Commercial Logistics Aesthetic**: Inspired by enterprise locker networks (InPost, Hive Box, DHL Packstation). Professional, dependable, crisp, and high-trust.
- **Palette (60-30-10 Rule)**:
  - `60% Neutral Canvas`: Crisp slate-white (`#F8FAFC`) with subtle contrast surfaces (`#FFFFFF`).
  - `30% Structural Elements`: Deep slate headings (`#0F172A`), muted body text (`#475569`), hairline borders (`#E2E8F0`).
  - `10% Accent Intent`: High-visibility Trust Blue (`#2563EB`) for primary CTAs and active states, Emerald Green (`#059669`) for confirmed/deposited states, and Amber (`#D97706`) for countdown warnings and payment dues.
- **Typography**:
  - Headings & Navigation: `Plus Jakarta Sans` for clean, geometric, modern industrial readability.
  - Telemetry & Financials: `font-mono tabular-nums` for PKR prices, compartment numbers (`HUB-GUL-L04`), tracking IDs (`SD-849201`), and 48-hour countdown timers.
- **Anti-Slop Discipline**:
  - **Zero-Pill Rule**: Metadata displayed as unboxed clean text separated by `·` (e.g. `Order #SD-2041 · Deposited · Gulshan Hub A`). No garish pill badge sandwiches.
  - **Top Bar Contract**: 1-row header featuring brand title, clean text links (`whitespace-nowrap`), and a role-switcher / user profile trigger.
  - **Single Elevation**: Flat, clean cards with hairline borders (`border border-slate-200`) instead of heavy, nested drop-shadow boxes.
  - **Real Photography**: High-definition studio product photographs for demo shoes & clothes, and authentic locker system photography (via `generate_image`).

### Key User Flows
1. **Public Showcase & How It Works**: Explains the 6-step privacy flow, interactive locker network map of Karachi (Gulshan, Clifton, PECHS, North Nazimabad), FAQ, and demo shop entrance.
2. **Demo Shop to Checkout**:
   - Filter by Clothes / Footwear.
   - Select size/option, add to cart.
   - Checkout displays itemized breakdown: Item Price + Rs. 30 Delivery Fee + Rs. 60 Locker Fee = Total Amount.
   - Customer chooses Primary Locker Hub and Authorized Alternative Hub.
   - Customer selects payment timing: *Pay Now* or *Pay After Deposit*.
3. **Seller Fulfillment**:
   - Seller receives order notification, reviews parcel dimensions, accepts order, packs item.
   - Chooses dispatch method: *Request Rider Pickup* or *Drop-off at Approved Station*.
4. **Rider Pickup & Deposit**:
   - Rider accepts task, picks up package, navigates to target hub.
   - Checks real-time available compartments (Small, Medium, Large).
   - Confirms deposit; locker door locks; system records timestamp and compartment occupancy.
5. **Customer Pickup & QR Activation**:
   - Customer receives notification: *"Parcel Deposited at Gulshan Hub, Locker #B-04"*.
   - If payment is due, customer clicks "Pay Rs. 690" (simulated Demo Card / Demo Wallet).
   - QR code activates instantly with dynamic 48-hour expiration timer.
   - Terminal simulation allows scanning the QR to unlock compartment and complete collection.
6. **Support & Complaints**:
   - Order-linked chat between Customer and Seller (personal numbers masked).
   - Complaint ticket creation and return request with simulated refund ledger.

---

## 3. Key Product Decisions & Trade-Offs

| Decision Area | Chosen Approach | Rationale & Trade-off |
|---|---|---|
| **Backend & API** | Integrated Express server in Node.js serving `/api/*` + Vite dev proxy | Guarantees server-authoritative privacy firewall, atomic compartment reservation locks, and single-use QR verification without relying on external cloud setup. |
| **Data Persistence** | Structured JSON database with ACID-style read/write mutex | Files stored in `/data/storage.json`. Survives restarts, fully portable for academic review, zero monthly cloud costs or quota limits. |
| **Privacy Enforcement** | Server-side data projection (PII stripping) | When a Seller or Rider requests order details, the Express server explicitly strips `customerPhone`, `customerAddress`, and payment credentials before sending the JSON response. |
| **Locker Capacity & Concurrency** | In-memory atomic locking | If two riders arrive at the same hub, the server ensures no two deliveries can reserve the same locker compartment. |
| **48-Hour Timer Policy** | Server-calculated timestamp expiry with cron/interval evaluation | Prevents client clock tampering. If `Date.now() > depositTimestamp + 48*3600*1000`, status switches to `EXPIRED_PICKUP` and creates an Admin review case. |
| **Hardware QR Simulation** | Standard JSON Web Token (JWT) / HMAC hash payload encoded as QR with simulated scanner modal | Clean, documented interface ready to plug into physical microcontroller hardware (ESP32/Raspberry Pi) or mobile scanner app in future phases. |

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (REACT + VITE)                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Navigation / Top Bar Contract / Role Switcher                    │  │
│  ├──────────────┬──────────────┬──────────────────┬─────────────────┤  │
│  │ Customer App │  Seller App  │    Rider App     │    Admin App    │  │
│  │ • Shop & Cart│ • Inventory  │ • Task List      │ • Hub Manager   │  │
│  │ • Tracking   │ • Orders     │ • Hub Status     │ • Audit Ledger  │  │
│  │ • Pickup QR  │ • Dispatch   │ • Deposit Sim    │ • Returns/Claims│  │
│  └──────┬───────┴──────┬───────┴────────┬─────────┴────────┬────────┘  │
└─────────┼──────────────┼────────────────┼──────────────────┼───────────┘
          │              │                │                  │
          ▼              ▼                ▼                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   EXPRESS API SERVER (/api/v1)                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Role & Auth Middleware (RBAC + Token Session)                   │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Privacy Projection Firewall (Strips Customer PII for 3P)         │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Business Engines:                                                │  │
│  │ • Locker Allocation & Mutex Engine (Prevent double-booking)      │  │
│  │ • Dual-Payment Timing & Allocation Ledger (Seller/Rider/Locker)  │  │
│  │ • 48-Hour Pickup Token Generation & Verification                 │  │
│  │ • Order Tracking State Machine (Strict linear transitions)       │  │
│  │ • Order-Linked Messaging & Support Tickets                       │  │
│  └──────────────────────────────┬───────────────────────────────────┘  │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│               PERSISTENT DATABASE STORE (/data/store.json)             │
│  • users (customers, sellers, riders, admins)                          │
│  • products (clothes, shoes with PKR prices, stock, sizes)             │
│  • hubs & compartments (Karachi hubs, S/M/L lockers, status)           │
│  • orders (manifest, status history, privacy-shielded delivery info)   │
│  • transactions (simulated payment records, fee allocations)           │
│  • qr_tokens (single-use hashes, issuedAt, expiresAt, status)          │
│  • messages & complaints (chat logs, return requests)                  │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & Relationships

```
CUSTOMER ─── creates ───► ORDER ─── specifies ───► PRIMARY & ALT HUB
                             │
                             ├── has ───► COMPARTMENT (Reserved by Rider)
                             │
                             ├── generates ─► PICKUP QR TOKEN (Single-use, 48h)
                             │
                             └── logs ──► FINANCIAL ALLOCATION:
                                          ├── Seller: Rs. 600 (Item)
                                          ├── Courier: Rs. 30 (Delivery)
                                          └── Locker: Rs. 60 (Locker Host)
```

---

## 5. Phased Implementation Plan

### Phase 1: Foundation & Backend Express API
- Set up Express backend server with modular routes (`/api/auth`, `/api/products`, `/api/orders`, `/api/hubs`, `/api/payments`, `/api/chat`, `/api/admin`).
- Implement persistent file storage engine in `/server/db.ts` with seeded Karachi hubs (Gulshan, Clifton, PECHS, Nazimabad) and demo products (shoes & clothing with realistic PKR pricing).
- Implement privacy sanitization middleware so Sellers and Riders never receive customer home addresses or phone numbers.
- Verify backend health endpoint and connect Vite proxy.

### Phase 2: Design System & Public Experience
- Generate authentic commercial visual assets using `generate_image` (modern parcel locker hub hero image, studio shoe photography, and apparel photography).
- Build the responsive Public Landing Page adhering to the Top Bar Contract, complete with:
  - Hero Section highlighting privacy benefits.
  - "How It Works" 6-step visual guide.
  - Interactive Karachi Locker Hub network explorer showing live compartment availability.
  - Privacy comparison matrix (Traditional Courier vs. SafeDrop PK).
  - FAQ and Support pages.

### Phase 3: Demo Store & Customer Workflow
- Product catalog with search, category filtering (Shoes vs. Clothes), and stock indicators.
- Cart drawer with live price calculation (Item + Delivery Fee + Locker Fee).
- Privacy-first Checkout:
  - Hub selector with Primary Hub and Authorized Alternative Hub confirmation.
  - Payment timing selector (*Pay Now* or *Pay After Deposit*).
  - Simulated payment gateway (Demo Card / Demo Wallet) with failure and retry handling.
- Customer Tracking & Order Center:
  - Real-time linear status timeline.
  - Single-use 48-Hour Pickup QR with countdown clock.
  - In-app Customer-to-Seller chat (with phone/address masking).
  - Complaint & Return submission modal.

### Phase 4: Seller & Rider Dashboards
- **Seller Dashboard**:
  - Live order queue (New, Packing, Ready for Dispatch).
  - Dispatch options: Rider Pickup Request vs. Approved Drop-off Station.
  - Product catalog manager (add/edit clothes/shoes, prices, sizes, stock).
  - Simulated earnings breakdown.
- **Rider Dashboard**:
  - Mobile-optimized task list showing only delivery IDs, hub locations, and parcel size.
  - Compartment selector with real-time capacity and concurrent reservation protection.
  - Deposit confirmation flow and hardware simulator.

### Phase 5: Admin Console, Verification & Academic Defense Guide
- **Admin Dashboard**:
  - Global logistics overview (active deliveries, locker utilization rates, overdue pickups).
  - Hub and compartment manager (toggle maintenance, view occupancy).
  - Return/Refund review panel and 48-hour pickup exception resolution.
  - Full audit ledger showing simulated fee allocations.
- End-to-end verification via `compile_applet` and realistic workflow testing.
- Complete documentation including the Roman Urdu Presentation Reference for BS IMT evaluation.

---

## 6. Roman Urdu Technical Reference Guide (For BS IMT Defense)

| English Term | Roman Urdu Explanation (Aasan Alfaaz Mein) | Project Role / Significance |
|---|---|---|
| **Privacy Decoupling** | *Customer ki zaati maloomat (ghar ka pata aur phone number) delivery boy aur seller se chupana.* | Rider aur Seller ko sirf locker ka pata aur parcel ka size nazar aata hai. Customer bilkul mehfooz rehta hai. |
| **Automated Locker Allocation** | *System khud check karta hai ke kon se hub mein khali compartment (dabba) mojood hai.* | Agar primary locker full ho to customer ke pehle se manzoor shuda alternative hub mein parcel deliver ho jata hai. |
| **Server-Side Authorization (RBAC)** | *Har role (Customer, Seller, Rider, Admin) ke alag alag ikhtiyaraat jo server check karta hai.* | Koi rider customer ka data nahi dekh sakta, aur koi customer admin panel access nahi kar sakta. |
| **Single-Use Pickup QR** | *Ek dafa istemal hone wala digital code jo 48 ghante tak qabil-e-qubool rehta hai.* | Jaise hi locker par QR scan hota hai, wo expire ho jata hai taake dobara koi aur parcel na nikal sake. |
| **Simulated Payment Split** | *Fake testing payment jisme total raqam 3 hisson mein taqseem hoti hai (Seller, Rider, Locker Operator).* | Yeh proof-of-concept dikhata hai ke real commercial platform par har party ko unki fees kaise milti hai. |
