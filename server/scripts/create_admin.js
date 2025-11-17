/*
 * Run this script ONCE to create your admin account.
 * Usage (from 'server' folder): node scripts/create_admin.js
*/
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const readline = require("readline");
const Admin = require("../models/admin_jobs.model"); // <-- UPDATED
require("dotenv").config({ path: "./.env" }); // Make sure it finds .env

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const createAdmin = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not found. Check .env file.");
    rl.close();
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");

    rl.question("Enter admin email: ", (email) => {
      rl.question("Enter admin password: ", async (password) => {
        if (!email || !password) {
          console.error("Email and password are required.");
          rl.close();
          await mongoose.disconnect();
          return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Use updateOne with upsert: true
        // This will create the admin if they don't exist, or update their password if they do.
        await Admin.updateOne(
          { email: email.toLowerCase() },
          {
            $set: {
              passwordHash: passwordHash
            }
          },
          { upsert: true }
        );

        console.log(`✅ Admin account for ${email} created/updated successfully.`);
        rl.close();
        await mongoose.disconnect();
      });
    });

  } catch (err) {
    console.error("❌ Error creating admin:", err);
    rl.close();
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();