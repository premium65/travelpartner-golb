#!/usr/bin/env node

/**
 * Database Export Script
 * 
 * This script exports the MongoDB database to JSON files.
 * Usage: node scripts/db-export.js [output-directory]
 * 
 * Example:
 *   node scripts/db-export.js ./backup
 *   node scripts/db-export.js /tmp/db-backup
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import config
require('dotenv').config();
const config = require('../config');

// Get output directory from command line or use default
const outputDir = process.argv[2] || path.join(__dirname, '../db-backup');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('\x1b[36m%s\x1b[0m', '========================================');
console.log('\x1b[36m%s\x1b[0m', '  TravelPartner Database Export Tool');
console.log('\x1b[36m%s\x1b[0m', '========================================');
console.log('');
console.log('Database URI:', config.DATABASE_URI);
console.log('Output Directory:', outputDir);
console.log('');

// Connect to MongoDB
mongoose.connect(config.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('\x1b[32m%s\x1b[0m', '✓ Connected to MongoDB');
    console.log('');

    try {
        // Get all collections
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        
        console.log(`Found ${collections.length} collections to export:`);
        console.log('');

        let totalDocuments = 0;
        const exportedCollections = [];

        // Export each collection
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            
            // Skip system collections
            if (collectionName.startsWith('system.')) {
                continue;
            }

            const collection = db.collection(collectionName);
            const documents = await collection.find({}).toArray();
            const count = documents.length;
            
            if (count > 0) {
                // Write to JSON file
                const filename = path.join(outputDir, `${collectionName}.json`);
                fs.writeFileSync(filename, JSON.stringify(documents, null, 2));
                
                console.log(`\x1b[32m✓\x1b[0m ${collectionName.padEnd(30)} - ${count} documents exported`);
                
                totalDocuments += count;
                exportedCollections.push({
                    name: collectionName,
                    count: count,
                    file: `${collectionName}.json`
                });
            } else {
                console.log(`\x1b[33m○\x1b[0m ${collectionName.padEnd(30)} - empty (skipped)`);
            }
        }

        // Create metadata file
        const metadata = {
            exportDate: new Date().toISOString(),
            databaseName: db.databaseName,
            totalCollections: exportedCollections.length,
            totalDocuments: totalDocuments,
            collections: exportedCollections
        };

        fs.writeFileSync(
            path.join(outputDir, '_metadata.json'),
            JSON.stringify(metadata, null, 2)
        );

        console.log('');
        console.log('\x1b[36m%s\x1b[0m', '========================================');
        console.log('\x1b[32m%s\x1b[0m', `✓ Export completed successfully!`);
        console.log('\x1b[36m%s\x1b[0m', '========================================');
        console.log('');
        console.log(`Total Collections: ${exportedCollections.length}`);
        console.log(`Total Documents: ${totalDocuments}`);
        console.log(`Output Directory: ${outputDir}`);
        console.log('');
        console.log('Files created:');
        console.log(`  - _metadata.json (export information)`);
        exportedCollections.forEach(col => {
            console.log(`  - ${col.file}`);
        });
        console.log('');

    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', '✗ Export failed:', error.message);
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
