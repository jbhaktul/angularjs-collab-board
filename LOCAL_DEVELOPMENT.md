# 🛠️ Local Development Guide (containerd & Rancher Desktop)

This guide explains how to run the collaboration board locally using **Rancher Desktop** configured with the **`containerd`** container engine.

---

## 📋 Prerequisites
- **Rancher Desktop** running with:
  - **Container Engine** set to `containerd` (under Preferences > Container Engine)
  - **Kubernetes** enabled (optional, only if using Section 2)

---

## 🚀 Section 1: Running with Nerdctl Compose (Recommended)
*Launches the app and MongoDB container easily using compose.*

> [!IMPORTANT]
> **Quick Start Command:**
> Run this command in your terminal within the project root directory:
> ```bash
> nerdctl compose up --build
> ```

1. **Access the Application**:
   Once the container starts successfully, open your browser to: **[http://localhost:3000](http://localhost:3000)**

---

## ☸️ Section 2: Running on Kubernetes (K3s)
*Deploys the application directly into Rancher Desktop's local Kubernetes cluster.*

1. **Build the container image** directly into the Kubernetes namespace (`k8s.io`) so that K3s can find it:
   ```bash
   nerdctl --namespace k8s.io build -t collab-board:latest .
   ```
2. **Deploy the manifest**:
   ```bash
   kubectl apply -f k8s-deployment.yaml
   ```
3. **Access the application**:
   Rancher Desktop exposes NodePorts to `localhost` automatically. Open: **[http://localhost:30080](http://localhost:30080)**
4. **Clean up**:
   ```bash
   kubectl delete -f k8s-deployment.yaml
   ```

---

## 🔧 Environment Variables Reference
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port the app listens on | `3000` |
| `MONGO_URI` | MongoDB connection string | (Uses JSON file if empty) |
