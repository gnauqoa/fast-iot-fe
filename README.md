# Bee farm frontend

Bee Farm is an IoT application designed for beekeeping farm management. It enables real-time monitoring and control of environmental factors such as temperature, humidity, and light using sensors and actuators. Using [NestJS REST API](https://github.com/brocoders/nestjs-boilerplate) + [@nestjsx/crud](https://github.com/nestjsx/crud) and [Refine](https://refine.dev).

## Description <!-- omit in toc -->

Demo: [bee-farm-fe.onrender.com](https://bee-farm-fe.onrender.com)

### Software Repositories

Backend repo: [github.com/gnauqoa/bee-farm-be](https://github.com/gnauqoa/bee-farm-be)

Frontend repo: [github.com/gnauqoa/bee-farm-fe](https://github.com/gnauqoa/bee-farm-fe)

### Hardware Repositories

Gateway board repo: [github.com/gnauqoa/bee-farm-esp](https://github.com/gnauqoa/bee-farm-esp)

Driver board repo: [github.com/gnauqoa/bee-farm-arduino](https://github.com/gnauqoa/bee-farm-arduino)

## Table of Contents <!-- omit in toc -->

- [Bee farm frontend](#bee-farm-frontend)
    - [Software Repositories](#software-repositories)
    - [Hardware Repositories](#hardware-repositories)
  - [Features](#features)
  - [Setup \& Installation](#setup--installation)
  - [License](#license)

## Features

- **Real-Time Monitoring**: Track temperature, humidity, and light levels within the beekeeping environment with MQTT for hardware device and websocket for web client.
- **Actuator Control**: Adjust environmental conditions using actuators like incandescent lights, misting machines, and LED lights.
- **Data Storage**: All sensor data is stored in a PostgreSQL database for historical analysis and reporting.
- **User Interface**: An easy-to-use web interface to monitor and control the farm remotely.

## Setup & Installation

1. Clone the backend repository:

   ```bash
   git clone https://github.com/gnauqoa/bee-farm-fe.git
   cd bee-farm-fe
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables for the backend (e.g., database credentials, sensor settings).
4. ```bash
   cp env-example .env
   ```

5. Run the backend:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
