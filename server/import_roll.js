// server/import_rolls.js

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const XLSX = require('xlsx'); // Use XLSX for Excel files
const ApprovedRoll = require('./models/approvedRoll.model'); // Correct path
require('dotenv').config(); // Loads .env from the 'server' folder

const importRolls = async () => {
  // 1. Connect to Database
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not found. Please check your server/.env file.");
    return;
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected...');

  try {
    // 2. Define File Path
    // Looks for 'myList.xlsx' in the SAME 'server' directory
    const filePath = path.join(__dirname, 'myList.xlsx');

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      console.error('Please make sure "myList.xlsx" is in the "server" directory.');
      return;
    }

    // 3. Read Excel File
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    console.log(`Found ${rows.length} rows in ${filePath}.`);

    // 4. Prepare Bulk Operations
    const operations = [];
    const rollNumbersInFile = new Set(); 

    for (const r of rows) {
      let rollNumber = r.rollNumber || r.Roll || Object.values(r)[0] || "";
      rollNumber = String(rollNumber).trim();

      if (!rollNumber) continue;
      if (rollNumbersInFile.has(rollNumber)) continue;

      rollNumbersInFile.add(rollNumber);

      operations.push({
        updateOne: {
          filter: { rollNumber: rollNumber },
          update: { $set: { addedAt: new Date() } },
          upsert: true,
        },
      });
    }

    // 5. Execute Bulk Write
    if (operations.length > 0) {
      console.log(`Importing ${operations.length} unique roll numbers...`);
      const result = await ApprovedRoll.bulkWrite(operations, { ordered: false });
      console.log('✅ Successfully imported roll numbers!');
      console.log(`  Inserted: ${result.upsertedCount}`);
      console.log(`  Updated: ${result.modifiedCount}`);
    } else {
      console.log('No valid new roll numbers to import.');
    }

  } catch (error) {
    console.error('❌ Error during import:', error);
  } finally {
    // 6. Disconnect from Database
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
  }
};

// Run the function
importRolls();