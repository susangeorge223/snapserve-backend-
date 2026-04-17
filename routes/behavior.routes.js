const express = require("express");
const router = express.Router();
const UserBehavior = require("../models/userBehavior.model");
const axios = require("axios");

// Helper to get time of day
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// Mock weather function - in production, use real API
async function getWeather() {
  // For demo, return random weather
  const weathers = ['sunny', 'cloudy', 'rainy', 'hot', 'cold'];
  return weathers[Math.floor(Math.random() * weathers.length)];

  // Real implementation:
  // try {
  //   const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=YourCity&appid=YOUR_API_KEY`);
  //   const temp = response.data.main.temp - 273.15; // Kelvin to Celsius
  //   if (temp > 30) return 'hot';
  //   if (temp < 15) return 'cold';
  //   if (response.data.weather[0].main.toLowerCase().includes('rain')) return 'rainy';
  //   if (response.data.weather[0].main.toLowerCase().includes('cloud')) return 'cloudy';
  //   return 'sunny';
  // } catch (error) {
  //   return 'sunny'; // default
  // }
}

// Track item view
router.post("/view", async (req, res) => {
  try {
    const { sessionId, itemId } = req.body;

    if (!sessionId || !itemId) {
      return res.status(400).json({ message: "sessionId and itemId required" });
    }

    const contextual = {
      timeOfDay: getTimeOfDay(),
      weather: await getWeather()
    };

    const behavior = await UserBehavior.create({
      sessionId,
      itemId,
      action: 'view',
      contextual
    });

    res.json({ message: "View tracked", behavior });
  } catch (error) {
    console.error("Track view error:", error);
    res.status(500).json({ message: "Failed to track view", error: error.message });
  }
});

// Track item order (called when order is placed)
router.post("/order", async (req, res) => {
  try {
    const { sessionId, itemId } = req.body;

    if (!sessionId || !itemId) {
      return res.status(400).json({ message: "sessionId and itemId required" });
    }

    const contextual = {
      timeOfDay: getTimeOfDay(),
      weather: await getWeather()
    };

    const behavior = await UserBehavior.create({
      sessionId,
      itemId,
      action: 'order',
      contextual
    });

    res.json({ message: "Order tracked", behavior });
  } catch (error) {
    console.error("Track order error:", error);
    res.status(500).json({ message: "Failed to track order", error: error.message });
  }
});

// Get behavior data for a session
router.get("/session/:sessionId", async (req, res) => {
  try {
    const behaviors = await UserBehavior.find({ sessionId: req.params.sessionId })
      .sort({ timestamp: -1 });
    res.json(behaviors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch behaviors", error: error.message });
  }
});

module.exports = router;