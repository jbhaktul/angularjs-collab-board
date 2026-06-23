# AngularJS Collab Board 📋

A real-time collaboration board built with **AngularJS** and **Socket.io**. Now supports persistence!

![Frontpage of Website](frontpage.PNG)

---

## 🚀 Getting Started

To get the application up and running, please refer to the appropriate guide below:

*   👉 **[Local Development Guide (LOCAL_DEVELOPMENT.md)](LOCAL_DEVELOPMENT.md)**: Steps for running locally using Rancher Desktop with the **`containerd`** container engine (both Compose via `nerdctl` and local Kubernetes via K3s).
*   👉 **[Production Deployment Guide (PRODUCTION.md)](PRODUCTION.md)**: Steps on building production-ready Docker containers and deploying them to production environments.

---

## 🔧 Environment Variables Reference
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port the app listens on | `3000` |
| `MONGO_URI` | MongoDB connection string | (Uses JSON file if empty) |

---

## 📚 Resources
- [AngularJS (Official Docs)](http://angularjs.org/)
- [Socket.io (Real-time Messaging)](https://socket.io/)