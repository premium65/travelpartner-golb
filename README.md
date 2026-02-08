# TravelPartner Golb

This repository contains the complete source code for the TravelPartner platform.

## Projects
- **admin-panel-main** – Admin dashboard
- **api-main** – Backend API service
- **user-panel-main** – User-facing web application

## Tech Stack
- Frontend: React / Next.js
- Backend: Node.js
- Database: Configured via environment variables

## Features

### Admin Panel
- User management
- Booking management
- Premium membership handling
- Financial transactions (deposits, withdrawals)
- **Login History & Activity Logs** - Track admin logins and activities
  - See [admin-panel-main/LOGGING.md](admin-panel-main/LOGGING.md) for detailed logging documentation

## Setup
Each folder is an independent project.

```bash
cd admin-panel-main
npm install
npm run dev
