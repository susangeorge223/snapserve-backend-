const mongoose = require("mongoose");

const KitchenStaffHistorySchema = new mongoose.Schema({
  staffName: {
    type: String,
    required: true
  },
  staffUsername: {
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ["login", "logout"],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("KitchenStaffHistory", KitchenStaffHistorySchema);
