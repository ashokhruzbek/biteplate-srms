// Auth uchun HTTP request/response handleri

const AuthService = require("../services/AuthService");

class AuthController {
  // POST /api/auth/login
  async login(req, res) {
    try {
      const { phoneNumber, password } = req.body;

      const user = await AuthService.login(phoneNumber, password);

      res.status(200).json({
        success: true,
        message: "Tizimga muvaffaqiyatli kirildi",
        data: user,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
