import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

// Usage:
// npm run create-admin
// Optional overrides:
// ADMIN_NAME="Your Name" ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="StrongPass123!" npm run create-admin

dotenv.config();

const adminName = process.env.ADMIN_NAME || "Admin User";
const adminEmail = (process.env.ADMIN_EMAIL || "admin@studentjobfinder.com").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.name = adminName;
      existingAdmin.role = "admin";
      existingAdmin.password = await bcrypt.hash(adminPassword, 10);
      await existingAdmin.save();

      console.log("Admin account updated successfully.");
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      process.exit(0);
    }

    await User.create({
      name: adminName,
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      role: "admin",
    });

    console.log("Admin account created successfully.");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error("Could not create admin account:", error.message);
    process.exit(1);
  }
};

createAdmin();
