const express = require("express");
const router = express.Router();
const axios = require("axios");
const Menu = require("../models/menu.model");

// Helper functions
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

async function getWeather(lat = 13.0827, lon = 80.2707) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data;
    const temp = data.current_weather.temperature;
    const weatherCode = data.current_weather.weathercode;

    // Map temperature
    if (temp > 30) {
      return "hot";
    } else if (temp < 15) {
      return "cold";
    } else {
      // Map weather code
      if (weatherCode === 0) {
        return "sunny"; // Clear sky
      } else if (weatherCode >= 1 && weatherCode <= 3) {
        return "cloudy"; // Partly cloudy to overcast
      } else if (weatherCode >= 61 && weatherCode <= 67) {
        return "rainy"; // Rain
      } else if (weatherCode >= 51 && weatherCode <= 55) {
        return "rainy"; // Drizzle
      } else {
        return "sunny"; // Default
      }
    }
  } catch (error) {
    console.log(`Failed to fetch weather: ${error.message}, using random`);
    const weathers = ['sunny', 'cloudy', 'rainy', 'hot', 'cold'];
    return weathers[Math.floor(Math.random() * weathers.length)];
  }
}

// Get recommendations
router.get("/", async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    const lat = parseFloat(req.query.lat) || 13.0827; // Default to Chennai
    const lon = parseFloat(req.query.lon) || 80.2707;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId required" });
    }

    const contextual = {
      timeOfDay: getTimeOfDay(),
      weather: await getWeather(lat, lon)
    };

    // Call ML service
    let categorizedRecs = { weather: [], time: [], orders: [], popular: [] };
    try {
      const mlResponse = await axios.post("http://localhost:5001/predict", {
        sessionId,
        contextual
      });
      categorizedRecs = mlResponse.data;
    } catch (error) {
      console.error("ML service error:", error);
      // Fallback to simple popularity-based
      const orders = await require("../models/order.model").find();
      const itemCounts = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
      });
      const popularItems = Object.entries(itemCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .map(([name]) => name);

      categorizedRecs.popular = [];
      for (const name of popularItems) {
        const menuItem = await Menu.findOne({ name });
        if (menuItem) {
          categorizedRecs.popular.push({
            itemId: menuItem._id.toString(),
            name: menuItem.name
          });
        }
      }
    }

    // Map all categorized items to full menu item details
    const result = {
      weather: [],
      time: [],
      orders: [],
      popular: []
    };

    for (const category of Object.keys(result)) {
      for (const item of categorizedRecs[category] || []) {
        const itemId = item.itemId || item._id;
        const menuItem = await Menu.findById(itemId);
        if (menuItem && menuItem.available) {
          result[category].push({
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            category: menuItem.category
          });
        }
      }
    }

    res.json(result);
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Failed to get recommendations", error: error.message });
  }
});

module.exports = router;