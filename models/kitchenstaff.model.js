const mongoose = require("mongoose");

const KitchenStaffSchema = new mongoose.Schema({
  staffName: {
    type: String,
    required: true
  },
  staffUsername: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  entryTime: {
    type: Date,
    default: null
  },
  exitTime: {
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

module.exports = mongoose.model("Kitchen", KitchenStaffSchema, "kitchen");
