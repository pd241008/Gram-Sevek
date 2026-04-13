# 👨‍🌾 GramSevak — Digital Village Governance Platform
**Next.js | Python (FastAPI) | TypeScript | Node.js (Express) | MongoDB**

GramSevak is a lightweight, community-first governance platform designed to bridge the gap between villagers and local administration — eliminating bureaucracy, paperwork, and terminal friction in village governance.

> Empower your village → Resolve complaints instantly → Transparent governance.

---

## 🚀 Why GramSevak?
Traditional village administration often suffers from slow response times, lack of transparency, and heavy physical paperwork. Villagers often travel long distances just to report simple issues like water leakage or road damage.

GramSevak solves this by providing:
- 🗂️ **Complaint Manager**: Submit and track complaints with real-time status updates and multi-media support.
- 🧠 **NLP Intelligence**: Auto-categorization of grievances using Natural Language Processing.
- 🖥️ **Role-Based Dashboards**: Tailored experiences for **Villagers** (Citizens) and **Gram Sevaks** (Administrators).
- ⚙️ **Transparent Workflow**: Automated status history logging and clear accountability for pending tasks.

---

## 🔥 Features & Capabilities
- ✍️ **Dual Registration**: Submit complaints via Text or **Voice** (Metadata Ready).
- 🏷️ **Smart Categorization**: Automatically routes issues to Water, Road, or Electricity departments.
- 🔍 **Real-time Tracking**: Monitor resolution progress using unique Complaint IDs.
- 📜 **Audit Trails**: Full status history logging for every grievance.
- 🧩 **Modular Architecture**: Clean separation between Auth, Backend, and Frontend services.

---

## 👥 Roles & Workflows

### 👤 Client (Villager)
*   **Report**: Create new complaints (Text/Voice).
*   **Track**: View the live status of submitted issues.
*   **History**: Access personal history of village interactions.

### 👮 Admin (Gram Sevak)
*   **Overview**: Centralized dashboard to view all village complaints.
*   **Resolve**: Update status (Pending → In Progress → Resolved).
*   **Log**: Manage the resolution workflow and add administrative notes.

---

## 🏗️ Technical Architecture
GramSevak uses a **Modular Microservices Architecture** for maximum scalability:

- **Frontend**: Next.js 14+ (App Router) with TypeScript and Radix UI for a premium, accessible UX.
- **Auth Service**: Node.js/Express service using Mongoose for secure user management and identity.
- **Backend API Gateway**: Python FastAPI core that handles NLP categorization and heavy data processing.
- **Database**: MongoDB for flexible, document-based storage of complaints and status history.

### 🗂️ Project Structure
```text
.
├── auth/                 # Node.js + Express (Identity & Security)
│   └── src/
│       ├── models/       # Mongoose schemas (User, Complaint)
│       ├── services/     # Auth & Business logic
│       └── controllers/  # Request handlers
├── backend/              # Python FastAPI (NLP & API Gateway)
│   └── app/
│       ├── model/        # NLP Categorization logic
│       ├── api/          # High-performance routing
│       └── main.py       # FastAPI Entry point
└── frontend/             # Next.js Web Application
    └── src/
        ├── app/          # App Router (Pages & Layouts)
        └── components/   # Reusable UI (Shadcn/UI based)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB Instance

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/pd241008/Gram-Sevek.git
cd Gram-Sevek

# Install Auth dependencies
cd auth && npm install

# Install Frontend dependencies
cd frontend && npm install

# Install Backend dependencies
cd backend && pip install -r requirements.txt
```

### 3. Environment Setup
Create a `.env` file in the **auth** directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## 📡 API Reference

### 📨 Complaints API

#### `POST /api/complaints`
Create a new grievance.
- **Headers**: `x-user-id: <USER_ID>`
- **Body**:
```json
{
  "description": "Water supply issue in ward no. 4",
  "isVoice": false
}
```

#### `PATCH /api/complaints/status` (Admin Only)
Update the status of a complaint.
- **Headers**: `x-user-id: <ADMIN_ID>`
- **Body**:
```json
{
  "complaintId": "<DB_ID>",
  "status": "resolved"
}
```

---

## 🎯 Target MVP Scope
Phase 1 focus ensures immediate impact on village communication:
- [x] ✅ **Multi-Tenant Auth**: Distinct roles and secure access control.
- [x] ✅ **Complaint Lifecycle**: Full CRUD operations for grievances.
- [x] ✅ **NLP Engine**: Automatic routing based on description text.
- [/] 🏗️ **Push Notifications**: Real-time alerts via Email/SMS.
- [ ] ⏳ **Voice Processing**: Full integration of voice-to-text reporting.
- [ ] ⏳ **Admin Analytics**: Visualizing village health metrics.

---

## 📄 License & Author
**Author**: Built with ❤️ by [@pd241008](https://github.com/pd241008)  
**License**: MIT  
**Contact**: [prahmeshpdesai@gmail.com](mailto:prahmeshpdesai@gmail.com)

*(Note: System design and logic follow clean architecture principles for long-term maintainability.)*
