const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/role.middleware");
const { emitSocketEvent } = require("../socket");

// Admin login with JWT
router.post("/login", async (req, res) => {
  try {
    const { adminUsername, password } = req.body;
    console.log("🔓 Admin login attempt:", { adminUsername });

    if (!adminUsername || !password) {
      return res.status(400).json({ message: "Admin username and password required" });
    }

    const admin = await Admin.findOne({ adminUsername });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Update login tracking
    admin.loginTime = new Date();
    admin.isLoggedIn = true;
    admin.logoutTime = null;
    await admin.save();

    res.json({
      success: true,
      message: "Admin logged in",
      token,
      admin: {
        id: admin._id,
        adminUsername: admin.adminUsername,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error("❌ Admin login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Protect all subsequent routes with authentication and admin role
router.use(authMiddleware);
router.use(requireAdmin);

// Admin logout with logout time tracking
router.post("/logout", async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.logoutTime = new Date();
    admin.isLoggedIn = false;
    await admin.save();
    console.log("✅ Admin logout recorded:", admin);

    emitSocketEvent('stateChanged', 'admin', { id: admin._id, status: 'logged_out' });

    res.json({ success: true, message: "Admin logged out" });
  } catch (error) {
    console.error("❌ Admin logout error:", error);
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
});

// Get admin login history
router.get("/login-history", async (req, res) => {
  try {
    const admins = await Admin.find().sort({ loginTime: -1 });
    res.json(admins);
  } catch (error) {
    console.error("Error fetching admin history:", error);
    res.status(500).json({ message: "Failed to fetch admin history", error: error.message });
  }
});

module.exports = router;
