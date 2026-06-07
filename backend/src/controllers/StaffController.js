// Xodimlar uchun HTTP request/response handleri
// Controller - API qo'ngiroqlarni qabul qiladi va sercvice ga o'tkazadi

const StaffService = require("../services/StaffService");

class StaffController {
  // Yangi xodim qo'shish
  async createStaff(req, res) {
    try {
      // Request bodydan ma'lumotlarni olish
      const { fullName, phoneNumber, password, role } = req.body;

      // Service-ga o'tkazish
      const newStaff = await StaffService.createStaff(
        fullName,
        phoneNumber,
        password,
        role
      );

      // Muvaffaqiyatli javob
      res.status(201).json({
        success: true,
        message: "Xodim muvaffaqiyatli qo'shildi",
        data: newStaff,
      });
    } catch (error) {
      // Xato javob
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Barcha xodimlarni olish
  async getAllStaff(req, res) {
    try {
      const staffList = await StaffService.getAllStaff();

      res.status(200).json({
        success: true,
        message: "Xodimlar ro'yxati",
        data: staffList,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Bir xodimni olish
  async getStaffById(req, res) {
    try {
      const { id } = req.params;

      const staff = await StaffService.getStaffById(id);

      res.status(200).json({
        success: true,
        message: "Xodim ma'lumotlari",
        data: staff,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new StaffController();
