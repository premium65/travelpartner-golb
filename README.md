# TravelPartner

A comprehensive travel booking platform with user and admin panels, built with modern web technologies.

## 📋 Project Overview

TravelPartner is a full-stack travel booking application that allows users to:
- Browse and book travel packages
- Earn rewards through referrals
- Manage their wallet and transactions
- Track bookings and travel history
- Receive support through integrated ticket system

## 🏗️ Architecture

This is a monorepo containing three main applications:

```
travelpartner-golb/
├── api-main/           # Backend API (Node.js + Express + MongoDB)
├── admin-panel-main/   # Admin Dashboard (Next.js)
├── user-panel-main/    # User Portal (Next.js)
└── render.yaml        # Deployment configuration
```

## 🗄️ Database

This project uses **MongoDB** as its database with Mongoose ODM.

### Quick Database Access

- **Full Documentation**: See [DATABASE.md](./DATABASE.md)
- **Schema Visualization**: See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- **Database Scripts**: See [api-main/scripts/README.md](./api-main/scripts/README.md)

### Database Features
- 44 Mongoose models covering all aspects of the platform
- User management with KYC verification
- Wallet and transaction system
- Multi-level referral system
- Booking and package management
- Support ticket system
- Admin audit logging

### Database Utilities

Export database:
```bash
cd api-main
node scripts/db-export.js ./backup
```

Import database:
```bash
cd api-main
node scripts/db-import.js ./backup
```

Seed initial data:
```bash
cd api-main
node scripts/db-seed.js
```

For more details, see [Database Documentation](./DATABASE.md).

## 🚀 Getting Started

### Prerequisites

- Node.js v18.12.1 or higher
- npm v8.19.2 or higher
- MongoDB v6.7.3 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/premium65/travelpartner-golb.git
   cd travelpartner-golb
   ```

2. **Setup Backend (API)**
   ```bash
   cd api-main
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

3. **Setup Admin Panel**
   ```bash
   cd admin-panel-main
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

4. **Setup User Panel**
   ```bash
   cd user-panel-main
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

5. **Seed Database (Optional)**
   ```bash
   cd api-main
   node scripts/db-seed.js
   ```
   
   This creates default admin user:
   - Email: `admin@travelpartner.com`
   - Password: `Admin@123`

### MongoDB Setup

**Local Development:**
```bash
# Install MongoDB
sudo apt-get install mongodb  # Ubuntu/Debian
brew install mongodb-community # macOS

# Start MongoDB
sudo systemctl start mongodb   # Linux
brew services start mongodb-community  # macOS

# Configure connection in api-main/.env
DATABASE_URI=mongodb://localhost:27017/travelpartner?directConnection=true
```

**Production (MongoDB Atlas):**
```env
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/travelpartner?retryWrites=true&w=majority
```

## 🛠️ Technology Stack

### Backend (api-main)
- **Runtime**: Node.js v18.12.1+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Cache**: Redis
- **Authentication**: JWT + Passport.js
- **File Upload**: Multer + AWS S3
- **Real-time**: Socket.io
- **Security**: Bcrypt, Helmet, CORS

### Admin Panel (admin-panel-main)
- **Framework**: Next.js 14 (TypeScript)
- **State**: Redux Toolkit, Recoil
- **UI**: Mantine, React Icons
- **Data Fetching**: TanStack Query
- **Editor**: CKEditor 5

### User Panel (user-panel-main)
- **Framework**: Next.js 14.2.8 (TypeScript)
- **UI**: NextUI
- **State**: Recoil
- **Styling**: Tailwind CSS

## 📚 Documentation

- [📦 Database Documentation](./DATABASE.md) - Complete database guide
- [🗺️ Database Schema](./DATABASE_SCHEMA.md) - Visual schema reference
- [🔧 Database Scripts](./api-main/scripts/README.md) - Import/export utilities
- [🔌 API Documentation](./api-main/README.md) - Backend API reference
- [👨‍💼 Admin Panel](./admin-panel-main/README.md) - Admin dashboard guide
- [👤 User Panel](./user-panel-main/README.md) - User portal guide

## 📂 Project Structure

```
travelpartner-golb/
├── api-main/
│   ├── config/          # Configuration files
│   ├── controllers/     # Business logic
│   ├── models/          # Mongoose models (44 models)
│   ├── routes/          # API routes
│   ├── validation/      # Input validation
│   ├── scripts/         # Database utilities
│   │   ├── db-export.js
│   │   ├── db-import.js
│   │   └── db-seed.js
│   └── server.js        # Entry point
├── admin-panel-main/
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   └── store/          # State management
├── user-panel-main/
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   └── store/          # State management
├── DATABASE.md         # Database documentation
├── DATABASE_SCHEMA.md  # Schema visualization
└── README.md          # This file
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- KYC verification system
- IP address restrictions
- Admin activity logging
- Transaction audit trail
- Environment-based configuration
- HTTPS/SSL in production

## 🚢 Deployment

The project is configured for deployment on Render.com via `render.yaml`.

### Environment Variables

**Backend (api-main/.env):**
```env
NODE_ENV=production
PORT=5000
DATABASE_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
REDIS_URL=your_redis_url
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://socket.yourdomain.com
```

## 📊 Database Management

### Backup Strategy

```bash
# Daily backup
node scripts/db-export.js ./backups/daily-$(date +%Y%m%d)

# Before updates
node scripts/db-export.js ./backups/pre-update

# Production backup
mongodump --uri="$DATABASE_URI" --out=./production-backup
```

### Restore Database

```bash
# From JSON export
node scripts/db-import.js ./backup-directory

# From mongodump
mongorestore --uri="$DATABASE_URI" ./production-backup/travelpartner
```

## 🧪 Testing

```bash
# Backend tests
cd api-main
npm test

# Frontend tests
cd admin-panel-main
npm test

cd user-panel-main
npm test
```

## 📈 Monitoring

- Database connection status
- Query performance
- Transaction logs
- Admin activity logs
- User activity tracking
- Error logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 👥 Authors

- Development Team - [premium65](https://github.com/premium65)

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@travelpartner.com

## 🔗 Useful Links

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

---

**Note**: Remember to change default passwords and configure secure environment variables before deploying to production!
