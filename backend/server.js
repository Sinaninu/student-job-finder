import dns from "node:dns";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

// Your router DNS refused Node/Mongoose SRV lookups. Keep this unless your
// Windows DNS is permanently changed to a resolver that supports SRV lookup.
const dnsServers = process.env.DNS_SERVERS?.split(",").map((s) => s.trim()).filter(Boolean);
if (dnsServers?.length) {
  dns.setServers(dnsServers);
}
dns.setDefaultResultOrder("ipv4first");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Student Job Finder API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();