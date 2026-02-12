# Database Schema Overview

This document provides a visual representation of the TravelPartner database schema and relationships.

## Entity Relationship Diagram

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ _id             │◄─────────┐
│ name            │          │
│ email           │          │
│ phone           │          │
│ password        │          │
│ referralCode    │          │
│ sponsorId       │──────┐   │
│ level           │      │   │
│ kycStatus       │      │   │
└─────────────────┘      │   │
         │               │   │
         │               │   │
         │               │   │
         ├───────────────┼───┼───────────────────┐
         │               │   │                   │
         ▼               │   │                   ▼
┌─────────────────┐      │   │          ┌─────────────────┐
│    UserKyc      │      │   │          │   LoginHistory  │
├─────────────────┤      │   │          ├─────────────────┤
│ _id             │      │   │          │ _id             │
│ userId          │──────┘   │          │ userId          │
│ documents       │          │          │ ipAddress       │
│ status          │          │          │ loginTime       │
│ verifiedDate    │          │          │ device          │
└─────────────────┘          │          └─────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   UserSetting   │  │     Wallet      │  │   ReferTable    │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ _id             │  │ _id             │  │ _id             │
│ userId          │  │ userId          │  │ userId          │
│ notifications   │  │ balance         │  │ referrals[]     │
│ language        │  │ deposits        │  │ totalEarnings   │
│ timezone        │  │ withdrawals     │  └─────────────────┘
└─────────────────┘  └─────────────────┘
                              │
                              ├───────────────────┐
                              │                   │
                              ▼                   ▼
                     ┌─────────────────┐  ┌─────────────────┐
                     │   Transaction   │  │    Passbook     │
                     ├─────────────────┤  ├─────────────────┤
                     │ _id             │  │ _id             │
                     │ userId          │  │ userId          │
                     │ type            │  │ type            │
                     │ amount          │  │ amount          │
                     │ status          │  │ balance         │
                     │ date            │  │ description     │
                     └─────────────────┘  └─────────────────┘

┌─────────────────┐
│    Package      │
├─────────────────┤
│ _id             │◄─────────┐
│ name            │          │
│ description     │          │
│ price           │          │
│ duration        │          │
│ images[]        │          │
│ destination     │          │
│ status          │          │
└─────────────────┘          │
                             │
                             │
                     ┌───────┴───────┐
                     │               │
                     ▼               ▼
            ┌─────────────────┐  ┌─────────────────┐
            │    Booking      │  │ BookingHistory  │
            ├─────────────────┤  ├─────────────────┤
            │ _id             │  │ _id             │
            │ userId          │  │ bookingId       │
            │ packageId       │──┤ changes         │
            │ status          │  │ modifiedBy      │
            │ bookingDate     │  │ timestamp       │
            │ travelDate      │  └─────────────────┘
            │ totalAmount     │
            └─────────────────┘

┌─────────────────┐
│   DepositHistory│
├─────────────────┤
│ _id             │
│ userId          │
│ amount          │
│ paymentMethod   │
│ status          │
│ transactionId   │
│ date            │
└─────────────────┘

┌─────────────────┐
│  WithdrawReq    │
├─────────────────┤
│ _id             │
│ userId          │
│ amount          │
│ bankDetails     │
│ status          │
│ processedBy     │
│ date            │
└─────────────────┘

┌─────────────────┐          ┌─────────────────┐
│    Support      │          │ SupportTicket   │
├─────────────────┤          ├─────────────────┤
│ _id             │◄─────────│ _id             │
│ userId          │          │ supportId       │
│ categoryId      │──┐       │ message         │
│ subject         │  │       │ attachments[]   │
│ status          │  │       │ timestamp       │
└─────────────────┘  │       └─────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ SupportCategory │
            ├─────────────────┤
            │ _id             │
            │ name            │
            │ description     │
            │ icon            │
            └─────────────────┘

┌─────────────────┐
│     Admin       │
├─────────────────┤
│ _id             │◄─────────┐
│ name            │          │
│ email           │          │
│ password        │          │
│ role            │          │
│ permissions[]   │          │
└─────────────────┘          │
                             │
                     ┌───────┴───────┐
                     │               │
                     ▼               ▼
            ┌─────────────────┐  ┌────────────────────┐
            │   AdminLogs     │  │ AdminProfitHistory │
            ├─────────────────┤  ├────────────────────┤
            │ _id             │  │ _id                │
            │ adminId         │  │ date               │
            │ action          │  │ totalBookings      │
            │ details         │  │ totalRevenue       │
            │ ipAddress       │  │ commission         │
            │ timestamp       │  │ profit             │
            └─────────────────┘  └────────────────────┘

┌─────────────────┐
│  SiteSetting    │
├─────────────────┤
│ _id             │
│ siteName        │
│ siteTitle       │
│ siteDescription │
│ currency        │
│ timezone        │
│ maintenance     │
│ smtp            │
│ social          │
└─────────────────┘

┌─────────────────┐
│      CMS        │
├─────────────────┤
│ _id             │
│ slug            │
│ title           │
│ content         │
│ metaTags        │
│ status          │
└─────────────────┘

┌─────────────────┐          ┌─────────────────┐
│      FAQ        │          │  FaqCategory    │
├─────────────────┤          ├─────────────────┤
│ _id             │          │ _id             │
│ categoryId      │──────────│ name            │
│ question        │          │ description     │
│ answer          │          │ order           │
│ order           │          └─────────────────┘
└─────────────────┘

┌─────────────────┐
│  Notification   │
├─────────────────┤
│ _id             │
│ userId          │
│ title           │
│ message         │
│ type            │
│ read            │
│ timestamp       │
└─────────────────┘

