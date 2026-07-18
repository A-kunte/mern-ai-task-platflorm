#MERN AI Task Platform

## Project Overview
The AI Task Platform is a containerized, microservices-based application deployed and orchestrated using Kubernetes. It handles asynchronous task processing by decoupling the user-facing web interface from heavy backend computational workloads.

## Tech Stack
**Frontend Client**: React.js / Next.js. served via an Nginx web server container.

**Backend API**: Node.js + Express.js.

**Background Worker**: Python.

**Databases**: MongoDB for persistent storage and Redis as an in-memory message queue.

**DevOps**: Docker, Kubernetes, and Argo CD (GitOps).


## Key Features
**Authentication**: Secure user registration and login utilizing JWT-based Authentication and bcrypt password hashing.
**Asynchronous Task Processing**: Users can create AI tasks that are pushed to a Redis queue and consumed independently by a Python Worker.
**Supported Operations**: Includes text operations such as Uppercase, Lowercase, Reverse String, and Word Count.
**Security Measures**: Application includes Helmet Middleware, API Rate Limiting, and secure secrets management.

## Kubernetes & Infrastructure Design
The application is designed for high availability and fault isolation. 
**Logical Isolation**: All components are deployed within a dedicated Kubernetes namespace named `ai-task-platform`.
**Workloads**: Compute workloads are managed via Kubernetes Deployments, with internal networking handled by ClusterIP Services.
**Stability Limits**: Every container is configured with Resource Requests and Limits, alongside Liveness and Readiness Probes.
**External Routing**: Traffic is managed by a Kubernetes Ingress controller acting as an API Gateway.


## Local Setup & Development
1. **Clone the Repository**:
   ```bash
   git clone <your-application-repo-url>
   cd <repository-folder>

2. **Environment Configuration**: Create `.env` files in the frontend, backend, and worker directories based on their respective `.env.example` templates.
3. **Run with Docker Compose**:
```bash
docker compose up --build
(This starts the multi-stage Docker builds for the MERN stack and Python worker )


## GitOps Production Deployment (Argo CD)

This platform utilizes a GitOps deployment strategy.
1. Ensure your Kubernetes cluster is running and Argo CD is installed.
2. Create an Application in the Argo CD Dashboard.
3. Point the source path to the separate **Infrastructure Repository** containing the YAML manifests.
4. Enable **Auto Sync** in Argo CD to ensure the cluster automatically updates to match the Git repository state.


## CI/CD Pipeline Workflow

A complete GitHub Actions CI/CD pipeline is integrated to handle seamless updates. Upon pushing code, the pipeline automatically:
1. Runs Lint Checks.
2. Builds optimized Docker Images.
3. Pushes the built Images to Docker Hub.
4. Automatically updates the image tags in the Infrastructure Repository to trigger the Argo CD deployment sync.
