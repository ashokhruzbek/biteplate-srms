// Buyurtmalar uchun API routelari
// Routes - qaysi URL ga qaysi controller method ishlatilishini belgilaydi

const express = require("express");
const OrderController = require("../controllers/OrderController");

const router = express.Router();

// POST /api/orders - Yangi buyurtma qo'shish
router.post("/", (req, res) => OrderController.createOrder(req, res));

// POST /api/orders/undo-last-action - Oxirgi kitchen action-ni undo qilish
router.post("/undo-last-action", (req, res) =>
  OrderController.undoLastKitchenAction(req, res)
);

// GET /api/orders - Barcha buyurtmalarni olish
router.get("/", (req, res) => OrderController.getAllOrders(req, res));

// PATCH /api/orders/:id/prepare - Buyurtmani PREPARING qilish
router.patch("/:id/prepare", (req, res) =>
  OrderController.prepareOrder(req, res)
);

// PATCH /api/orders/:id/cancel - Buyurtmani CANCELLED qilish
router.patch("/:id/cancel", (req, res) =>
  OrderController.cancelOrder(req, res)
);

// GET /api/orders/:id - Bir buyurtmani ID bo'yicha olish
router.get("/:id", (req, res) => OrderController.getOrderById(req, res));

module.exports = router;
