# TravelPartner Database Documentation

## Overview

This project uses **MongoDB** as its database with **Mongoose** ODM for schema management and data modeling.

## Database Configuration

### Connection Details
- **Database Name**: `travelpartner`
- **Default Connection**: `mongodb://localhost:27017/travelpartner?directConnection=true`
- **Configuration File**: `api-main/config/dbConnection.js`
- **Environment Variable**: `DATABASE_URI` (configured in `.env`)

### Technology Stack
- **Database**: MongoDB v6.7.3+
- **ODM**: Mongoose
- **Cache**: Redis (for performance optimization)

## Database Collections & Models

The database consists of 44 Mongoose models organized into the following categories:

### 1. User Management (6 collections)
- **User** (`api-main/models/User.js`) - Main user accounts with authentication, profile, referral system
- **UserKyc** (`api-main/models/userKyc.js`) - KYC verification documents and status
- **UserSetting** (`api-main/models/userSetting.js`) - User preferences and settings
- **UserToken** (`api-main/models/userToken.js`) - JWT tokens for authentication
- **LoginHistory** (`api-main/models/LoginHistory.js`) - User login audit trail
- **Admin** (`api-main/models/admin.js`) - Admin user accounts

### 2. Booking & Package Management (6 collections)
- **Booking** (`api-main/models/booking.js`) - Travel package bookings
- **BookingHistory** (`api-main/models/bookingHistory.js`) - Booking history and changes
- **Package** (`api-main/models/package.js`) - Travel package listings
- **PremiumTask** (`api-main/models/premiumTask.js`) - Premium task assignments
- **PremiumTaskList** (`api-main/models/premiumTaskList.js`) - Available premium tasks
- **Events** (`api-main/models/events.js`) - Special events and promotions

### 3. Financial Management (8 collections)
- **Wallet** (`api-main/models/wallet.js`) - User wallet balances
- **Transaction** (`api-main/models/transaction.js`) - All financial transactions
- **DepositHistory** (`api-main/models/depositHistory.js`) - Deposit records
- **WithdrawReq** (`api-main/models/withdrawReq.js`) - Withdrawal requests
- **Passbook** (`api-main/models/passbook.js`) - Transaction ledger/passbook
- **Bonus** (`api-main/models/Bonus.js`) - Bonus and rewards
- **AdminProfitHistory** (`api-main/models/adminProfitHistory.js`) - Admin profit tracking
- **ReferralFeeDetail** (`api-main/models/referralFeeDetail.js`) - Referral commission details

### 4. Referral System (4 collections)
- **ReferTable** (`api-main/models/Referencetable.js`) - Referral structure
- **ReferralReward** (`api-main/models/referralReward.js`) - Referral rewards configuration
- **ReferralFeeDetail** (`api-main/models/referralFeeDetail.js`) - Fee distribution details
- **Referencetable** (`api-main/models/Referencetable.js`) - Reference data

### 5. Support & Communication (6 collections)
- **Support** (`api-main/models/support.js`) - Support ticket system
- **SupportTicket** (`api-main/models/supportTicket.js`) - Individual tickets
- **SupportCategory** (`api-main/models/supportCategory.js`) - Ticket categories
- **Contact** (`api-main/models/contact.js`) - Contact form submissions
- **NewsLetter** (`api-main/models/newsLetter.js`) - Newsletter subscriptions
- **Notification** (`api-main/models/notification.js`) - User notifications

### 6. Content Management (5 collections)
- **Cms** (`api-main/models/cms.js`) - CMS pages and content
- **Faq** (`api-main/models/faq.js`) - FAQ entries
- **FaqCategory** (`api-main/models/faqcategory.js`) - FAQ categories
- **Anouncement** (`api-main/models/anouncement.js`) - System announcements
- **Policies** (`api-main/models/policies.js`) - Terms, privacy policies

### 7. Admin & Configuration (8 collections)
- **AdminLogs** (`api-main/models/adminLogs.js`) - Admin activity logs
- **SliderManage** (`api-main/models/sliderManage.js`) - Homepage slider management
- **SiteSetting** (`api-main/models/sitesetting.js`) - Site-wide configuration
- **EmailTemplate** (`api-main/models/emailtemplate.js`) - Email templates
- **Language** (`api-main/models/language.js`) - Multi-language support
- **Modules** (`api-main/models/modules.js`) - System modules
- **Submodules** (`api-main/models/submodules.js`) - Module permissions
- **RestrictIpAddress** (`api-main/models/RestrictIpAddress.js`) - IP restrictions

### 8. KYC & Security (3 collections)
- **KycHistory** (`api-main/models/kycHistory.js`) - KYC verification history
- **Smslog** (`api-main/models/smslog.js`) - SMS notification logs
- **ReviewContext** (`api-main/models/reviewContext.js`) - Review and rating context

## Key Model Details

