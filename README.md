# 🏥 MediCommerce
## Full-Stack E-commerce for Healthcare Products

MediCommerce is a modern, full-stack e-commerce platform tailored for purchasing medical and healthcare products securely. Built using Next.js, Node.js, TypeScript, and integrated with SSLCommerz for real-time payments, MediCommerce includes features like prescription uploads, role-based dashboards, and email notifications to provide a seamless user experience.

---

## 🌐 Live Links

- 🚀 **Client App**: [MediCommerce Client](https://medicommerce-client.vercel.app)
- 🌐 **Server API**: [MediCommerce API](https://medimart-server-three.vercel.app)
- 📦 **Client GitHub Repo**: [smn-riaz/medicommerce-frontend](https://github.com/smn-riaz/medicommerce-frontend)
- ⚙️ **Server GitHub Repo**: [smn-riaz/medicommerce-backend](https://github.com/smn-riaz/medicommerce-backend)

---

## 📸 Screenshot

![MediCommerce Banner](https://github.com/user-attachments/assets/21419087-1e0b-42cf-bb40-e0bea891b62f)

---

## 🚀 Core Features

### 👤 User Functionality

- 🔐 **Secure Authentication**: Register and log in using JWT-based authentication with secure routes.
- 💊 **Product Search & Filtering**: Browse and search for medicines by name, brand, or type with real-time filtering.
- 📄 **Prescription Upload**: Upload prescriptions for restricted medicines before placing an order.
- 🛒 **Order Placement**: Add products to the cart, place orders, and pay securely via SSLCommerz.
- 📧 **Order Notifications**: Receive email confirmations and status updates for placed orders.
- ⭐ **Ratings & Reviews**: Users can rate and review products for better decision-making.

### 🛒 Admin Functionality

- 👨‍💼 **Admin Dashboard**: Access a comprehensive dashboard with role-based controls.
- 💼 **User Management**: View, update, or delete user accounts with role-based access.
- 📦 **Product Management**: CRUD operations to add, update, or delete products.
- 📝 **Prescription Approval**: Admins can review uploaded prescriptions and approve/reject them.
- 📊 **Order Monitoring**: Monitor orders and update their shipping/payment statuses.
- 🧑‍🤝‍🧑 **Customer Feedback**: Access customer feedback and testimonials for product improvement.

---

## 🧰 Technologies & Versions

### 🔧 Frontend

- **Next.js** (v15.2.4)
- **TypeScript** (v5.x)
- **Tailwind CSS** (v4.0)
- **Shadcn UI Components**
- **Framer Motion** (v12.9.4)
- **Redux Toolkit** (v2.6.1)

### 🛠 Backend

- **Node.js** (v22.12.0)
- **Express.js** (v4.21.2)
- **MongoDB** (v6.15.0)
- **Mongoose** (v8.13.0)
- **Bcrypt.js** (v5.0.2)
- **JSON Web Token - JWT** (v9.0.2)
- **Zod** (v3.24.2) for schema validation
- **Nodemailer** (v6.10.1) for email notifications
- **SSLCommerz Payment Gateway Integration** (Sslcommerz-lts v1.1.0)

---

## 🚧 Major Challenges

1. 🔐 **Securing Authentication**: Implemented JWT-based persistent login with role-based routes and token validation.
2. 💳 **Payment Gateway Integration**: Secure real-time payments using SSLCommerz, including managing success/failure callbacks.
3. 🔍 **Complex Search & Filtering**: Implemented advanced search functionality, filtering products by multiple attributes like name, brand, and type.
4. 📦 **Inventory Management**: Ensured real-time stock validation and kept product availability in sync with orders.
5. 📄 **Prescription Verification**: Implemented prescription upload and validation before confirming orders for sensitive medicines.
6. 📱 **Responsive UI Design**: Developed a responsive UI to ensure a smooth experience on mobile, tablet, and desktop using Tailwind CSS.
7. 📧 **Email Notifications**: Integrated Nodemailer to send dynamic emails for order confirmation and tracking updates.

---

## 📈 Future Plans

- 💬 **Real-time Chat**: Integrate Socket.io to enable real-time chat support between users and admins.
- 📦 **Order Tracking**: Add live delivery status updates for placed orders.
- 🎁 **Promotions**: Implement discount codes and promotional campaigns to boost engagement.
- 🧠 **Smart Recommendations**: Add AI-based product suggestions based on user history and preferences.
- 🛍️ **Catalog Expansion**: Add health tools, supplements, and personal care items to diversify the product catalog.

---

## 🛠️ Getting Started Locally

### Prerequisites
- **Node.js** (v20+)
- **MongoDB Atlas** or local MongoDB instance
- **SSLCommerz Sandbox Account** for testing payments
- Set up **.env** files for both frontend and backend

### Setup Instructions

1. Clone the repositories:
   ```bash
   git clone https://github.com/smn-riaz/medicommerce-frontend
   git clone https://github.com/smn-riaz/medicommerce-backend
