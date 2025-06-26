# FastIoT Frontend 🚀

## Overview

FastIoT is an open-source platform designed to simplify and accelerate the development of IoT projects. The frontend, built with **Refine** as the admin panel framework, provides a user-friendly interface for managing IoT devices, monitoring real-time data, and configuring system settings. It integrates seamlessly with the FastIoT backend to deliver an intuitive and responsive experience for developers and end-users. This repository contains the frontend codebase for FastIoT, enabling efficient management of IoT applications through a modern, scalable interface.

## Purpose and Vision

- **Purpose**: The FastIoT frontend aims to provide a streamlined, intuitive interface that simplifies the management and monitoring of IoT projects. It enables developers, especially students and startups, to interact with IoT systems without requiring deep technical knowledge, reducing the complexity of integrating and managing IoT devices.
- **Vision**: To become a leading open-source frontend for IoT development, empowering users to visualize, control, and scale IoT applications effectively. The frontend is designed to be flexible, secure, and future-ready, supporting advanced features like edge AI integration and multi-language accessibility.

## Features

- **Admin Panel**: Built with Refine, offering a responsive and intuitive interface for managing IoT devices, data streams, and system configurations.
- **Real-Time Monitoring**: Displays real-time device status and data flows using MQTT integration with the Mosquitto broker via the backend.
- **User-Friendly Design**: Follows Material Design principles, optimized for both desktop and mobile browsers, ensuring accessibility for non-technical users.
- **Multi-Language Support**: Supports multiple languages to enhance accessibility for the global open-source community.
- **Security**: Integrates with a secure backend, leveraging TLS 1.3 for data transmission and role-based access control for user management.

## Project Goals

- Provide a comprehensive open-source frontend to connect developers with IoT devices and data management systems.
- Enable rapid setup and interaction with IoT projects, minimizing configuration efforts.
- Offer a simple, easy-to-use interface for developers, particularly students and startups, to manage and prototype IoT applications.
- Enhance the flexibility and reliability of IoT systems through a modern, scalable frontend integrated with advanced technologies.

## Objectives

- Develop a Refine-based admin panel that integrates seamlessly with the FastIoT backend (NestJS, PostgreSQL, MongoDB, Redis, Mosquitto) for managing IoT projects.
- Optimize the user experience with an intuitive, responsive interface that requires minimal technical expertise.
- Support extensibility for future integrations, such as advanced IoT security features and diverse device compatibility.
- Ensure the frontend is globally accessible with multi-language support and compliance with accessibility standards.

## Success Criteria

- Developers can easily initialize and manage IoT projects through the admin panel, receiving rapid system feedback.
- The frontend operates reliably with no critical failures during development or deployment.
- The admin panel is user-friendly, intuitive, and fully functional across popular browsers and mobile devices.
- Achieves at least 75% successful IoT project management interactions within six months of launch, based on developer and tester feedback.
- Budget adherence: Total development cost not exceeding 300 million VND, with monthly operational costs under 8 million VND.

## Installation

### Prerequisites

- Node.js (v16 or higher)
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

- **Admin Panel Access**: Access the admin panel via the browser at `http://localhost:3001` (or the configured port) to manage IoT devices, view real-time data, and configure system settings.
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

This project is licensed under the MIT License. See the `LICENSE` file for details.