### User Model (`User.js`)
Main user entity with:
- Authentication (email, password, phone)
- Profile information (name, DOB, country)
- Referral system (sponsor, referral code, level)
- KYC status
- Wallet integration
- Bank details (embedded schema)
- Level details and bonuses

### Booking Model (`booking.js`)
Travel booking records with:
- User reference
- Package details
- Booking amount
- Status tracking
- Payment information

### Wallet Model (`wallet.js`)
User financial wallet with:
- Balance tracking
- Deposit/withdrawal management
- Transaction history reference
- Bonus and commission tracking

## Database Setup Instructions

### Prerequisites
- MongoDB v6.7.3 or higher installed and running
- Node.js v18.12.1 or higher
- npm v8.19.2 or higher

### Local Development Setup

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb

   # macOS
   brew install mongodb-community
   
   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB Service**
   ```bash
   # Linux
   sudo systemctl start mongodb
   
   # macOS
   brew services start mongodb-community
   
   # Windows
   # MongoDB runs as a service automatically
   ```

3. **Configure Environment Variables**
   
   Create `.env` file in `api-main` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URI=mongodb://localhost:27017/travelpartner?directConnection=true
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   ```

4. **Install Dependencies**
   ```bash
   cd api-main
   npm install
   ```

5. **Start the Application**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   The application will automatically:
   - Connect to MongoDB
   - Create the database if it doesn't exist
   - Initialize all collections on first use

### Production Setup

For production deployment (e.g., Render, AWS, Heroku):

1. Set the `DATABASE_URI` environment variable to your MongoDB connection string
2. For MongoDB Atlas (cloud):
   ```
   DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/travelpartner?retryWrites=true&w=majority
   ```

## Database Export/Import

### Export Database

To export the entire database:
```bash
mongodump --uri="mongodb://localhost:27017/travelpartner" --out=/path/to/backup
```

To export specific collection:
```bash
mongodump --uri="mongodb://localhost:27017/travelpartner" --collection=users --out=/path/to/backup
```

### Import Database

To import the entire database:
```bash
mongorestore --uri="mongodb://localhost:27017/travelpartner" /path/to/backup/travelpartner
```

To import specific collection:
```bash
mongorestore --uri="mongodb://localhost:27017/travelpartner" --collection=users /path/to/backup/travelpartner/users.bson
```

### JSON Export/Import

Export collection as JSON:
```bash
mongoexport --uri="mongodb://localhost:27017/travelpartner" --collection=users --out=users.json --pretty
```

Import collection from JSON:
```bash
mongoimport --uri="mongodb://localhost:27017/travelpartner" --collection=users --file=users.json --jsonArray
```

## Database Utilities

Use the provided scripts in the `api-main/scripts` directory:

### Export Script
```bash
cd api-main
node scripts/db-export.js
```

### Import Script
```bash
cd api-main
node scripts/db-import.js /path/to/backup
```

### Seed Database
```bash
cd api-main
node scripts/db-seed.js
```

## Schema Features

### Auto-Generated Fields
All models include:
- `_id` - Auto-generated MongoDB ObjectId
- `createdAt` - Timestamp when document was created
- `updatedAt` - Timestamp when document was last updated

### Relationships
Models use MongoDB ObjectId references for relationships:
```javascript
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}
```

### Validation
Models include:
- Required field validation
- Enum validation for status fields
- Custom validators for email, phone, etc.
- Pre-save hooks for data transformation

## API Endpoints

The API provides RESTful endpoints for all database operations:
- User management: `/api/users/*`
- Bookings: `/api/bookings/*`
- Packages: `/api/packages/*`
- Wallet: `/api/wallet/*`
- Admin: `/api/admin/*`

See API documentation for detailed endpoint information.

## Security Considerations

1. **Authentication**: JWT-based authentication with Passport.js
2. **Password Hashing**: Bcrypt with salt rounds
3. **IP Restrictions**: Configurable IP whitelist/blacklist
4. **KYC Verification**: Required for certain operations
5. **Transaction Logging**: All financial operations are logged
6. **Admin Audit**: All admin actions are tracked

## Backup Strategy

### Recommended Backup Schedule
- **Daily**: Automated full database backup
- **Hourly**: Transaction log backup for critical collections
- **Before Updates**: Manual backup before schema changes

### Critical Collections (Priority for Backup)
1. User
2. Wallet
3. Transaction
4. Booking
5. WithdrawReq
6. DepositHistory

## Monitoring

Monitor these metrics:
- Database connection status
- Query performance
- Storage usage
- Index usage
- Replication lag (if using replica sets)

## Troubleshooting

### Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Test connection
mongo mongodb://localhost:27017/travelpartner
```

### Performance Issues
- Review slow queries in MongoDB logs
- Check index usage with `db.collection.explain()`
- Monitor memory usage
- Consider adding compound indexes for frequently queried fields

## Additional Resources

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/) - Free courses

## Support

For database-related issues:
1. Check application logs in `api-main/logs`
2. Review MongoDB logs
3. Check environment variable configuration
4. Verify network connectivity to database server
