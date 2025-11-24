# SkillForge – A Full-Stack Learning Management System (LMS)

SkillForge is a modern, feature-rich Learning Management System built with **MERN stack** and powered by **Stripe** for secure payments and **Cloudinary** for media management.  
It provides an intuitive experience for learners, trainers, and admin users. The platform supports course creation, lectures, user roles, purchasing courses, dashboards, dark mode, and complete admin control.

---

## 🚀 Features

### 🔐 Authentication & User Roles
- Secure login & registration using JWT
- Role-based access: **Student, Trainer, Admin**
- Admin has full access to manage users & courses

### 📚 Courses & Lectures
- Trainers can create and manage courses
- Add/update/delete lectures
- Upload course thumbnails & lecture videos using Cloudinary
- Publish/unpublish courses

### 🛒 Payments (Stripe Integration)
- Buy courses securely via Stripe Checkout
- Webhooks update order & user data
- Purchased courses appear in Student Dashboard

### 🎓 Student Dashboard
- View purchased courses
- Track progress
- Course player with modular lectures

### 👨‍🏫 Trainer Dashboard
- Create/manage courses
- Upload lectures
- View enrolled users

### 🛑 Admin Panel (Super Admin)
- Manage **all users**, **all courses**, **all lectures**
- Delete users and auto-cleanup:
  - Their created courses  
  - Enrollment references  
  - Cloudinary media  
- Delete courses with cleanup

### 🎨 UI & UX
- Built with **React + Tailwind + ShadCN UI**
- Dark mode support
- Fully responsive design
- Confirmation dialogs for dangerous actions
- Toast notifications for user feedback

---

## 🛠️ Tech Stack

### **Frontend**
- React.js (Vite)
- Redux Toolkit + RTK Query
- Tailwind CSS
- ShadCN UI
- React Router DOM
- React Toastify

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- Stripe Payments + Webhooks
- Cloudinary media upload

### **Tools**
- Postman for API testing
- Render for deployment
- GitHub for version control

---

## 📁 Folder Structure (Simplified)
```skillforge/
│
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── features/ # Redux slices & RTK Query services
│ │ ├── pages/ # Routes
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
│
├── server/ # Backend (Node + Express)
│ ├── controllers/ # Business logic
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── middleware/ # Auth, error handling
│ ├── utils/ # Cloudinary, stripe helpers
│ ├── server.js
│ └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### **1️⃣ Clone the repository**
```sh
git clone https://github.com/your-username/skillforge.git
cd skillforge
```
## **2️⃣ Install Frontend Dependencies**
```sh
cd client
npm install
```
## **3️⃣ Install Backend Dependencies**
```sh
cd ../server
npm install
```
## **4️⃣ Setup Environment Variables**

**Create a .env file inside server:**
```ini
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
CLIENT_URL=http://localhost:5173
```
**Also create .env inside client:**
```ini
VITE_BACKEND_URL=http://localhost:5000
```
## **5️⃣ Run Backend**
```sh
cd server
npm run dev
```
## **6️⃣ Run Frontend**
```sh
cd client
npm run dev
```
## 🧪 Stripe Webhook (Important)

**Run this command to connect webhooks:**
```sh
stripe listen --forward-to http://localhost:5000/api/webhook
```
## 🧩 API Overview (Short)
**Auth Routes**
```bash
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```
**Course Routes**
```bash
POST   /api/course/create
PUT    /api/course/:id
DELETE /api/course/:id
GET    /api/course/all
```
**Payment Routes**
```bash
POST /api/payment/checkout
POST /api/webhook
```
**Admin Routes**
```bash
DELETE /api/admin/user/:id
DELETE /api/admin/course/:id
```

## 🤝 Contribution Guidelines

1. Fork the project

2. Create a new branch

3. Commit your changes

4. Open a Pull Request

## 📜 License

This project is protected under MIT License.

## ⭐ Show Some Love

If you like SkillForge, give the repository a star ⭐ on GitHub!
Your support encourages future updates and improvements.
