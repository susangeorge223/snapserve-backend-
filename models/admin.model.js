const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  adminUsername: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    default: null
  },
  logoutTime: {
    type: Date,
    default: null
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Admin", AdminSchema, "admin");
