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

## 🚀 Quick Start

### Automated Setup (Recommended)

1. **Run the setup script** to install all dependencies:
   ```bash
   ./setup.sh
   ```

2. **Start all services** at once:
   ```bash
   ./run.sh
   ```

3. **Access the applications**:
   - API Service: http://localhost:3005
   - Admin Panel: http://localhost:3000
   - User Panel: http://localhost:3001

### Run Individual Services

To run services one at a time:
```bash
./run-individual.sh
```

Or manually:
```bash
# API Service
cd api-main
npm run dev

# Admin Panel
cd admin-panel-main
npm run dev

# User Panel
cd user-panel-main
PORT=3001 npm run dev
```

## 📚 Detailed Documentation

For detailed setup instructions, troubleshooting, and configuration options, see:
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup and configuration guide

## Setup (Manual)
Each folder is an independent project.

```bash
cd admin-panel-main
npm install
npm run dev
