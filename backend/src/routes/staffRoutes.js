// Xodimlar uchun API routelari
// Routes - qaysi URL ga qaysi controller method ishlatilishini belgilaydi

const express = require("express");
const StaffController = require("../controllers/StaffController");

const router = express.Router();

// POST /staff - Yangi xodim qo'shish
router.post("/", (req, res) => StaffController.createStaff(req, res));

// GET /staff - Barcha xodimlarni olish
router.get("/", (req, res) => StaffController.getAllStaff(req, res));

// GET /staff/:id - Bir xodimni ID bo'yicha olish
router.get("/:id", (req, res) => StaffController.getStaffById(req, res));

module.exports = router;
