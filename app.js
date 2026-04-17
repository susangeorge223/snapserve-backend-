const express = require("express");
const cors = require("cors");   // ✅ ADD THIS

const app = express();

const connectDB = require("./config/db");
const menuRoutes = require("./routes/menu.routes");
const sessionRoutes = require("./routes/session.routes");
const orderRoutes = require("./routes/order.routes");
const kitchenStaffRoutes = require("./routes/kitchenstaff.routes");
const behaviorRoutes = require("./routes/behavior.routes");
const recommendationRoutes = require("./routes/recommendation.routes");

connectDB();

app.use(cors());                // ✅ ADD THIS (VERY IMPORTANT)
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SnapServe backend running");
});

app.use("/menu", menuRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/kitchen-staff", kitchenStaffRoutes);
app.use("/api/behavior", behaviorRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.listen(3000, () => {
  console.log("SnapServe backend listening on port 3000");
});