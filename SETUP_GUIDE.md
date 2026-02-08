# TravelPartner Platform - Complete Setup Guide

This guide will help you set up and run the complete TravelPartner platform with all three components.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.12.1 or higher)
- **npm** (v8.19.2 or higher)
- **MongoDB** (for the API service)
- **Redis** (optional, for the API service)

## 🏗️ Architecture Overview

The platform consists of three main services:

1. **API Service** (`api-main`) - Backend API running on port 3005
   - Node.js + Express
   - MongoDB database
   - Handles all business logic and data

2. **Admin Panel** (`admin-panel-main`) - Admin dashboard on port 3000
   - Next.js React application
   - Manage users, bookings, and settings

3. **User Panel** (`user-panel-main`) - User-facing application on port 3001
   - Next.js React application
   - Public-facing booking interface

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

Run the setup script to install all dependencies:

```bash
# Make the script executable
chmod +x setup.sh

# Run the setup
./setup.sh
```

Then start all services:

```bash
# Make the script executable
chmod +x run.sh

# Start all services
./run.sh
```

### Option 2: Manual Setup

#### Step 1: Setup API Service

```bash
cd api-main

# Create environment file from template
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
#   - PORT=3005
#   - DATABASE_URI=mongodb://localhost:27017/travelpartner
#   - REDIS_URL=redis://localhost:6379
#   - BASE_URL=http://localhost:3005
#   - ADMIN_URL=http://localhost:3000
#   - FRONT_URL=http://localhost:3001

# Install dependencies
npm install

# Start the API service (development mode)
npm run dev
```

#### Step 2: Setup Admin Panel

```bash
cd admin-panel-main

# Create environment file from template
cp .env.example .env.local

# Edit .env.local with:
#   NEXT_PUBLIC_API_BASE_URL=http://localhost:3005

# Install dependencies
npm install

# Start the admin panel (development mode)
npm run dev
```

#### Step 3: Setup User Panel

```bash
cd user-panel-main

# Create environment file from template
cp .env.example .env.local

# Edit .env.local with:
#   NEXT_PUBLIC_API_BASE_URL=http://localhost:3005
#   NEXT_PUBLIC_CRYPTOSECRETKEY=1234567812345678
#   NEXT_PUBLIC_TASK_COUNT=30

# Install dependencies
npm install

# Start the user panel (development mode on different port)
npm run dev
```

## 🌐 Accessing the Services

Once all services are running:

- **API Service**: http://localhost:3005
- **Admin Panel**: http://localhost:3000
- **User Panel**: http://localhost:3001

## 🔧 Troubleshooting

### Port Conflicts

If you get port conflicts, you can change the ports:

**For Admin Panel:**
```bash
cd admin-panel-main
PORT=3002 npm run dev
```

**For User Panel:**
```bash
cd user-panel-main
PORT=3003 npm run dev
```

### Puppeteer/Chrome Download Issues

If you encounter issues with Puppeteer trying to download Chrome during installation:

```bash
# Skip Puppeteer Chromium download
export PUPPETEER_SKIP_DOWNLOAD=true

# Then install dependencies
cd api-main
npm install
```

The setup script automatically sets this variable, but if you're installing manually, you may need to set it.

### Database Connection Issues

Make sure MongoDB is running:
```bash
# On Linux/Mac
sudo systemctl start mongodb
# or
mongod

# On Windows
net start MongoDB
```

### Missing Dependencies

If you encounter missing dependencies:
```bash
# In each service directory
rm -rf node_modules package-lock.json
npm install
```

## 📦 Production Build

To build for production:

```bash
# API Service
cd api-main
npm run prod

# Admin Panel
cd admin-panel-main
npm run build
npm start

# User Panel
cd user-panel-main
npm run build
npm start
```

## 🛠️ Development Tips

1. **Hot Reload**: All services support hot reload in development mode
2. **Logs**: Check console output for each service for debugging
3. **Environment Variables**: Keep sensitive data in .env files (never commit these!)
4. **API Endpoints**: The API service exposes endpoints at `/api/*` and `/app/*`

## 📝 Environment Variables Reference

### API Service (api-main/.env)
```
PORT=3005
DATABASE_URI=mongodb://localhost:27017/travelpartner
REDIS_URL=redis://localhost:6379
BASE_URL=http://localhost:3005
ADMIN_URL=http://localhost:3000
FRONT_URL=http://localhost:3001
TASK_COUNT=30
NODE_ENV=development
```

### Admin Panel (admin-panel-main/.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3005
```

### User Panel (user-panel-main/.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3005
NEXT_PUBLIC_CRYPTOSECRETKEY=1234567812345678
NEXT_PUBLIC_TASK_COUNT=30
```

## 🤝 Contributing

When contributing to this project:
1. Create a feature branch
2. Make your changes
3. Test all three services
4. Submit a pull request

## 📧 Support

For issues or questions, please create an issue in the repository.
