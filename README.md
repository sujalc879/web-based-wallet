# Web Wallet

A web-based wallet application built with **React** and **Vite**. The application can be run locally using Node.js or directly from the published Docker image.

## 🚀 Live Docker Image

The production-ready Docker image is available on Docker Hub:

**Docker Hub:**
https://hub.docker.com/r/sujal879/web-wallet-1

## 🐳 Run with Docker

You don't need to clone the repository or install Node.js to run the application.

### 1. Run the Docker container

```bash
docker run -d --name web-wallet -p 3000:80 sujal879/web-wallet-1:latest
```

### 2. Open the application

Open your browser and visit:

```text
http://localhost:3000
```

The application is now running inside a Docker container.

### 3. Check running containers

```bash
docker ps
```

### 4. Stop the container

```bash
docker stop web-wallet
```

### 5. Start the container again

```bash
docker start web-wallet
```

### 6. Remove the container

```bash
docker rm web-wallet
```

### Pull the image manually

Docker will automatically pull the image when it is not available locally. You can also pull it manually:

```bash
docker pull sujal879/web-wallet-1:latest
```

---

## 💻 Run Locally

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Git

### Clone the repository

```bash
git clone https://github.com/sujalc879/web-based-wallet.git
```

### Navigate to the project

```bash
cd web-based-wallet
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application will usually be available at:

```text
http://localhost:5173
```

---

## 🏗️ Build for Production

Create a production build using:

```bash
npm run build
```

The production files will be generated inside the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## 🐋 Docker Workflow

The Docker workflow for this project is:

```text
Source Code
    ↓
React + Vite
    ↓
npm run build
    ↓
dist/
    ↓
Docker Image
    ↓
Docker Hub
    ↓
Docker Container
    ↓
http://localhost:3000
```

The published image can be run on any machine that has Docker installed.

---

## 📦 Docker Image

| Item           | Value                   |
| -------------- | ----------------------- |
| Image          | `sujal879/web-wallet-1` |
| Tag            | `latest`                |
| Container Port | `80`                    |
| Host Port      | `3000`                  |

Run:

```bash
docker run -d --name web-wallet -p 3000:80 sujal879/web-wallet-1:latest
```

---

## 🛠️ Tech Stack

* React
* Vite
* JavaScript
* HTML
* CSS
* Docker
* Docker Hub

---

## 📁 Project Structure

```text
web-based-wallet/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   └── ...
│
├── dist/
├── package.json
├── package-lock.json
├── Dockerfile
└── README.md
```

> The exact structure may vary depending on the current implementation.

---

## 🔄 Updating the Docker Image

After making changes to the application, create a new production image:

```bash
docker build -t sujal879/web-wallet-1:latest .
```

Then push it to Docker Hub:

```bash
docker push sujal879/web-wallet-1:latest
```

Anyone can then run the updated image with:

```bash
docker run -d --name web-wallet -p 3000:80 sujal879/web-wallet-1:latest
```

---

## 🔍 Useful Docker Commands

List Docker images:

```bash
docker images
```

List running containers:

```bash
docker ps
```

List all containers:

```bash
docker ps -a
```

View container logs:

```bash
docker logs web-wallet
```

Follow container logs:

```bash
docker logs -f web-wallet
```

Open a shell inside the container:

```bash
docker exec -it web-wallet sh
```

---

## 🧹 Cleanup

Remove the container:

```bash
docker rm -f web-wallet
```

Remove the Docker image:

```bash
docker rmi sujal879/web-wallet-1:latest
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Push the branch
6. Open a Pull Request

---

## 📄 License

This project is available for educational and development purposes.

---

## 👨‍💻 Author

**Sujal Chaudhary**

GitHub:
https://github.com/sujalc879

Docker Hub:
https://hub.docker.com/r/sujal879/web-wallet-1
