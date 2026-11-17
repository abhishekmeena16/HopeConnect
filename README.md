# HopeConnect

> A real-time, non-monetary physical surplus redistribution platform connecting restaurants, hospitals, and community donors directly with verified shelters and NGOs for emergency relief.

[![GitHub Repo](https://img.shields.io/badge/GitHub-abhishekmeena16%2FHopeConnect-blue?logo=github)](https://github.com/abhishekmeena16/HopeConnect)
[![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20Node.js%20%7C%20Express%20%7C%20PostgreSQL%20%7C%20Prisma-green)](#-tech-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Project Overview

**HopeConnect** bridges the gap between surplus resource providers and community relief organizations. Instead of edible food, essential medical supplies, and temporary shelter equipment going to waste, HopeConnect enables immediate real-time redistribution to verified NGOs, orphanages, and old age homes.

---

## ✨ Key Features (New & Improved Version)

- **🎨 Modernized Responsive UI**: Clean aesthetic, refined dark/light color palette, fluid layout across desktop and mobile screens, and real-time toast feedback.
- **👥 Multi-Role Ecosystem**: Tailored dashboards and permissions for **6 distinct roles**:
  - `INDIVIDUAL_DONOR`: Contribute surplus groceries, clothing, and funds.
  - `RESTAURANT`: Donate daily surplus meals and perishable food batches.
  - `HOSPITAL`: Supply surplus non-prescription medical gear and first-aid kits.
  - `NGO`: Request supplies, manage distribution drives, and claim available resources.
  - `OLD_AGE_HOME`: Request specialized nutritional and eldercare support.
  - `ADMIN`: Platform moderation, verification, and audit oversight.
- **📋 Surplus Redistribution Matrix**: Log, browse, and filter physical resource donations by classification (`FOOD`, `MEDICAL_SUPPLY`, `SHELTER`) with real-time status updates (`PENDING` $\rightarrow$ `ACCEPTED` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `DELIVERED`).
- **🚨 Emergency Aid Requests Board**: Urgent broadcast channel for verified relief organizations to post high-priority resource deficits during crises.
- **🗺️ Interactive Relief Map**: Visual map interface powered by Leaflet to locate nearby drop-off hubs, active collection centers, and emergency requests.
- **💬 Direct Logistics Chat**: Real-time communication channel enabling donors and beneficiary coordinators to arrange transport and verify deliveries.
- **🏆 Impact Scorecard & Certificate Generator**: Telemetry tracking total kilograms of food saved, medical kits redistributed, and downloadable dynamic Impact Certificates.
- **🔒 Audit Trail & Accountability**: Immutable database audit log tracking every resource state transition, donor action, and delivery verification.
- **💳 Relief Funds & Security**: Secure JWT authentication, Bcrypt password hashing, Helmet security headers, Express IP rate limiting, and Razorpay integration with SHA-256 HMAC cryptographic signature verification.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Icons & UI Elements**: Lucide React, React Hot Toast
- **Maps**: Leaflet
- **HTTP Client**: Axios (with centralized interceptors & dynamic host resolution)

### Backend
- **Runtime**: Node.js & Express.js 5
- **ORM**: Prisma ORM v6
- **Database**: PostgreSQL (NeonDB serverless / local PostgreSQL)
- **Authentication**: JSON Web Tokens (JWT) & HTTP-only cookies
- **Security**: Helmet, CORS, Express Rate Limit, Express Validator
- **File Uploads**: Multer & Cloudinary
- **Payments**: Razorpay Node SDK (SHA-256 HMAC verification)

---

## 📁 Repository Structure

```text
HopeConnect/
├── client/                     # Frontend Vite + React 19 application
│   ├── public/                 # Favicons and static SVGs
│   ├── src/
│   │   ├── assets/             # Images and design assets
│   │   ├── components/         # Reusable UI modules & features
│   │   │   ├── ActivityHistory.jsx
│   │   │   ├── AidRequestsBoard.jsx
│   │   │   ├── CreateResourceForm.jsx
│   │   │   ├── EmergencyPanel.jsx
│   │   │   ├── ImpactCertificateModal.jsx
│   │   │   ├── ImpactScorecard.jsx
│   │   │   ├── LogisticsChat.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ReliefMap.jsx
│   │   ├── context/            # Global Auth & State Providers
│   │   ├── pages/              # Landing, Dashboard, Login, Register
│   │   ├── services/           # Axios API services
│   │   ├── App.jsx             # Root layout and routes
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Express.js API
│   ├── config/                 # Database and Cloudinary configuration
│   ├── controllers/            # Request handlers (auth, resources, aid, messages, payments)
│   ├── middlewares/            # JWT authentication & request validation
│   ├── prisma/                 # Prisma database schema and migrations
│   │   └── schema.prisma
│   ├── routes/                 # REST API route endpoints
│   ├── server.js               # Express application entrypoint
│   └── package.json
│
├── package.json                # Monorepo root scripts (concurrent dev runner)
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local instance or free [NeonDB](https://neon.tech) cloud database

### 2. Clone the Repository
```bash
git clone https://github.com/abhishekmeena16/HopeConnect.git
cd HopeConnect
```

### 3. Install Dependencies
```bash
# Install root, client, and server dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 4. Configure Environment Variables

**Backend (`server/.env`):**
```bash
cp server/.env.example server/.env
```
Fill in your database URL and secrets:
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL="postgresql://username:password@localhost:5432/hopeconnect?sslmode=prefer"
JWT_SECRET="your_secure_jwt_secret"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

**Frontend (`client/.env`):**
```bash
cp client/.env.example client/.env
```
```env
VITE_API_URL=http://localhost:5001/api
```

### 5. Setup Database
```bash
cd server
npx prisma generate
npx prisma db push
cd ..
```

### 6. Run the Application
From the root directory, launch both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API Gateway**: `http://localhost:5001/api`

---

## 📡 API Reference

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user across 6 roles | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile & stats | Yes |
| `GET` | `/api/resources` | List all resources with filters | No |
| `POST` | `/api/resources` | Create surplus resource listing | Yes |
| `PATCH`| `/api/resources/:id/claim` | Claim resource by verified NGO | Yes |
| `GET` | `/api/aid-requests` | View all emergency aid requests | No |
| `POST` | `/api/aid-requests` | Post new emergency aid request | Yes |
| `GET` | `/api/messages/:resourceId` | Fetch logistics conversation | Yes |
| `POST` | `/api/messages` | Send logistics message | Yes |
| `POST` | `/api/integrations/order` | Create Razorpay donation order | Yes |
| `POST` | `/api/integrations/verify` | Verify Razorpay SHA-256 signature | Yes |

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
