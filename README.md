# 🚀 AI-Based Employee Performance Analytics & Recommendation System

A full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations using OpenRouter (OpenAI-compatible) API. Developed as part of the B.Tech 4th SEMESTER ESE EXAMINATION (AI Driven Full Stack Development - AI308B).

## 🔗 Repository
- **GitHub:** [https://github.com/Xnirc/ESE-Employee-practice-](https://github.com/Xnirc/ESE-Employee-practice-)

---

## ✨ Features

### Frontend (React & Vite)
- **Premium UI:** Glassmorphism design, vibrant color palettes, and modern aesthetics using Vanilla CSS.
- **Authentication:** Secure Registration and Login portal.
- **Dashboard:** Protected route displaying a directory of employees.
- **Search & Filter:** Find employees by department instantly.
- **Employee Management:** Add new employees to the database.
- **AI Analytics Page:** Generate comprehensive AI reports, feedback, and rankings for employees.

### Backend (Node.js & Express)
- **RESTful API Architecture:** Clean separation of Routes, Controllers, and Models.
- **MongoDB & Mongoose:** Structured data schemas for Employees and Users.
- **JWT Authentication:** Secure API endpoints, protecting user data via Bearer tokens.
- **Bcrypt Security:** Password hashing for secure database storage.
- **AI Integration:** Communication with OpenRouter API for intelligent performance analytics.

---

## 🛠️ Technology Stack
- **Frontend:** React, Vite, CSS3 (Glassmorphism), Axios, Lucide React (Icons).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas.
- **Security:** JSON Web Tokens (JWT), bcryptjs.
- **AI Integration:** OpenRouter API (OpenAI models).

---

## 🔌 API Endpoints Reference

### Auth Routes
- `POST /api/auth/register` - Register a new admin user
- `POST /api/auth/login` - Authenticate and receive JWT token

### Employee Routes (Protected by JWT)
- `POST /api/employees` - Add a new employee
- `GET /api/employees` - Fetch all employees
- `GET /api/employees/search?department=...` - Search employees by department
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Remove employee

### AI Routes (Protected by JWT)
- `POST /api/ai/recommend` - Generate AI recommendations (Expects `employeeId` in body, or returns ranking if empty)

---

## 💻 Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Xnirc/ESE-Employee-practice-.git
   cd ESE-Employee-practice-
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
   Start the backend:
   ```bash
   npm start
   ```

3. **Frontend Setup:**
   Open a new terminal.
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

4. **Access the App:**
   Open `http://localhost:5173` (or the port Vite provides) in your browser.

---
*Developed for ESE Examination AI308B Submission.*
