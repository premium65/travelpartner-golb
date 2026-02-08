/**
 * Seed script to create the first superadmin user.
 * Run: node -r dotenv/config seedAdmin.js dotenv_config_path=local.env
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const DATABASE_URI = process.env.DATABASE_URI;

if (!DATABASE_URI) {
  console.error("ERROR: DATABASE_URI not set. Make sure local.env exists.");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  adminInviteId: { type: String, required: true },
  seqNo: { type: Number, default: 0 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["superadmin", "admin", "subadmin"] },
  restriction: { type: Array },
  google2Fa: {
    secret: { type: String, default: "" },
    uri: { type: String, default: "" },
  },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("admin", AdminSchema, "admin");

async function seed() {
  await mongoose.connect(DATABASE_URI);
  console.log("Connected to MongoDB");

  const existing = await Admin.findOne({ email: "admin@travelpartner.com" });
  if (existing) {
    console.log("Superadmin already exists. Skipping.");
    await mongoose.disconnect();
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync("Admin@123", salt);

  const admin = new Admin({
    name: "Super Admin",
    email: "admin@travelpartner.com",
    password: hashedPassword,
    adminInviteId: "SEED-ADMIN-001",
    role: "superadmin",
    seqNo: 1,
    restriction: [],
  });

  await admin.save();
  console.log("Superadmin created successfully!");
  console.log("  Email:    admin@travelpartner.com");
  console.log("  Password: Admin@123");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
