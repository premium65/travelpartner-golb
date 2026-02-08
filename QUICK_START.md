# Quick Start Guide - TravelPartner Golb

## 🚀 Fast Setup in 3 Steps

### Step 1: Start Backend API
```bash
cd api-main
npm install
npm run dev
```
✅ API running at: **http://localhost:5000**

### Step 2: Start Admin Panel
```bash
cd admin-panel-main
npm install
npm run dev
```
✅ Admin Panel at: **[http://localhost:3000](http://localhost:3000)**

### Step 3: Start User Panel
```bash
cd user-panel-main
npm install
PORT=3001 npm run dev
```
✅ User Panel at: **[http://localhost:3001](http://localhost:3001)**

---

## 🔗 Quick Access Links

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | http://localhost:5000 | REST API endpoints |
| **Admin Dashboard** | [http://localhost:3000](http://localhost:3000) | Admin panel home |
| **Admin Login** | [http://localhost:3000/login](http://localhost:3000/login) | Admin authentication |
| **User Home** | [http://localhost:3001](http://localhost:3001) | User booking app |
| **User Login** | [http://localhost:3001/login](http://localhost:3001/login) | User authentication |
| **User Register** | [http://localhost:3001/register](http://localhost:3001/register) | New user signup |

---

## ⚡ One-Command Setup (All Services)

If you have all three terminals available, run these in parallel:

**Terminal 1:**
```bash
cd api-main && npm install && npm run dev
```

**Terminal 2:**
```bash
cd admin-panel-main && npm install && npm run dev
```

**Terminal 3:**
```bash
cd user-panel-main && npm install && PORT=3001 npm run dev
```

---

## 🔧 Common Issues

### Port 3000 Already in Use?
- **Solution**: Use a different port for one service
  ```bash
  PORT=3001 npm run dev
  ```

### Can't Connect to API?
- **Check**: Backend API is running on http://localhost:5000
- **Verify**: Environment variables in frontend projects point to correct API URL

### Dependencies Not Installing?
- **Try**: Delete `node_modules` and `package-lock.json`, then run `npm install` again
- **Check**: You have Node.js v18.12.1+ and npm v8.19.2+

---

## 📝 Environment Setup

Create `.env` files as needed:

**api-main/.env:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**admin-panel-main/.env.local:**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

**user-panel-main/.env.local:**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

## 🎯 Next Steps

1. ✅ All services running? Visit [http://localhost:3000](http://localhost:3000) for admin panel
2. ✅ Visit [http://localhost:3001](http://localhost:3001) for user panel
3. ✅ Check out the [main README](README.md) for detailed documentation
4. ✅ See [admin-panel-main/LOGGING.md](admin-panel-main/LOGGING.md) for logging features

---

**Need Help?** Check the main README.md or individual project README files for more details!
