# TravelPartner Platform - Quick Reference

## 🚀 Getting Started

### First Time Setup
```bash
# Run the setup script (installs dependencies and creates environment files)
./setup.sh
```

### Running the Platform

#### Option 1: Run All Services Together
```bash
./run.sh
```
This starts all three services (API, Admin Panel, User Panel) in the background.

#### Option 2: Run Services Individually
```bash
./run-individual.sh
```
Interactive menu to choose which service to run.

#### Option 3: Manual Start
```bash
# API Service (Port 3005)
cd api-main && npm run dev

# Admin Panel (Port 3000)  
cd admin-panel-main && npm run dev

# User Panel (Port 3001)
cd user-panel-main && PORT=3001 npm run dev
```

### Stopping Services

#### Stop all services
```bash
./stop.sh
```

#### Stop individual service
Press `CTRL+C` in the terminal where the service is running.

## 🌐 Service URLs

- **API Service**: http://localhost:3005
- **Admin Panel**: http://localhost:3000  
- **User Panel**: http://localhost:3001

## 📝 Environment Files

After running `setup.sh`, configure these files:

### api-main/.env
```env
PORT=3005
DATABASE_URI=mongodb://localhost:27017/travelpartner
REDIS_URL=redis://localhost:6379
BASE_URL=http://localhost:3005
ADMIN_URL=http://localhost:3000
FRONT_URL=http://localhost:3001
```

### admin-panel-main/.env.local
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3005
```

### user-panel-main/.env.local
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3005
NEXT_PUBLIC_CRYPTOSECRETKEY=1234567812345678
NEXT_PUBLIC_TASK_COUNT=30
```

## 🔧 Common Tasks

### Install/Update Dependencies
```bash
# For all services
./setup.sh

# For specific service
cd api-main && npm install
cd admin-panel-main && npm install
cd user-panel-main && npm install
```

### View Logs (when using ./run.sh)
```bash
# View all logs in real-time
tail -f logs-*.log

# View specific service log
tail -f logs-api.log
tail -f logs-admin.log
tail -f logs-user.log
```

### Build for Production
```bash
# API Service
cd api-main && npm run prod

# Admin Panel
cd admin-panel-main && npm run build && npm start

# User Panel
cd user-panel-main && npm run build && npm start
```

## 🪟 Windows Users

Use the `.bat` files instead of `.sh`:

```batch
REM Setup
setup.bat

REM Run all services
run.bat
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Stop all services
./stop.sh

# Or manually kill process on specific port
lsof -ti:3005 | xargs kill -9  # API
lsof -ti:3000 | xargs kill -9  # Admin
lsof -ti:3001 | xargs kill -9  # User
```

### MongoDB Not Running
```bash
# On Linux/Mac
sudo systemctl start mongodb
# or
mongod

# On Windows
net start MongoDB
```

### Clean Install
```bash
# Remove node_modules and reinstall
cd api-main && rm -rf node_modules && npm install
cd admin-panel-main && rm -rf node_modules && npm install
cd user-panel-main && rm -rf node_modules && npm install
```

## 📚 Documentation

For detailed information, see:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup guide
- [README.md](README.md) - Project overview

## 💡 Tips

1. **Always run `setup.sh` first** before starting services
2. **Check environment files** after setup to ensure correct configuration
3. **Start API service first** as other services depend on it
4. **Use `./run.sh`** for development with multiple services
5. **Use `./run-individual.sh`** when working on a specific service
