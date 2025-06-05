# Authora: MERN E-commerce Web Application

## Overview
Authora is a full-featured e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js). It includes secure authentication with JWT and 2FA (OTP via Gmail SMTP), user profile management, and integrated payments via Razorpay.

---

## Features
- User registration and login with JWT authentication
- Two-factor authentication (2FA) using OTP sent via email (Gmail SMTP)
- Resend OTP and Forgot Password flows
- User profile management
- Product browsing, cart, and checkout
- Secure payments via Razorpay
- Modern, responsive UI with React and Material-UI

---

## Project Structure

```
Authora/
├── backend/
│   ├── config/           # Configuration files (e.g., email setup)
│   ├── controllers/      # Express route controllers (business logic)
│   ├── middleware/       # Custom Express middleware (e.g., auth)
│   ├── models/           # Mongoose models (MongoDB schemas)
│   ├── routes/           # Express route definitions
│   ├── server.js         # Entry point for backend server
│   ├── package.json      # Backend dependencies and scripts
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── features/     # Feature modules (e.g., authentication)
│   │   ├── layouts/      # Layout components
│   │   ├── pages/        # Main application pages (Home, Login, Register, etc.)
│   │   ├── routes/       # Route definitions
│   │   ├── services/     # API service functions
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point for React
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies and scripts
│   └── ...
├── README.md             # Project documentation
└── ...
```

---

## Backend Implementation
- **Express.js** server with RESTful API endpoints
- **MongoDB Atlas** for cloud database
- **Mongoose** for schema modeling
- **JWT** for authentication
- **Nodemailer** (Gmail SMTP) for sending OTPs
- **Joi** for input validation
- **Razorpay** integration for payments

### Key Backend Files
- `server.js`: Main server entry point, connects to MongoDB, sets up middleware and routes
- `routes/userRoutes.js`: User-related API endpoints (register, login, profile, OTP, etc.)
- `controllers/userController.js`: Business logic for user actions
- `models/userModel.js`: User schema (with password hashing, OTP fields, etc.)
- `middleware/authMiddleware.js`: JWT authentication middleware
- `config/email.js`: Nodemailer configuration for Gmail SMTP

---

## Frontend Implementation
- **React** with functional components and hooks
- **React Router** for navigation
- **Material-UI** for UI components
- **Axios** for API requests
- **Formik/Yup** for form handling and validation
- **React Toastify** for notifications
- **Razorpay** for payment integration

### Key Frontend Folders
- `src/pages/`: Main views (Home, Login, Register, Profile, Cart, Checkout, etc.)
- `src/features/authentication/`: All authentication logic (forms, OTP, hooks, services)
- `src/components/`: Reusable UI components (ProductCard, CartItem, etc.)
- `src/services/`: API service functions

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB Atlas account
- Gmail account for SMTP (for OTP)
- Razorpay account (for payments)

### Backend Setup
1. `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   - `MONGODB_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_jwt_secret`
   - `EMAIL_USER=your_gmail_address`
   - `EMAIL_PASS=your_gmail_app_password`
   - `RAZORPAY_KEY_ID=your_razorpay_key_id`
   - `RAZORPAY_KEY_SECRET=your_razorpay_key_secret`
4. Start server: `npm run dev`

### Frontend Setup
1. `cd frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

---

## API Endpoints (Sample)
- `POST /api/users/register` — Register user (with OTP)
- `POST /api/users/login` — Login (with OTP)
- `POST /api/users/verify-otp` — Verify OTP
- `POST /api/users/resend-otp` — Resend OTP
- `POST /api/users/forgot-password` — Forgot password (send OTP)
- `GET /api/users/profile` — Get user profile (auth required)

---

## License
MIT 