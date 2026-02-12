#!/usr/bin/env node

/**
 * Database Seed Script
 * 
 * This script initializes the database with sample/initial data.
 * Usage: node scripts/db-seed.js
 * 
 * Warning: This will add initial data to your database.
 */

const mongoose = require('mongoose');

// Import config
require('dotenv').config();
const config = require('../config');

// Import models
const models = require('../models');

console.log('\x1b[36m%s\x1b[0m', '========================================');
console.log('\x1b[36m%s\x1b[0m', '  TravelPartner Database Seed Script');
console.log('\x1b[36m%s\x1b[0m', '========================================');
console.log('');
console.log('Database URI:', config.DATABASE_URI);
console.log('');

// Connect to MongoDB
mongoose.connect(config.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('\x1b[32m%s\x1b[0m', '✓ Connected to MongoDB');
    console.log('');

    try {
        console.log('Seeding database with initial data...');
        console.log('');

        // 1. Create default admin user
        const adminExists = await models.Admin.findOne({ email: 'admin@travelpartner.com' });
        if (!adminExists) {
            const bcrypt = require('bcrypt');
            // Use environment variable or default password for initial setup
            const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            
            await models.Admin.create({
                name: 'System Admin',
                email: 'admin@travelpartner.com',
                password: hashedPassword,
                role: 'superadmin',
                status: 'active'
            });
            console.log('\x1b[32m✓\x1b[0m Created default admin user');
            console.log('   Email: admin@travelpartner.com');
            console.log(`   Password: ${defaultPassword}`);
            if (!process.env.DEFAULT_ADMIN_PASSWORD) {
                console.log('   \x1b[33m(Using default password. Set DEFAULT_ADMIN_PASSWORD env var to customize)\x1b[0m');
            }
        } else {
            console.log('\x1b[33m○\x1b[0m Admin user already exists');
        }

        // 2. Create default site settings
        const siteSettingExists = await models.SiteSetting.findOne();
        if (!siteSettingExists) {
            await models.SiteSetting.create({
                siteName: 'TravelPartner',
                siteTitle: 'TravelPartner - Your Travel Companion',
                siteDescription: 'Book amazing travel packages and earn rewards',
                siteEmail: 'support@travelpartner.com',
                sitePhone: '+1234567890',
                currency: 'USD',
                currencySymbol: '$',
                timezone: 'UTC',
                maintenanceMode: false
            });
            console.log('\x1b[32m✓\x1b[0m Created default site settings');
        } else {
            console.log('\x1b[33m○\x1b[0m Site settings already exist');
        }

        // 3. Create default FAQ categories
        const faqCategoryExists = await models.FaqCategory.findOne();
        if (!faqCategoryExists) {
            const categories = [
                { name: 'General', description: 'General questions' },
                { name: 'Booking', description: 'Questions about bookings' },
                { name: 'Payment', description: 'Payment related questions' },
                { name: 'Account', description: 'Account management questions' }
            ];
            await models.FaqCategory.insertMany(categories);
            console.log('\x1b[32m✓\x1b[0m Created default FAQ categories');
        } else {
            console.log('\x1b[33m○\x1b[0m FAQ categories already exist');
        }

        // 4. Create default support categories
        const supportCategoryExists = await models.SupportCategory.findOne();
        if (!supportCategoryExists) {
            const categories = [
                { name: 'Technical Support', description: 'Technical issues and bugs' },
                { name: 'Billing', description: 'Billing and payment issues' },
                { name: 'Account', description: 'Account related inquiries' },
                { name: 'General', description: 'General inquiries' }
            ];
            await models.SupportCategory.insertMany(categories);
            console.log('\x1b[32m✓\x1b[0m Created default support categories');
        } else {
            console.log('\x1b[33m○\x1b[0m Support categories already exist');
        }

        // 5. Create default email templates
        const emailTemplateExists = await models.EmailTemplate.findOne();
        if (!emailTemplateExists) {
            const templates = [
                {
                    name: 'Welcome Email',
                    subject: 'Welcome to TravelPartner',
                    body: '<h1>Welcome!</h1><p>Thank you for joining TravelPartner.</p>',
                    type: 'welcome'
                },
                {
                    name: 'Booking Confirmation',
                    subject: 'Booking Confirmed',
                    body: '<h1>Booking Confirmed</h1><p>Your booking has been confirmed.</p>',
                    type: 'booking_confirmation'
                },
                {
                    name: 'Password Reset',
                    subject: 'Reset Your Password',
                    body: '<h1>Password Reset</h1><p>Click the link to reset your password.</p>',
                    type: 'password_reset'
                }
            ];
            await models.EmailTemplate.insertMany(templates);
            console.log('\x1b[32m✓\x1b[0m Created default email templates');
        } else {
            console.log('\x1b[33m○\x1b[0m Email templates already exist');
        }

        // 6. Create default referral rewards
        const referralRewardExists = await models.ReferralReward.findOne();
        if (!referralRewardExists) {
            await models.ReferralReward.create({
                level: 1,
                percentage: 5,
                minBookingAmount: 0,
                maxReward: 1000,
                status: 'active'
            });
            console.log('\x1b[32m✓\x1b[0m Created default referral rewards');
        } else {
            console.log('\x1b[33m○\x1b[0m Referral rewards already exist');
        }

        // 7. Create default language
        const languageExists = await models.Language.findOne();
        if (!languageExists) {
            await models.Language.create({
                name: 'English',
                code: 'en',
                isDefault: true,
                status: 'active'
            });
            console.log('\x1b[32m✓\x1b[0m Created default language');
        } else {
            console.log('\x1b[33m○\x1b[0m Language already exists');
        }

        console.log('');
        console.log('\x1b[36m%s\x1b[0m', '========================================');
        console.log('\x1b[32m%s\x1b[0m', '✓ Database seeding completed!');
        console.log('\x1b[36m%s\x1b[0m', '========================================');
        console.log('');
        console.log('Default Admin Credentials:');
        console.log('  Email: admin@travelpartner.com');
        console.log(`  Password: ${process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123'}`);
        console.log('');
        console.log('\x1b[33m%s\x1b[0m', '⚠ Please change the default admin password after first login!');
        if (!process.env.DEFAULT_ADMIN_PASSWORD) {
            console.log('\x1b[33m%s\x1b[0m', '⚠ Tip: Set DEFAULT_ADMIN_PASSWORD environment variable to use a custom password.');
        }
        console.log('');

    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', '✗ Seeding failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\x1b[33m%s\x1b[0m', 'Database connection closed');
        process.exit(0);
    }
}).catch((error) => {
    console.error('\x1b[31m%s\x1b[0m', '✗ Failed to connect to MongoDB:', error.message);
    process.exit(1);
});
