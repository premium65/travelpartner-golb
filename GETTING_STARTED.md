# Getting Started Checklist

Use this checklist to successfully set up and run the TravelPartner platform.

## ☑️ Pre-Installation Checklist

- [ ] **Node.js v18.12.1+** installed and accessible in PATH
- [ ] **npm v8.19.2+** installed and accessible in PATH
- [ ] **MongoDB** installed and ready to run (required for API service)
- [ ] **Redis** installed (optional, but recommended for API service)
- [ ] **Git** installed (if cloning from repository)

### Verify Prerequisites

Run these commands to verify:
```bash
node -v    # Should show v18.12.1 or higher
npm -v     # Should show v8.19.2 or higher
mongod --version  # Should show MongoDB installed
```

## ☑️ Installation Checklist

### Step 1: Clone/Download Repository
- [ ] Repository downloaded or cloned to your local machine
- [ ] Navigate to the project root directory in terminal

### Step 2: Run Setup Script
- [ ] Execute setup script: `./setup.sh` (Linux/Mac) or `setup.bat` (Windows)
- [ ] Wait for all dependencies to install (this may take several minutes)
- [ ] Verify no fatal errors occurred (warnings are okay)

### Step 3: Configure Environment Variables

#### API Service Configuration
- [ ] Open `api-main/.env` file
- [ ] Set `PORT=3005` (or your preferred port)
- [ ] Set `DATABASE_URI` to your MongoDB connection string
  - Default: `mongodb://localhost:27017/travelpartner`
- [ ] Set `REDIS_URL` if using Redis
  - Default: `redis://localhost:6379`
- [ ] Set `BASE_URL=http://localhost:3005`
- [ ] Set `ADMIN_URL=http://localhost:3000`
- [ ] Set `FRONT_URL=http://localhost:3001`
- [ ] Save the file

#### Admin Panel Configuration
- [ ] Open `admin-panel-main/.env.local` file
- [ ] Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:3005`
- [ ] Save the file

#### User Panel Configuration
- [ ] Open `user-panel-main/.env.local` file
- [ ] Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:3005`
- [ ] Set `NEXT_PUBLIC_CRYPTOSECRETKEY=1234567812345678` (or your secret key)
- [ ] Set `NEXT_PUBLIC_TASK_COUNT=30` (or your preferred count)
- [ ] Save the file

### Step 4: Start Required Services
- [ ] **Start MongoDB**:
  - Linux/Mac: `sudo systemctl start mongodb` or `mongod`
  - Windows: `net start MongoDB`
- [ ] **Start Redis** (optional):
  - Linux/Mac: `redis-server`
  - Windows: Run redis-server.exe
- [ ] Verify services are running:
  ```bash
  # Check MongoDB
  mongo --eval "db.version()"
  
  # Check Redis (if using)
  redis-cli ping  # Should return PONG
  ```

## ☑️ Running the Platform

### Option A: Run All Services Together (Recommended for Development)
- [ ] Execute: `./run.sh` (Linux/Mac) or `run.bat` (Windows)
- [ ] Wait 10-20 seconds for all services to start
- [ ] Check that no error messages appear

### Option B: Run Services Individually
- [ ] Execute: `./run-individual.sh` (Linux/Mac)
- [ ] Or run manually:
  ```bash
  # Terminal 1: API Service
  cd api-main && npm run dev
  
  # Terminal 2: Admin Panel
  cd admin-panel-main && npm run dev
  
  # Terminal 3: User Panel
  cd user-panel-main && PORT=3001 npm run dev
  ```

## ☑️ Verification Checklist

### Verify Services Are Running
- [ ] **API Service** is accessible at http://localhost:3005
  - Test: Open browser and visit http://localhost:3005
  - Expected: "Successfully Testing" message or API response
- [ ] **Admin Panel** is accessible at http://localhost:3000
  - Test: Open browser and visit http://localhost:3000
  - Expected: Admin login or dashboard page loads
- [ ] **User Panel** is accessible at http://localhost:3001
  - Test: Open browser and visit http://localhost:3001
  - Expected: User-facing website loads

### Check Logs (if using ./run.sh)
- [ ] Check API logs: `tail -f logs-api.log`
  - Look for: "server is running on port 3005"
  - No fatal errors
- [ ] Check Admin logs: `tail -f logs-admin.log`
  - Look for: "ready" or "started server" message
  - No fatal errors
- [ ] Check User logs: `tail -f logs-user.log`
  - Look for: "ready" or "started server" message
  - No fatal errors

### Test Basic Functionality
- [ ] API Service responds to requests
- [ ] Admin Panel can connect to API
- [ ] User Panel can connect to API
- [ ] Database connection successful
- [ ] No CORS errors in browser console

## ☑️ Troubleshooting Checklist

### If Services Don't Start
- [ ] Check if ports are already in use: `lsof -i:3000,3001,3005`
- [ ] Stop conflicting processes: `./stop.sh`
- [ ] Check MongoDB is running: `mongo --eval "db.version()"`
- [ ] Check environment files exist and are configured correctly
- [ ] Review log files for specific error messages

### If Dependencies Failed to Install
- [ ] Clear node_modules: `rm -rf */node_modules`
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Re-run setup: `./setup.sh`

### If You See Network/Puppeteer Errors
- [ ] This is expected in restricted environments
- [ ] Run with: `PUPPETEER_SKIP_DOWNLOAD=true npm install`
- [ ] The setup script handles this automatically

## 🎉 Success Criteria

Your setup is complete when:
- ✅ All three services start without errors
- ✅ You can access all three URLs in your browser
- ✅ No error messages in service logs
- ✅ Database connection is successful
- ✅ API endpoints respond correctly

## 📋 Daily Use Checklist

### Starting Work
- [ ] Start MongoDB: `sudo systemctl start mongodb`
- [ ] Start Redis (if using): `redis-server`
- [ ] Start platform: `./run.sh`
- [ ] Verify all services are running

### During Development
- [ ] Monitor logs for errors
- [ ] Test changes in browser
- [ ] Keep environment variables in sync

### Ending Work
- [ ] Stop all services: `./stop.sh` or CTRL+C
- [ ] Optionally stop MongoDB and Redis

## 🆘 Getting Help

If you're stuck:
1. Check log files in the root directory: `logs-*.log`
2. Review [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting
3. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common commands
4. Verify all prerequisites are installed correctly
5. Ensure MongoDB and Redis are running
6. Create an issue in the repository with error details

---

**Remember:** The most common issues are:
- MongoDB not running
- Ports already in use
- Missing or incorrect environment variables
- Node.js version too old
