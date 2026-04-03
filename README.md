# AngularJS Collab Board 📋

A real-time collaboration board built with **AngularJS** and **Socket.io**. Now supports persistence!

![Frontpage of Website](frontpage.PNG)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20 or newer
- **Docker & Docker Compose**: (Highly recommended for MongoDB setup)

---

## 🛠️ Local Development (Option 1: JSON File)
*Easiest way to get started. Data is saved to `notes.json` automatically.*

1.  **Install Dependencies**
    ```bash
    npm install
    ```
2.  **Run Locally**
    ```bash
    npm start
    ```
    Access the app at: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Dockerized Development (Option 3: MongoDB)
*Professional setup using a real database and live-reload.*

1.  **Launch scaling setup**
    ```bash
    docker compose up --build
    ```
    This starts two containers:
    - **app**: Node.js with live-reload (port 3000)
    - **db**: MongoDB (port 27017)

2.  **Verify Status**
    The app logs will show `Connected to MongoDB` if the environment variable `MONGO_URI` is correctly passed.

---

## 🏗️ Production Deployment

### 1. Build the Production Image
```bash
docker build -t collab-board-prod .
```

### 2. Run in Production
For production, you should point to a managed database (like MongoDB Atlas) via environment variables.

```bash
docker run -d \
  -p 80:3000 \
  -e MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/dbname" \
  --name collab-board-site \
  collab-board-prod
```

---

## 🔧 Environment Variables
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port the app listens on | `3000` |
| `MONGO_URI` | MongoDB connection string | (Uses JSON file if empty) |

---

## 📚 Resources
- [AngularJS (Official Docs)](http://angularjs.org/)
- [Socket.io (Real-time Messaging)](https://socket.io/)