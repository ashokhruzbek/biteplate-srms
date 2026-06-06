// Order History uchun API routelari

const express = require("express");
const OrderHistoryController = require("../controllers/OrderHistoryController");

const router = express.Router();

// GET /api/order-history - Barcha order history yoki date range bo'yicha
router.get("/", (req, res) => OrderHistoryController.getAllHistory(req, res));

// GET /api/order-history/iterate - Iterator orqali history traversal
router.get("/iterate", (req, res) =>
  OrderHistoryController.iterateAllHistory(req, res)
);

// GET /api/order-history/table/:tableId - Table bo'yicha history
router.get("/table/:tableId", (req, res) =>
  OrderHistoryController.getOrdersByTable(req, res)
);

// GET /api/order-history/popular-item - Eng popular menu item
router.get("/popular-item", (req, res) =>
  OrderHistoryController.getMostPopularMenuItem(req, res)
);

module.exports = router;
