# Database Quick Reference

Quick command reference for common database operations.

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Start MongoDB
sudo systemctl start mongodb

# 2. Configure environment
cd api-main
cp .env.example .env
# Edit DATABASE_URI in .env

# 3. Install dependencies
npm install

# 4. Seed initial data
node scripts/db-seed.js

# 5. Default admin credentials
# Email: admin@travelpartner.com
# Password: Admin@123
```

## 📦 Backup & Restore

### Export Database (JSON)
```bash
cd api-main

# Export to default location (api-main/db-backup)
node scripts/db-export.js

# Export to custom location
node scripts/db-export.js /path/to/backup

# Export with timestamp
node scripts/db-export.js ./backups/backup-$(date +%Y%m%d-%H%M%S)
```

### Import Database (JSON)
```bash
cd api-main

# Import from default location
node scripts/db-import.js

# Import from custom location
node scripts/db-import.js /path/to/backup
```

### MongoDB Native Tools

Export with mongodump:
```bash
# Full database
mongodump --uri="mongodb://localhost:27017/travelpartner" --out=./dump

# Specific collection
mongodump --uri="mongodb://localhost:27017/travelpartner" \
  --collection=users --out=./dump
```

Import with mongorestore:
```bash
# Full database
mongorestore --uri="mongodb://localhost:27017/travelpartner" \
  ./dump/travelpartner

# Specific collection
mongorestore --uri="mongodb://localhost:27017/travelpartner" \
  --collection=users ./dump/travelpartner/users.bson
```

Export to JSON:
```bash
mongoexport --uri="mongodb://localhost:27017/travelpartner" \
  --collection=users --out=users.json --pretty
```

Import from JSON:
```bash
mongoimport --uri="mongodb://localhost:27017/travelpartner" \
  --collection=users --file=users.json --jsonArray
```

## 🌱 Seed Data

```bash
cd api-main
node scripts/db-seed.js
```

Creates:
- ✓ Default admin user (admin@travelpartner.com / Admin@123)
- ✓ Site settings
- ✓ FAQ categories
- ✓ Support categories
- ✓ Email templates
- ✓ Referral rewards
- ✓ Language settings

## 🔍 MongoDB Commands

### Connect to MongoDB
```bash
# Local
mongo mongodb://localhost:27017/travelpartner

# Remote
mongo "mongodb+srv://cluster.mongodb.net/travelpartner" --username user
```

### Common Operations

```javascript
// Show databases
show dbs

// Use database
use travelpartner

// Show collections
show collections

// Count documents
db.users.countDocuments()

// Find documents
db.users.find().limit(5).pretty()

// Find by ID
db.users.findOne({_id: ObjectId("...")})

// Find by field
db.users.find({email: "admin@travelpartner.com"})

// Update document
db.users.updateOne(
  {email: "admin@travelpartner.com"},
  {$set: {status: "active"}}
)

// Delete document
db.users.deleteOne({email: "test@example.com"})

// Create index
db.users.createIndex({email: 1})

// Show indexes
db.users.getIndexes()

// Drop collection (⚠️ WARNING)
db.users.drop()

// Drop database (⚠️ WARNING)
db.dropDatabase()
```

## 🔧 Maintenance

### Check Database Status
```javascript
// In mongo shell
use travelpartner
db.stats()
db.users.stats()
```

### Optimize Database
```javascript
// Compact collection
db.runCommand({compact: 'users'})

// Rebuild indexes
db.users.reIndex()
```

### Monitor Performance
```javascript
// Show current operations
db.currentOp()

// Show slow queries (if profiling enabled)
db.system.profile.find({millis: {$gt: 100}})

// Enable profiling
db.setProfilingLevel(1, {slowms: 100})
```

## 🔐 User Management

### Create Admin User Manually
```javascript
use travelpartner

// Hash password with bcrypt (use Node.js)
// const bcrypt = require('bcrypt');
// const hash = await bcrypt.hash('yourpassword', 10);

