const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const UserBehavior = require("../models/userBehavior.model");
const axios = require("axios");
const { emitSocketEvent } = require("../socket");

// Helper functions from behavior routes
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

async function getWeather() {
  const weathers = ['sunny', 'cloudy', 'rainy', 'hot', 'cold'];
  return weathers[Math.floor(Math.random() * weathers.length)];
}

router.post("/", async (req, res) => {
  try {
    const { sessionId, items, totalAmount } = req.body;

    const order = await Order.create({
      sessionId,
      items,
      totalAmount
    });

    // Track behavior for each ordered item
    const contextual = {
      timeOfDay: getTimeOfDay(),
      weather: await getWeather()
    };

    // Get menu items to map names to IDs
    const Menu = require("../models/menu.model");
    for (const item of items) {
      const menuItem = await Menu.findOne({ name: item.name });
      if (menuItem) {
        await UserBehavior.create({
          sessionId,
          itemId: menuItem._id,
          action: 'order',
          contextual
        });
      }
    }

    emitSocketEvent('dataCreated', 'order', { id: order._id, status: order.status });
    res.json(order);
  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: "Order failed", error: error.message });
  }
});

router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.estimatedTime !== undefined) updates.estimatedTime = req.body.estimatedTime;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    emitSocketEvent('dataUpdated', 'order', { id: updatedOrder._id, status: updatedOrder.status });
    res.json(updatedOrder);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

module.exports = router;