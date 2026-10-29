# SafeDrop PK – Privacy-Based Automated Parcel Locker Delivery System

SafeDrop PK is an enterprise-grade, privacy-first logistics web platform designed for Pakistani e-commerce (pilot in Karachi). It eliminates customer personal identifiable information (PII) exposure—such as residential addresses and personal phone numbers—from being disclosed to delivery riders and third-party sellers.

---

## 🌟 Key Functional Features Implemented

1. **Public Showcase & How It Works**:
   - Modern commercial logistics interface adhering to the strict 1-row Top Bar Contract.
   - 6-step interactive lifecycle explaining customer privacy protection.
   - Live Karachi Hub Network Explorer with real-time compartment availability.
   - Privacy Policy, FAQ accordion, and BS IMT Academic Defense Guide.

2. **Four Dedicated Role Dashboards**:
   - **Customer Portal**:
     - Masked profile (home address & phone protected in secure vault).
     - Live order tracking timeline with linear state progression.
     - Single-use 48-hour pickup QR code with dynamic expiration countdown.
     - In-app Seller Chat with customer contact details masked.
     - Support ticket & return request submission.
   - **Seller Merchant Console**:
     - Real-time statistics: New Orders, Packing, Ready for Dispatch, Dispatched, Delivered, and Earnings.
     - Order fulfillment: Accept order, pack parcel, and choose **Rider Pickup** or **Seller Drop-off Station**.
     - Inventory management (add/edit shoes & clothing, update stock and prices in PKR).
     - Privacy audit view showing customer PII is strictly shielded.
   - **Rider Fleet Console**:
     - Mobile-optimized delivery task cards.
     - Zero PII manifest: Displays only Delivery ID, destination hub, and parcel size.
     - Real-time locker reservation mutex with compartment size selector (Small, Medium, Large).
     - Automated compartment door deposit simulation.
   - **Admin Control Tower**:
     - Global operations monitor (occupancy rates, active deliveries, overdue pickups).
     - Terminal hub and compartment status manager (toggle maintenance/online).
     - Return/Refund approvals and simulated accounting ledger.
     - 48-Hour expired pickup exception review and resolution.

3. **Cloud Firestore Database & Security Rules**:
   - Configured via `firebase-blueprint.json` and deployed using `firestore.rules`.
   - Enforces Attribute-Based Access Control (ABAC) and role validation.
   - Synchronizes across Customer, Seller, Rider, and Admin views.

4. **Simulated Payments & Single-Use QR**:
   - Dual timing options: **Pay Now at Checkout** or **Pay After Locker Deposit Before Collection**.
   - Transparent fee split: Seller Item Price + Rs. 30 Delivery Fee + Rs. 60 Smart Locker Operator Fee.
   - Simulated Kiosk Barcode Scanner modal to test single-use pickup QR burning and door unlock.

5. **Clean Hardware Adapter Contract**:
   - Documented interface ready for connection to physical microcontroller relay hardware (ESP32/Raspberry Pi) and external 3rd-party QR APIs.

---

## 🚀 How to Run and Test the Application

### 1. Instant Persona / Role Switching
At the top right of the navigation bar, click the **Role Switcher** badge (`Customer`, `Seller`, `Rider`, or `Admin`). This lets evaluators test the full end-to-end delivery cycle seamlessly:
1. **As Customer**: Go to **Demo Shop**, add an item (e.g. linen shirt or sneakers) to your bag, choose your Primary Hub (e.g. Gulshan) and Alternative Hub (e.g. Clifton), choose *Pay After Deposit*, and place the order.
2. **As Seller**: Switch to **Seller View**. View the new order, click **Accept & Start Packing**, then click **Request Rider Pickup**.
3. **As Rider**: Switch to **Rider View**. View the pickup task, accept it, transport it to the locker, select compartment size, and click **Reserve & Deposit**.
4. **As Customer**: Switch back to **Customer View**. Notice the status updated to *Payment Pending*. Click **Authorize Payment (Rs. 690)**. Your single-use pickup QR code unlocks with a 48-hour timer!
5. **Collect Parcel**: Click **Simulate Locker Terminal Scan** to scan the QR code. The locker door unlocks, the parcel is collected, and the QR token is permanently burned.

---

## 🎓 BS IMT Project Defense Reference (Roman Urdu & English)

| Technical Concept | Aasan Roman Urdu Wazaahat (Explanation) | Industrial Engineering Significance |
|---|---|---|
| **PII Privacy Decoupling** | *Customer ka phone number aur ghar ka pata delivery boy aur seller se chupana.* | Prevents unsolicited contact and harassment; complies with consumer data privacy regulations. |
| **Last-Mile Optimization** | *Rider ko har ghar jane ke bajaye 1 central hub par 10 parcels drop karne ki sahulat.* | Eliminates missed doorstep delivery attempts (18-25% failure rate), saving courier fuel and transit time. |
| **Locker Mutex Allocation** | *System check karta hai ke dabba (locker) khali hai ya nahi, taake 2 parcels ek hi compartment mein na jayen.* | Prevents concurrent physical resource conflicts and manages inventory flow. |
| **Single-Use 48h QR Code** | *Ek dafa scan hone wala digital pass jo 48 ghante baad khud-bakhud expire ho jata hai.* | Guarantees parcel turnover so lockers are not hoarded; locks door immediately after collection. |
| **Simulated Payment Split** | *Demonstration accounting jisme raqam Seller, Rider, aur Locker Operator mein taqseem hoti hai.* | Models Pakistani digital commercial settlement without risking real financial data. |

---

## ☁️ Deployment Instructions (GitHub & Google Cloud Run)

### GitHub Setup
1. Initialize git in your local terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of SafeDrop PK Privacy Locker Network"
   git remote add origin https://github.com/<your-username>/safedrop-pk.git
   git push -u origin main
   ```

### Google Cloud Run / Container Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. The compiled static bundle is located in `/dist` and ready to be served by any Node.js Express server, Firebase Hosting, or Cloud Run container service.
