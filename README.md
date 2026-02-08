# TravelPartner Golb

This repository contains the complete source code for the TravelPartner platform.

## 🚀 Quick Start

**New here?** Check out the [QUICK_START.md](QUICK_START.md) guide for fast setup with all localhost links!

## Projects
- **admin-panel-main** – Admin dashboard
- **api-main** – Backend API service
- **user-panel-main** – User-facing web application

## Tech Stack
- Frontend: React / Next.js
- Backend: Node.js
- Database: Configured via environment variables

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.12.1 or higher)
- npm (v8.19.2 or higher)
- MongoDB (for database)

## Getting Started

### Quick Start Guide

Each folder is an independent project that needs to be set up separately.

#### 1. Setup Backend API (Port 5000)

```bash
cd api-main
npm install
npm run dev
```

The API will be available at: **http://localhost:5000**

#### 2. Setup Admin Panel (Port 3000)

```bash
cd admin-panel-main
npm install
npm run dev
```

The Admin Panel will be available at: **[http://localhost:3000](http://localhost:3000)**

- Default login route: [http://localhost:3000/login](http://localhost:3000/login)
- After login, dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

#### 3. Setup User Panel (Port 3001)

Since both frontend panels use port 3000 by default, you'll need to run the user panel on a different port:

```bash
cd user-panel-main
npm install
PORT=3001 npm run dev
```

The User Panel will be available at: **[http://localhost:3001](http://localhost:3001)**

- Login page: [http://localhost:3001/login](http://localhost:3001/login)
- Register page: [http://localhost:3001/register](http://localhost:3001/register)

### Environment Variables

Make sure to configure the necessary environment variables for each project:

- **api-main**: Create appropriate `.env` file based on your environment
- **admin-panel-main**: Configure `NEXT_PUBLIC_API_BASE_URL` to point to your API (e.g., `http://localhost:5000`)
- **user-panel-main**: Configure `NEXT_PUBLIC_API_BASE_URL` to point to your API (e.g., `http://localhost:5000`)

### Running Multiple Services

To run the complete platform, you need to start all three services:

1. **Terminal 1**: Backend API
   ```bash
   cd api-main && npm run dev
   ```

2. **Terminal 2**: Admin Panel
   ```bash
   cd admin-panel-main && npm run dev
   ```

3. **Terminal 3**: User Panel
   ```bash
   cd user-panel-main && PORT=3001 npm run dev
   ```

## Access Points

Once all services are running:

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | http://localhost:5000 | REST API endpoints |
| Admin Panel | [http://localhost:3000](http://localhost:3000) | Admin dashboard and management |
| User Panel | [http://localhost:3001](http://localhost:3001) | User-facing booking application |

## Features

### Admin Panel
- User management
- Booking management
- Premium membership handling
- Financial transactions (deposits, withdrawals)
- **Login History & Activity Logs** - Track admin logins and activities
  - See [admin-panel-main/LOGGING.md](admin-panel-main/LOGGING.md) for detailed logging documentation

### User Panel
- Hotel and homestay booking
- User registration and authentication
- Wallet management
- Booking history
- Event and offers viewing

## Development

### Building for Production

For each project:

```bash
cd [project-folder]
npm run build
npm start
```

### Linting

```bash
cd [project-folder]
npm run lint
```

## Troubleshooting

### Port Already in Use

If you see "Port 3000 is already in use", you can either:
- Stop the other service using port 3000
- Run on a different port: `PORT=3001 npm run dev`

### API Connection Issues

Ensure that:
1. The backend API is running on the correct port
2. Environment variables are properly configured with the correct API URL
3. CORS is properly configured in the backend

## Support

For issues or questions:
- Check project-specific README files in each folder
- Review the logging documentation for admin features
- Ensure all prerequisites are installed
