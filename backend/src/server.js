const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
require("dotenv").config();

// Routes import qilish
const staffRoutes = require("./routes/staffRoutes");
const tableRoutes = require("./routes/tableRoutes");
const orderRoutes = require("./routes/orderRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const orderHistoryRoutes = require("./routes/orderHistoryRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger API documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
  }),
);

// API Routes
app.get("/", (req, res) => {
  res.json({
    message: "BitePlate API Running ✅",
    version: "1.0.0",
    endpoints: {
      staff: "/api/staff",
      tables: "/api/tables",
      "menu-items": "/api/menu-items",
      orders: "/api/orders",
      "order-history": "/api/order-history",
      auth: "/api/auth/login",
      docs: "/api-docs"
    }
  });
});

// Auth routelari
app.use("/api/auth", authRoutes);

// Xodimlar routelari
app.use("/api/staff", staffRoutes);

// Stollar routelari
app.use("/api/tables", tableRoutes);

// Menu item-lar routelari
app.use("/api/menu-items", menuItemRoutes);

// Buyurtmalar routelari
app.use("/api/orders", orderRoutes);

// Order history routelari
app.use("/api/order-history", orderHistoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlayapti...`);
});
