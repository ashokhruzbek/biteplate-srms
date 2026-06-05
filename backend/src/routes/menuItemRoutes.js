// Menu item-lar uchun API routelari
// Routes - qaysi URL ga qaysi controller method ishlatilishini belgilaydi

const express = require("express");
const MenuItemController = require("../controllers/MenuItemController");

const router = express.Router();

// POST /api/menu-items - Yangi menu item qo'shish
router.post("/", (req, res) => MenuItemController.createMenuItem(req, res));

// GET /api/menu-items - Barcha menu item-larni olish
router.get("/", (req, res) => MenuItemController.getAllMenuItems(req, res));

// GET /api/menu-items/:id - Bir menu item-ni ID bo'yicha olish (optional)
router.get("/:id", (req, res) => MenuItemController.getMenuItemById(req, res));

module.exports = router;
