// Middleware for admin only access
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admin role required." });
  }
  next();
};

// Middleware for kitchen or admin access
const requireKitchenOrAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'kitchen') {
    return res.status(403).json({ message: "Access denied. Admin or kitchen role required." });
  }
  next();
};

module.exports = {
  requireAdmin,
  requireKitchenOrAdmin
};