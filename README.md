# 🏗️ Gram Complaint Management System

A scalable and modular **TypeScript + Express + MongoDB** backend for a complaint management system designed for **Villagers (Clients)** and **Gram Sevak (Admins)**.

---

## 🚀 Tech Stack

* **Node.js**
* **Express.js**
* **TypeScript**
* **MongoDB + Mongoose**
* **Zod (Validation)**

---

## 📂 Project Structure

```text
.
├── auth/                 # Node.js + Express Backend (Complaints)
│   └── src/
│        ├── config/      # Database connection
│        ├── models/      # Mongoose schemas
│        ├── schemas/     # Zod validation schemas
│        ├── services/    # Business logic
│        ├── controllers/ # Request handlers
│        ├── routes/      # API routes
│        ├── utils/       # Helper functions
│        ├── app.ts       # Express app setup
│        └── server.ts    # Entry point
│
├── backend/              # Python FastAPI (Microservice API Gateway)
│   └── app/
│        ├── api/         # API Routing
│        ├── controllers/ # Request handlers
│        ├── core/        # Core configuration & startup
│        ├── middlewares/ # Middleware functions
│        ├── model/       # AI/NLP Models & logic
│        ├── services/    # Business logic
│        ├── utils/       # Helper functions
│        └── main.py      # FastAPI entry point
│
└── frontend/             # Next.js Web Application
    └── src/
         ├── app/         # Next.js App Router (Pages & Layouts)
         ├── components/  # Reusable UI components
         └── lib/         # Utility functions & configs
```

---

## 👥 Roles

### 👤 Client (Villager)

* Register complaints (Text / Voice)
* Track complaint status using Complaint ID

### 👨‍💼 Admin (Gram Sevak)

* View all complaints
* Update complaint status
* Manage resolution workflow

---

## ⚙️ Features

* 📝 Complaint Registration
* 🎤 Voice Complaint Support (Metadata Ready)
* 🧠 NLP-based Categorization
* 📊 Complaint Status Tracking
* 🔄 Status History Logging
* 🧩 Modular Clean Architecture

---

## 🔌 Installation

```bash
git clone https://github.com/pd241008/Gram-Sevek.git
cd Gram-Sevek

npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## ▶️ Run the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

---

## 🌐 API Endpoints

### 📌 Complaint Routes

#### ➕ Create Complaint

```http
POST /api/complaints
```

**Headers:**
```headers
x-user-id: <USER_ID>
```

**Body:**
```json
{
  "description": "Water supply issue in my area",
  "isVoice": false
}
```

---

#### 📄 Get All Complaints

```http
GET /api/complaints
```

---

#### 🔄 Update Complaint Status (Admin)

```http
PATCH /api/complaints/status
```

**Headers:**
```headers
x-user-id: <ADMIN_ID>
```

**Body:**
```json
{
  "complaintId": "<DB_ID>",
  "status": "resolved"
}
```

---

## 🧠 NLP Categorization Logic

Complaints are automatically categorized based on keywords:

* "water" → Water Department
* "road" → Road Department
* "electricity" → Electricity Department

---

## 🗄️ Database Design

### Collections:

* **Users** (Client/Admin)
* **Complaints**
* **StatusHistory**
* **NLP Logs (Optional)**

---

## 🔄 System Flow

```text
Client → API → Validation → Service → Database → Response
```

---

## 🧪 Testing

Use tools like:

* Postman
* Thunder Client

---

## 📈 Future Enhancements

* 🔐 Authentication (JWT / OAuth)
* 📁 File Upload (Voice Storage)
* 🔔 Notifications System
* 📊 Admin Analytics Dashboard
* ☁️ Deployment (Docker + CI/CD)

---

## 🤝 Contribution

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Submit a Pull Request

---

## 🏁 Conclusion

This backend follows **clean architecture principles**, ensuring scalability, maintainability, and easy integration with any frontend (Next.js, React, Mobile Apps).

---

## 📧 Contact

For queries or collaboration:

* **Name**: Prathmesh
* **Email**: prahmeshpdesai@gmail.com
* **GitHub**: [github.com/pd241008](https://github.com/pd241008)

*(Note: Please update the contact information with your exact details if needed!)*