db.admins.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "hashed_password_here",
  role: "superadmin",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Reset User Password
```javascript
// In Node.js environment
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/travelpartner');

const newPassword = await bcrypt.hash('NewPassword123', 10);
await User.updateOne(
  {email: 'user@example.com'},
  {$set: {password: newPassword}}
);
```

## 📊 Common Queries

### User Statistics
```javascript
// Total users
db.users.countDocuments()

// Active users
db.users.countDocuments({status: "active"})

// Users by country
db.users.aggregate([
  {$group: {_id: "$country", count: {$sum: 1}}},
  {$sort: {count: -1}}
])
```

### Booking Statistics
```javascript
// Total bookings
db.bookings.countDocuments()

// Bookings by status
db.bookings.aggregate([
  {$group: {_id: "$status", count: {$sum: 1}}}
])

// Total booking amount
db.bookings.aggregate([
  {$group: {_id: null, total: {$sum: "$totalAmount"}}}
])
```

### Financial Statistics
```javascript
// Total wallet balance
db.wallets.aggregate([
  {$group: {_id: null, totalBalance: {$sum: "$balance"}}}
])

// Transactions by type
db.transactions.aggregate([
  {$group: {_id: "$type", count: {$sum: 1}, total: {$sum: "$amount"}}}
])
```

## 🚨 Emergency Operations

### Stop All Operations
```bash
# Stop MongoDB
sudo systemctl stop mongodb

# Or kill specific connection
mongo --eval "db.killOp(operationId)"
```

### Repair Database
```bash
# Stop MongoDB first
sudo systemctl stop mongodb

# Repair
mongod --repair --dbpath /var/lib/mongodb

# Start MongoDB
sudo systemctl start mongodb
```

### Restore from Backup
```bash
# 1. Stop application
pm2 stop all

# 2. Backup current state (just in case)
mongodump --uri="mongodb://localhost:27017/travelpartner" --out=./emergency-backup

# 3. Drop database
mongo mongodb://localhost:27017/travelpartner --eval "db.dropDatabase()"

# 4. Restore from backup
mongorestore --uri="mongodb://localhost:27017/travelpartner" ./backup/travelpartner

# 5. Start application
pm2 start all
```

## 🔗 Environment Configuration

### Development
```env
DATABASE_URI=mongodb://localhost:27017/travelpartner?directConnection=true
NODE_ENV=development
```

### Production
```env
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/travelpartner?retryWrites=true&w=majority
NODE_ENV=production
```

### Docker
```env
DATABASE_URI=mongodb://mongodb:27017/travelpartner
```

## 📝 Best Practices

✅ **DO:**
- Always backup before major operations
- Use transactions for financial operations
- Index frequently queried fields
- Monitor slow queries
- Regular backups (daily recommended)
- Test restore procedures

❌ **DON'T:**
- Store passwords in plain text
- Delete data without backup
- Run updates without WHERE clause equivalent
- Expose database credentials
- Skip validation on user input
- Ignore error logs

## 🆘 Troubleshooting

### Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Test connection
mongo mongodb://localhost:27017/travelpartner --eval "db.stats()"
```

### Permission Issues
```bash
# Check file permissions
ls -la /var/lib/mongodb

# Fix ownership
sudo chown -R mongodb:mongodb /var/lib/mongodb
```

### Out of Disk Space
```bash
# Check disk usage
df -h

# Clean up old logs
sudo rm /var/log/mongodb/*.log.old

# Compact database
mongo mongodb://localhost:27017/travelpartner
> db.runCommand({compact: 'collectionName'})
```

## 📚 More Information

- [DATABASE.md](./DATABASE.md) - Full documentation
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Schema visualization
- [api-main/scripts/README.md](./api-main/scripts/README.md) - Script documentation
- [MongoDB Docs](https://docs.mongodb.com/)

---

**⚠️ Warning**: Always test commands in development before running in production!
