const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: String,
  createdAt: Date
});

const SessionSchema = new mongoose.Schema({
  sessionId: String,
  userId: String,
  restaurantId: String,
  createdAt: Date
});

const User = mongoose.model("User", UserSchema);
const Session = mongoose.model("Session", SessionSchema);

router.post("/start", async (req, res) => {
  const { userId } = req.body;

  let user;

  if (userId) {
    user = await User.findOne({ userId });
  }

  if (!user) {
    user = await User.create({
      userId: uuidv4(),
      createdAt: new Date()
    });
  }

  const session = await Session.create({
    sessionId: uuidv4(),
    userId: user.userId,
    restaurantId: "REST123",
    createdAt: new Date()
  });

  res.json({
    userId: user.userId,
    sessionId: session.sessionId
  });
});

module.exports = router;