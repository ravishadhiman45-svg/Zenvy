const mongoose = require('mongoose');
const dbgr = require('debug')("development:mongoose");

// Use environment variable from Vercel or .env
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Zenvy';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => dbgr('✅ MongoDB connected successfully'))
.catch((err) => dbgr('❌ MongoDB connection error:', err));

module.exports = mongoose.connection;
