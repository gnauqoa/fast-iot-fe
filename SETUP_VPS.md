# VPS Setup Guide with SSL (Nginx)

This guide will walk you through setting up a complete Node.js application on a VPS with SSL encryption using Nginx as a reverse proxy. The setup supports both domain-based and IP-based SSL configurations.

## Prerequisites

- Ubuntu VPS (20.04 LTS or later recommended)
- Root or sudo access
- Domain name (optional, for domain-based SSL)
- Basic knowledge of Linux command line

## Table of Contents

1. [Initial VPS Setup](#initial-vps-setup)
2. [SSL Setup - Option A: With Domain Name](#ssl-setup---option-a-with-domain-name)
3. [Application Deployment](#application-deployment)
4. [Firewall Configuration](#firewall-configuration)

## Initial VPS Setup

### Step 1: Update System and Install Dependencies

```bash
sudo apt update

# Install Fish shell (optional but recommended)
sudo apt install fish -y

sudo apt install vim
```

### Step 2: Install Docker

Docker will be used to containerize your application:

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"

apt-cache policy docker-ce

sudo apt install docker-ce

sudo systemctl start docker
sudo systemctl enable docker

docker --version
```

Copy the output and add it to your GitHub SSH keys in Settings > SSH and GPG keys.

## SSL Setup - Option A: With Domain Name

Choose this option if you have a domain name pointing to your VPS.

### DNS Record Setup

Before proceeding with Nginx setup, make sure your domain DNS records are correctly configured to point to your VPS IP address.

| Type | Host           | Value (Your VPS IP) | TTL  |
| ---- | -------------- | ------------------- | ---- |
| A    | domain.example | YOUR_VPS_IP         | 3600 |
| A    | api            | YOUR_VPS_IP         | 3600 |
| A    | www            | YOUR_VPS_IP         | 3600 |

Replace `YOUR_VPS_IP` with the actual public IP address of your VPS.

### Step 1: Install Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx
```

### Step 2: Install Certbot for Let's Encrypt SSL

```bash
# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y

# Verify Certbot installation
certbot --version
```

### Step 3: Obtain SSL Certificate

Replace `DOMAIN_NAME` with your actual domain:

```bash
# Obtain SSL certificate for your domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Verify certificates
sudo certbot certificates
```

### Step 4: Configure Nginx for Frontend

#### Frontend Configuration (Port 4000)

```bash
sudo vim /etc/nginx/sites-available/domain.example
```

```nginx
server {
    listen 80;
    server_name domain.example www.domain.example;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.domain.example;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

```

### Step 5: Enable Sites and Reload Nginx

```bash
sudo ln -s /etc/nginx/sites-available/domain.example /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Issue SSL Certificates

```bash
sudo certbot --nginx -d domain.example -d www.domain.example
sudo certbot --nginx -d api.domain.example
```

## Application Deployment

### Step 1: Clone and Setup Backend

```bash
# Clone your repository
git clone https://github.com/gnauqoa/fast-iot-be
cd fast-iot-be

# Copy environment file
cp env.docker.example .env
```

### Step 2: Start the Backend

If you are using ARM chip:

```bash
cp ./docker-compose.arm.yaml ./docker-compose.yaml
```

### Step 3: Clone and Setup Frontend

```bash
# Clone your repository
git clone https://github.com/gnauqoa/fast-iot-fe
cd fast-iot-fe

# Copy environment file
cp env.example .env
```

Remember update VITE_API_URL and VITE_ALLOWED_HOSTS in .env file

### Step 4: Start the Frontend

```bash
npm run docker:start
```

## Firewall Configuration

Configure UFW (Uncomplicated Firewall) to secure your VPS:

```bash
# Allow SSH (important: do this first!)
sudo ufw allow OpenSSH

# Allow HTTP traffic
sudo ufw allow 80

# Allow HTTPS traffic
sudo ufw allow 443

# Allow MQTT port (optional)
sudo ufw allow 1883/tcp

# Enable firewall
sudo ufw enable

# Check firewall status
sudo ufw status
```
