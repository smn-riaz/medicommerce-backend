# 🏥 MediCommerce

A modern, full-stack e-commerce web application tailored for purchasing medical and healthcare products securely. Built with Next.js, Node.js, TypeScript, and integrated with SSLCommerz for real-time payments. Includes features like prescription uploads, role-based dashboards, and email notifications for a seamless user experience.

---

## 🌐 Live Links

- 🚀 **Client App:** [https://medicommerce-client.vercel.app](https://medicommerce-client.vercel.app)
- 🌐 **Server API:** [https://medimart-server-three.vercel.app](https://medimart-server-three.vercel.app)
- 📦 **Client GitHub Repo:** [smn-riaz/medimart-6-mediCommerce-client](https://github.com/smn-riaz/medimart-6-mediCommerce-client)
- ⚙️ **Server GitHub Repo:** [smn-riaz/medimart-6-mediCommerce-server](https://github.com/smn-riaz/medimart-6-mediCommerce-server)

---

## 📸 Screenshot

![MediCommerce Banner](https://github.com/user-attachments/assets/21419087-1e0b-42cf-bb40-e0bea891b62f)

---

## 🚀 Core Features

### 👤 User Functionality
- Secure registration and login with JWT-based authentication
- Browse and search for medicines by name, brand, or type
- Real-time product filtering with advanced search capabilities
- Upload prescriptions for restricted medicines before ordering
- Add to cart and place orders with online payment via SSLCommerz
- Track order history and view statuses
- Receive order confirmation and status updates via email
- Give ratings and reviews products

### 🛒 Admin Functionality
- Admin dashboard with role-based access control
- Manage all users (view/delete/update roles)
- Add, update, or delete products (CRUD)
- Review uploaded prescriptions and approve/reject as needed
- Monitor orders and update shipping/payment statuses
- Access user feedback and testimonials

---

## 🧰 Technologies & Versions

### 🔧 Frontend
- Next.js (v15.2.4)
- TypeScript (v5.x)
- Tailwind CSS (v4.0)
- Shadcn UI Components
- Framer Motion (v12.9.4)
- Redux Toolkit (v2.6.1)

### 🛠️ Backend
- Node.js (v22.12.0)
- Express.js (v4.21.2)
- MongoDB (v6.15.0)
- Mongoose (v8.13.0)
- Bcrypt.js (v5.0.2)
- JSON Web Token - JWT (v9.0.2)
- Zod (v3.24.2) for schema validation
- Nodemailer (v6.10.1)
- SSLCommerz Payment Gateway Integration : Sslcommerz-lts (v1.1.0)

---

## 🚧 Major Challenges

1. 🔐 Securing Authentication
   - Implementing persistent login using JWT with role-based routes and token verification on both the frontend and backend.

2. 💳 Payment Gateway Integration
   - Handling secure real-time transactions with SSLCommerz and managing success/failure callbacks.

3. 🔍 Complex Search & Filtering
   - Implementing efficient search logic that filters products by multiple attributes (name, brand, type).

4. 📦 Inventory Management
   - Real-time stock validation and ensuring data consistency between orders and product availability.

5. 📄 Prescription Verification
   - Uploading, storing, and validating prescription images before approving an order for sensitive medicines.

6. 📱 Responsive UI Design
   - Ensuring a consistent user experience across mobile, tablet, and desktop using Tailwind CSS and responsive components.

7. 📧 Email Notifications
   - Sending dynamic emails with order confirmation and tracking updates using Nodemailer.

---

## 📈 Future Plans

- 💬 Real-time Chat: Integrate Socket.io for communication between users and admins
- 📦 Order Tracking: Live delivery status updates for placed orders
- 🎁 Promotions: Discount codes and promo campaigns for engagement
- 🧠 Smart Recommendations: AI-based suggestions based on user history
- 🛍️ Catalog Expansion: Add health tools, supplements, and personal care items

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js v20+
- MongoDB Atlas or Local Instance
- SSLCommerz account for sandbox/testing
- Create .env files for both client and server

### Setup

1. Clone the repositories:
   ```bash
   git clone https://github.com/smn-riaz/medimart-6-mediCommerce-client
   git clone https://github.com/smn-riaz/medimart-6-mediCommerce-server
