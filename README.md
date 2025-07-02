<div id="top">

<!-- HEADER STYLE: CONSOLE -->
<div align="center">

<h1 align="center">
  <br>
  <a href="http://www.amitmerchant.com/electron-markdownify"><img src="https://raw.githubusercontent.com/gnauqoa/fast-iot-fe/c8f4e737913bd522e44882d34bd66b855ba340f1/public/fast-iot-no-text.svg"alt="Markdownify" width="200"></a>
  <br>Fast IoT - Admin
  <br>
</h1>

<h4 align="center">A framework to quick start IoT project.</h4>
</div>
<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#quality-management">Quality Management</a> •
  <a href="#technical-stack">Technical Stack</a> •
  <a href="#license">License</a>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A.svg?style=flat-square&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Refine-242938.svg?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMi42NCA2LjI2TDYuMjYgMTIuNjRsMi4xMiAyLjEyTDE0Ljc2IDguMzh2Ni4xMmgyVjYuMjZoLTIuMTJ6Ii8+PC9zdmc+" alt="Refine">
  <img src="https://img.shields.io/badge/AntDesign-0170FE.svg?style=flat-square&logo=antdesign&logoColor=white" alt="Ant Design">
  <img src="https://img.shields.io/badge/Redux-764ABC.svg?style=flat-square&logo=redux&logoColor=white" alt="Redux">
  <img src="https://img.shields.io/badge/Socket.io-010101.svg?style=flat-square&logo=socketdotio&logoColor=white" alt="Socket.io">
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Casbin-0066FF.svg?style=flat-square&logoColor=white" alt="Casbin">
   <img src="https://img.shields.io/badge/ReactFlow-f56cfc.svg?style=flat-square&logo=react&logoColor=white" alt="React Flow" />
</div>

</div>

## 🧭 Overview

**FastIoT** is an open-source platform designed to simplify and accelerate the development of IoT projects — from device communication to user-facing dashboards.  
The **frontend**, built with [**Refine**](https://refine.dev/), serves as an admin panel that is not only intuitive and responsive but also **highly customizable** to fit diverse project requirements.

Key capabilities include:

- **Flexible customization** for layout, theming, access control, and data models  
- **Real-time monitoring** of IoT devices via MQTT and WebSocket integration  
- Seamless connection with the FastIoT backend for device provisioning, messaging, and analytics

This repository contains the **frontend codebase** that enables developers to rapidly prototype, deploy, and extend IoT applications using a modern, scalable React architecture.

---

## 🚀 Features

- **🔧 Highly Customizable Admin Panel**  
  Built with Refine and Tailwind, allowing developers to easily modify UI components, workflows, and access control to suit any project.

- **📡 Real-Time Monitoring**  
  Displays live status, telemetry, and events from IoT devices via MQTT (Mosquitto) and WebSocket bridges through the backend.

- **📱 Responsive Design**  
  Built with accessibility in mind and optimized for both desktop and mobile views.

- **🌐 Multi-Language Support**  
  Internationalization (i18n) out of the box for building globally accessible applications.

- **🔐 Secure by Design**  
  Integrates with the backend to support TLS 1.3, JWT authentication, and role-based access control (RBAC).

- **📦 Modular & Extendable**  
  Easy to add custom pages, dashboards, or integrate with external APIs thanks to the modular architecture powered by Refine.

## Installation

### Prerequisites

- Node.js (18 or higher)
- Git
- Access to the FastIoT backend (running at `http://localhost:3000` or a deployed instance)

### Option 1: Using Docker Compose

1. Clone the repository:
   ```bash
   git clone https://github.com/gnauqoa/fast-iot-fe.git
   ```
2. Navigate to the project directory:
   ```bash
   cd fast-iot-fe
   ```
3. Copy the Docker environment file:
   ```bash
   cp .env-example .env
   ```
4. Configure environment variables in `.env` (e.g., backend API URL).
5. Start the services:
   ```bash
   docker-compose up -d
   ```
6. The frontend will be available at `http://localhost:3001` (or the configured port).

### Option 2: Using npm

1. Clone the repository:
   ```bash
   git clone https://github.com/gnauqoa/fast-iot-fe.git
   ```
2. Navigate to the project directory:
   ```bash
   cd fast-iot-fe
   ```
3. Copy the development environment file:
   ```bash
   cp .env-example .env
   ```
4. Configure environment variables in `.env` (e.g., backend API URL).
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the development server:
   ```bash
   npm run start
   ```

## Usage

- **Admin Panel Access**: Access the admin panel via the browser at `http://localhost:4000` (or the configured port) to manage IoT devices, view real-time data, and configure system settings.
- **Device Management**: Use the interface to monitor device status, manage connections, and visualize data streams from IoT devices via MQTT.
- **Customization**: Extend the admin panel by adding new modules or integrating additional features as needed, leveraging Refine's modular architecture.

## Quality Management

- **Standards**:
  - Adheres to Material Design principles for a consistent and intuitive user experience.
  - Supports multi-language interfaces for global accessibility.
  - Ensures compatibility with popular browsers and mobile devices.
  - Complies with OWASP Top 10 for frontend security, integrating with a secure backend.
- **Control Procedures**:
  - Git-based version control with strict pull request and code review processes.
  - Automated testing (unit and integration tests) via tools like Jest or Cypress.
  - Monitoring with tools like Prometheus and Grafana (via backend integration(“ for performance tracking.
  - Role-based access control with two-factor authentication (2FA) for admin users.

## Technical Stack

- **Framework**: Refine (React-based admin panel framework)
- **UI Design**: Material Design

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
