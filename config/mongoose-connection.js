const mongoose = require('mongoose');
const dbgr = require('debug')("development:mongoose");
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err.message));

module.exports = mongoose;
