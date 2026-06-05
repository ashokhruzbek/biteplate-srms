// Buyurtmalar uchun API routelari
// Routes - qaysi URL ga qaysi controller method ishlatilishini belgilaydi

const express = require("express");
const OrderController = require("../controllers/OrderController");

const router = express.Router();

// POST /api/orders - Yangi buyurtma qo'shish
router.post("/", (req, res) => OrderController.createOrder(req, res));

// GET /api/orders - Barcha buyurtmalarni olish
router.get("/", (req, res) => OrderController.getAllOrders(req, res));

// GET /api/orders/:id - Bir buyurtmani ID bo'yicha olish
router.get("/:id", (req, res) => OrderController.getOrderById(req, res));

module.exports = router;
