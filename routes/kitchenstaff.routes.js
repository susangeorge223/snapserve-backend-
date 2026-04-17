const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const KitchenStaff = require("../models/kitchenstaff.model");
const KitchenStaffHistory = require("../models/kitchenstaffhistory.model");
const authMiddleware = require("../middleware/auth.middleware");
const { requireKitchenOrAdmin } = require("../middleware/role.middleware");
const { emitSocketEvent } = require("../socket");

// Staff login with JWT
router.post("/login", async (req, res) => {
  try {
    const { staffUsername, staffName, password } = req.body;
    console.log("🔓 Staff login attempt:", { staffUsername, staffName });

    if (!staffUsername || !password) {
      return res.status(400).json({ message: "Staff username and password required" });
    }

    const staff = await KitchenStaff.findOne({ staffUsername });

    if (!staff) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: staff._id, role: 'kitchen' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Update login tracking
    staff.entryTime = new Date();
    staff.isLoggedIn = true;
    staff.exitTime = null;
    await staff.save();

    // Save login history
    const history = await KitchenStaffHistory.create({
      staffName: staff.staffName,
      staffUsername: staff.staffUsername,
      action: "login",
      timestamp: new Date()
    });
    console.log("📝 Login history saved:", history);

    res.json({
      success: true,
      message: "Staff logged in",
      token,
      staff: {
        id: staff._id,
        staffUsername: staff.staffUsername,
        staffName: staff.staffName,
        role: 'kitchen'
      },
      history
    });
  } catch (error) {
    console.error("❌ Staff login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Protect all subsequent routes with authentication and kitchen/admin role
router.use(authMiddleware);
router.use(requireKitchenOrAdmin);

// Test endpoint to create a staff entry manually
router.post("/test-login", async (req, res) => {
  try {
    console.log("🧪 TEST: Creating test staff entry");
    const hashedPassword = await bcrypt.hash("1234", 10);
    const staff = await KitchenStaff.create({
      staffName: "Test Kitchen Staff",
      staffUsername: "test-staff",
      password: hashedPassword,
      entryTime: new Date(),
      isLoggedIn: true,
      exitTime: null
    });
    console.log("✅ TEST: Staff created:", staff);
    res.json({ success: true, message: "Test staff created", staff });
  } catch (error) {
    console.error("❌ TEST: Error creating staff:", error);
    res.status(500).json({ message: "Test failed", error: error.message });
  }
});

// Get all kitchen staff with their login status
router.get("/", async (req, res) => {
  try {
    const staff = await KitchenStaff.find().sort({ entryTime: -1 });
    console.log("📊 Fetching kitchen staff:", staff);
    res.json(staff);
  } catch (error) {
    console.error("Error fetching kitchen staff:", error);
    res.status(500).json({ message: "Failed to fetch staff", error: error.message });
  }
});

// Staff logout
router.post("/logout", async (req, res) => {
  try {
    const staff = await KitchenStaff.findById(req.user.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.exitTime = new Date();
    staff.isLoggedIn = false;
    await staff.save();
    console.log("✅ Staff logout recorded:", staff);

    // Save logout history
    const history = await KitchenStaffHistory.create({
      staffName: staff.staffName,
      staffUsername: staff.staffUsername,
      action: "logout",
      timestamp: new Date()
    });
    console.log("📝 Logout history saved:", history);

    emitSocketEvent('stateChanged', 'kitchen-staff', { id: staff._id, status: 'logged_out' });

    res.json({ success: true, message: "Staff logged out", history });
  } catch (error) {
    console.error("Staff logout error:", error);
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
});

// Get staff login/logout history
router.get("/history", async (req, res) => {
  try {
    const history = await KitchenStaffHistory.find().sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Failed to fetch history", error: error.message });
  }
});

// Get history for specific staff
router.get("/history/:staffUsername", async (req, res) => {
  try {
    const { staffUsername } = req.params;
    const history = await KitchenStaffHistory.find({ staffUsername }).sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Failed to fetch history", error: error.message });
  }
});

module.exports = router;
