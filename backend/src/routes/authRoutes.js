// Auth uchun API routelari

const express = require("express");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

// POST /api/auth/login - Telefon raqam va parol orqali login
router.post("/login", (req, res) => AuthController.login(req, res));

module.exports = router;