┌─────────────────┐
│ EmailTemplate   │
├─────────────────┤
│ _id             │
│ name            │
│ subject         │
│ body            │
│ type            │
│ variables[]     │
└─────────────────┘

┌─────────────────┐
│  SliderManage   │
├─────────────────┤
│ _id             │
│ title           │
│ description     │
│ image           │
│ link            │
│ order           │
│ status          │
└─────────────────┘
```

## Collection Groups

### Core User System
- **User**: Main user accounts
- **UserKyc**: KYC verification data
- **UserSetting**: User preferences
- **UserToken**: Authentication tokens
- **LoginHistory**: Login audit trail

### Financial System
- **Wallet**: User wallet balances
- **Transaction**: All transactions
- **DepositHistory**: Deposit records
- **WithdrawReq**: Withdrawal requests
- **Passbook**: Transaction ledger
- **Bonus**: Bonus rewards

### Booking System
- **Package**: Travel packages
- **Booking**: User bookings
- **BookingHistory**: Booking modifications
- **PremiumTask**: Premium tasks
- **PremiumTaskList**: Available tasks

### Referral System
- **ReferTable**: Referral structure
- **ReferralReward**: Reward configuration
- **ReferralFeeDetail**: Commission details

### Support System
- **Support**: Support requests
- **SupportTicket**: Ticket messages
- **SupportCategory**: Ticket categories
- **Contact**: Contact form submissions

### Content Management
- **CMS**: Dynamic pages
- **FAQ**: Frequently asked questions
- **FaqCategory**: FAQ grouping
- **Announcement**: System announcements
- **Policies**: Legal documents
- **SliderManage**: Homepage sliders

### Admin System
- **Admin**: Admin users
- **AdminLogs**: Admin activity
- **AdminProfitHistory**: Profit tracking

### Configuration
- **SiteSetting**: Global settings
- **EmailTemplate**: Email templates
- **Language**: Multi-language support
- **Modules**: System modules
- **Submodules**: Module permissions

### Security & Monitoring
- **RestrictIpAddress**: IP restrictions
- **Smslog**: SMS logs
- **KycHistory**: KYC audit trail
- **Notification**: User notifications

## Key Relationships

### One-to-Many Relationships

1. **User → UserKyc**: One user has one KYC profile
2. **User → Wallet**: One user has one wallet
3. **User → Bookings**: One user can have many bookings
4. **User → Transactions**: One user can have many transactions
5. **Package → Bookings**: One package can have many bookings
6. **Admin → AdminLogs**: One admin can have many log entries
7. **Support → SupportTickets**: One support case can have many tickets
8. **FaqCategory → FAQ**: One category can have many FAQs

### Self-Referencing Relationships

1. **User → User**: Sponsor relationship (referral system)
2. **User → ReferTable**: Multi-level referral tracking

## Data Flow Examples

### User Registration Flow
```
1. User registers → User collection
2. Generate referral code → User.referralCode
3. Link to sponsor → User.sponsorId
4. Create wallet → Wallet collection
5. Create user settings → UserSetting collection
6. Send welcome email → EmailTemplate
```

### Booking Flow
```
1. User selects package → Package collection
2. Create booking → Booking collection
3. Deduct from wallet → Wallet.balance
4. Create transaction → Transaction collection
5. Update passbook → Passbook collection
6. Calculate referral rewards → ReferralFeeDetail
7. Update sponsor earnings → Wallet (sponsor)
```

### Withdrawal Flow
```
1. User requests withdrawal → WithdrawReq collection
2. Check wallet balance → Wallet.balance
3. Admin reviews request → AdminLogs
4. Process withdrawal → Transaction collection
5. Update wallet → Wallet.balance
6. Update passbook → Passbook collection
7. Send notification → Notification collection
```

## Indexes (Recommended)

For optimal query performance, consider these indexes:

```javascript
// User lookups
User: { email: 1, phone: 1, referralCode: 1 }

// Financial queries
Transaction: { userId: 1, createdAt: -1 }
Wallet: { userId: 1 }

// Booking queries
Booking: { userId: 1, status: 1, createdAt: -1 }
Package: { status: 1, price: 1 }

// Support queries
Support: { userId: 1, status: 1, createdAt: -1 }

// Admin queries
AdminLogs: { adminId: 1, createdAt: -1 }
```

## Data Types

Common field types used across collections:

- **ObjectId**: MongoDB references (_id, userId, packageId, etc.)
- **String**: Text fields (name, email, description)
- **Number**: Numeric fields (price, amount, balance)
- **Boolean**: Status flags (isActive, isVerified)
- **Date**: Timestamps (createdAt, updatedAt)
- **Array**: Lists (images[], permissions[], referrals[])
- **Object**: Embedded documents (bankDetails, levelDetails)

## Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Secure authentication
3. **KYC Verification**: Multi-level verification
4. **IP Restrictions**: Whitelist/blacklist
5. **Admin Audit**: All admin actions logged
6. **Transaction Logging**: Complete financial audit trail

## Best Practices

1. **Always use transactions** for financial operations
2. **Index frequently queried fields** for performance
3. **Use aggregation pipelines** for complex queries
4. **Implement soft deletes** (isDeleted flag) instead of hard deletes
5. **Maintain audit trails** for critical operations
6. **Regular backups** of the database
7. **Monitor query performance** and optimize as needed

## See Also

- [DATABASE.md](./DATABASE.md) - Comprehensive database documentation
- [api-main/scripts/README.md](./api-main/scripts/README.md) - Database utility scripts
- [api-main/models/](./api-main/models/) - Mongoose model definitions
