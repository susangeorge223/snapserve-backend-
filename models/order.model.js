const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

  sessionId: String,
  tableId: String,

  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],

  totalAmount: Number,

  status:{
    type:String,
    default:"pending"
  },

  estimatedTime: {
    type: Number, // in minutes
    default: null
  },

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model("Order", OrderSchema);