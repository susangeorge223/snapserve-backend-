const mongoose = require("mongoose");

const UserBehaviorSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },
  action: {
    type: String,
    enum: ['view', 'order'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  contextual: {
    timeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night']
    },
    weather: {
      type: String,
      enum: ['sunny', 'cloudy', 'rainy', 'hot', 'cold']
    }
  }
});

module.exports = mongoose.model("UserBehavior", UserBehaviorSchema);