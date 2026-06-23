# 🏗️ Production Deployment Guide

This guide explains how to package, build, and deploy the collaboration board for production environments.

---

## 📦 1. Build the Production Image
To build a production-ready Docker image of the application, execute:

```bash
docker build -t collab-board-prod .
```

This uses the [Dockerfile](file:///c:/PROJECTS/angularjs-collab-board/Dockerfile) which installs dependencies and copies the application files.

---

## 🚀 2. Running in Production
For production deployment, it is highly recommended to use a managed database service (such as MongoDB Atlas) instead of a containerized database.

To run the container in production pointing to your external database:

```bash
docker run -d \
  -p 80:3000 \
  -e MONGO_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname" \
  --name collab-board-site \
  collab-board-prod
```

### Key Parameters:
- **`-p 80:3000`**: Maps port 80 (standard HTTP) on the host machine to port 3000 inside the container.
- **`-e MONGO_URI`**: Sets the MongoDB connection string to your production database cluster.
- **`--name`**: Gives the running container a friendly name.

---

## 🔒 3. Production Best Practices
1. **Database Credentials**: Never hardcode MongoDB credentials in the Dockerfile. Always pass them via the `MONGO_URI` environment variable at runtime.
2. **Reverse Proxy**: It is recommended to run the app behind a reverse proxy like Nginx or AWS ALB to handle SSL termination (HTTPS) and load balancing.
3. **Scaling**: The application uses Socket.io. If you plan to scale horizontally to multiple app containers, you must configure a Socket.io Redis adapter to sync real-time events across instances.
