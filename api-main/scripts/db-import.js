#!/usr/bin/env node

/**
 * Database Import Script
 * 
 * This script imports data from JSON files into MongoDB database.
 * Usage: node scripts/db-import.js [input-directory]
 * 
 * Example:
 *   node scripts/db-import.js ./backup
 *   node scripts/db-import.js /tmp/db-backup
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import config
require('dotenv').config();
const config = require('../config');

// Get input directory from command line or use default
const inputDir = process.argv[2] || path.join(__dirname, '../db-backup');

console.log('\x1b[36m%s\x1b[0m', '========================================');
console.log('\x1b[36m%s\x1b[0m', '  TravelPartner Database Import Tool');
console.log('\x1b[36m%s\x1b[0m', '========================================');
console.log('');
console.log('Database URI:', config.DATABASE_URI);
console.log('Input Directory:', inputDir);
console.log('');

// Check if input directory exists
if (!fs.existsSync(inputDir)) {
    console.error('\x1b[31m%s\x1b[0m', `✗ Error: Input directory does not exist: ${inputDir}`);
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(config.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('\x1b[32m%s\x1b[0m', '✓ Connected to MongoDB');
    console.log('');

    try {
        const db = mongoose.connection.db;

        // Read all JSON files from input directory
        const files = fs.readdirSync(inputDir)
            .filter(file => file.endsWith('.json') && file !== '_metadata.json');

        if (files.length === 0) {
            console.log('\x1b[33m%s\x1b[0m', '⚠ No JSON files found in input directory');
            process.exit(0);
        }

        console.log(`Found ${files.length} files to import:`);
        console.log('');

        let totalDocuments = 0;
        const importedCollections = [];

        // Import each file
        for (const file of files) {
            const collectionName = path.basename(file, '.json');
            const filePath = path.join(inputDir, file);
            
            try {
                // Read JSON file
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const documents = JSON.parse(fileContent);
                
                if (!Array.isArray(documents) || documents.length === 0) {
                    console.log(`\x1b[33m○\x1b[0m ${collectionName.padEnd(30)} - no data (skipped)`);
                    continue;
                }

                // Get collection
                const collection = db.collection(collectionName);
                
                // Insert documents
                const result = await collection.insertMany(documents, { ordered: false });
                const count = result.insertedCount;
                
                console.log(`\x1b[32m✓\x1b[0m ${collectionName.padEnd(30)} - ${count} documents imported`);
                
                totalDocuments += count;
                importedCollections.push({
                    name: collectionName,
                    count: count
                });

            } catch (error) {
                if (error.code === 11000) {
                    // Duplicate key error - some documents already exist
                    console.log(`\x1b[33m⚠\x1b[0m ${collectionName.padEnd(30)} - partial import (some duplicates)`);
                } else {
                    console.error(`\x1b[31m✗\x1b[0m ${collectionName.padEnd(30)} - error: ${error.message}`);
                }
            }
        }

        console.log('');
        console.log('\x1b[36m%s\x1b[0m', '========================================');
        console.log('\x1b[32m%s\x1b[0m', `✓ Import completed!`);
        console.log('\x1b[36m%s\x1b[0m', '========================================');
        console.log('');
        console.log(`Total Collections: ${importedCollections.length}`);
        console.log(`Total Documents: ${totalDocuments}`);
        console.log('');

        // Check for metadata file
        const metadataPath = path.join(inputDir, '_metadata.json');
        if (fs.existsSync(metadataPath)) {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            console.log('Import Source Information:');
            console.log(`  Export Date: ${metadata.exportDate}`);
            console.log(`  Source Database: ${metadata.databaseName}`);
            console.log(`  Expected Collections: ${metadata.totalCollections}`);
            console.log(`  Expected Documents: ${metadata.totalDocuments}`);
            console.log('');
        }

    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', '✗ Import failed:', error.message);
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
