# Database Scripts

This directory contains utility scripts for managing the TravelPartner MongoDB database.

## Available Scripts

### 1. Database Export (`db-export.js`)

Exports the entire MongoDB database to JSON files.

**Usage:**
```bash
# Export to default location (api-main/db-backup)
node scripts/db-export.js

# Export to custom location
node scripts/db-export.js /path/to/backup/directory
node scripts/db-export.js ./my-backup
```

**Output:**
- Creates one JSON file per collection
- Creates `_metadata.json` with export information
- Skips empty collections
- Pretty-formatted JSON for readability

**Example Output:**
```
========================================
  TravelPartner Database Export Tool
========================================

Database URI: mongodb://localhost:27017/travelpartner
Output Directory: /home/user/backup

✓ Connected to MongoDB

Found 15 collections to export:

✓ users                        - 100 documents exported
✓ bookings                     - 50 documents exported
✓ packages                     - 25 documents exported
○ admins                       - empty (skipped)

========================================
✓ Export completed successfully!
========================================

Total Collections: 3
Total Documents: 175
Output Directory: /home/user/backup
```

### 2. Database Import (`db-import.js`)

Imports data from JSON files into MongoDB database.

**Usage:**
```bash
# Import from default location (api-main/db-backup)
node scripts/db-import.js

# Import from custom location
node scripts/db-import.js /path/to/backup/directory
node scripts/db-import.js ./my-backup
```

**Features:**
- Imports all JSON files from the specified directory
- Handles duplicate key errors gracefully
- Shows progress for each collection
- Displays metadata from export if available

**Example Output:**
```
========================================
  TravelPartner Database Import Tool
========================================

Database URI: mongodb://localhost:27017/travelpartner
Input Directory: /home/user/backup

✓ Connected to MongoDB

Found 3 files to import:

✓ users                        - 100 documents imported
✓ bookings                     - 50 documents imported
✓ packages                     - 25 documents imported

========================================
✓ Import completed!
========================================

Total Collections: 3
Total Documents: 175
```

### 3. Database Seed (`db-seed.js`)

Initializes the database with default/sample data.

**Usage:**
```bash
node scripts/db-seed.js
```

**What it seeds:**
- Default admin user (admin@travelpartner.com / Admin@123)
- Default site settings
- Default FAQ categories
- Default support categories
- Default email templates
- Default referral rewards
- Default language settings

**Example Output:**
```
========================================
  TravelPartner Database Seed Script
========================================

Database URI: mongodb://localhost:27017/travelpartner

✓ Connected to MongoDB

Seeding database with initial data...

✓ Created default admin user
   Email: admin@travelpartner.com
   Password: Admin@123
✓ Created default site settings
✓ Created default FAQ categories
✓ Created default support categories
✓ Created default email templates
✓ Created default referral rewards
✓ Created default language

========================================
✓ Database seeding completed!
========================================

Default Admin Credentials:
  Email: admin@travelpartner.com
  Password: Admin@123

⚠ Please change the default admin password after first login!
```

## Prerequisites

Before running these scripts, ensure:

1. **MongoDB is running:**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongodb
   # Or start MongoDB
   sudo systemctl start mongodb
   ```

2. **Environment variables are configured:**
   - Copy `.env.example` to `.env` in the `api-main` directory
   - Set `DATABASE_URI` to your MongoDB connection string

3. **Dependencies are installed:**
   ```bash
   cd api-main
   npm install
   ```

## Common Use Cases

### Initial Setup

When setting up a new instance:
```bash
# 1. Start with seed data
node scripts/db-seed.js

# 2. Create your backup
node scripts/db-export.js ./initial-backup
```

### Backup Before Updates

Before deploying updates:
```bash
# Create timestamped backup
node scripts/db-export.js ./backups/backup-$(date +%Y%m%d-%H%M%S)
```

### Migrate Data Between Environments

From production to development:
```bash
# On production server
node scripts/db-export.js ./production-backup

# Copy files to development server
# scp -r ./production-backup user@dev-server:/path/to/api-main/

# On development server
node scripts/db-import.js ./production-backup
```

### Restore from Backup

If you need to restore:
```bash
# Import the backup
node scripts/db-import.js /path/to/backup

# Note: This adds data, doesn't replace existing data
# To fully restore, you may need to clear collections first
```

## Automated Backups

### Using Cron (Linux/Mac)

Add to crontab (`crontab -e`):
```bash
# Daily backup at 2 AM
0 2 * * * cd /path/to/api-main && node scripts/db-export.js ./backups/daily-$(date +\%Y\%m\%d)

# Keep only last 7 days
0 3 * * * find /path/to/api-main/backups -type d -mtime +7 -exec rm -rf {} \;
```

### Using PM2

Add to your PM2 ecosystem file:
```javascript
{
  name: 'db-backup',
  script: 'scripts/db-export.js',
  cron_restart: '0 2 * * *',  // 2 AM daily
  autorestart: false
}
```

## Troubleshooting

### Connection Errors

If you get connection errors:
```bash
# 1. Check if MongoDB is running
sudo systemctl status mongodb

# 2. Test connection manually
mongo mongodb://localhost:27017/travelpartner

# 3. Check environment variables
cat .env | grep DATABASE_URI
```

### Permission Errors

If you get permission errors:
```bash
# Make scripts executable
chmod +x scripts/*.js

# Check directory permissions
ls -la scripts/
```

### Out of Memory

For large databases:
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 scripts/db-export.js
```

### Duplicate Key Errors on Import

This is normal when importing to a database with existing data. The script will:
- Skip documents that already exist (based on `_id`)
- Import new documents
- Show a warning about duplicates

To do a clean import:
1. Drop the database first (⚠️ **WARNING: This deletes all data!**)
2. Then run the import

```bash
# In mongo shell
mongo mongodb://localhost:27017/travelpartner
> db.dropDatabase()
> exit

# Now import
node scripts/db-import.js /path/to/backup
```

## Script Options

All scripts support:
- Custom directory paths as command-line arguments
- Environment variable configuration via `.env`
- Colored console output for better readability
- Progress indicators
- Error handling and recovery

## Security Considerations

1. **Backup Storage:**
   - Store backups in secure locations
   - Encrypt sensitive backups
   - Limit access to backup directories

2. **Credentials:**
   - Never commit `.env` files with real credentials
   - Use environment variables in production
   - Rotate credentials regularly

3. **Default Admin:**
   - Change the default admin password immediately after seeding
   - Use strong passwords in production
   - Enable two-factor authentication

## Additional Resources

- [MongoDB Backup Methods](https://docs.mongodb.com/manual/core/backups/)
- [Mongoose Documentation](https://mongoosejs.com/)
- Main database documentation: `../../DATABASE.md`

## Support

For issues with these scripts:
1. Check the error messages in the console
2. Review MongoDB logs: `/var/log/mongodb/mongod.log`
3. Verify environment configuration
4. Check MongoDB connection and permissions
