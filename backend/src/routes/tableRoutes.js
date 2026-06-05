// Stollar uchun API routelari
// Routes - qaysi URL ga qaysi controller method ishlatilishini belgilaydi

const express = require("express");
const TableController = require("../controllers/TableController");

const router = express.Router();

// POST /api/tables - Yangi stol qo'shish
router.post("/", (req, res) => TableController.createTable(req, res));

// GET /api/tables - Barcha stollarni olish
router.get("/", (req, res) => TableController.getAllTables(req, res));

// GET /api/tables/:id - Bir stolni ID bo'yicha olish
router.get("/:id", (req, res) => TableController.getTableById(req, res));

// PATCH /api/tables/:id/status - Stol statusini o'zgartirish
router.patch("/:id/status", (req, res) =>
  TableController.updateTableStatus(req, res)
);

module.exports = router;
