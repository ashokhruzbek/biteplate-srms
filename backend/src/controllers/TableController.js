// Stollar uchun HTTP request/response handleri
// Controller - API qo'ngiroqlarni qabul qiladi va service ga o'tkazadi

const TableService = require("../services/TableService");

class TableController {
  // Yangi stol qo'shish
  async createTable(req, res) {
    try {
      // Request bodydan ma'lumotlarni olish
      const { tableNumber, capacity } = req.body;

      // Service-ga o'tkazish
      const newTable = await TableService.createTable(tableNumber, capacity);

      // Muvaffaqiyatli javob
      res.status(201).json({
        success: true,
        message: "Stol muvaffaqiyatli qo'shildi",
        data: newTable,
      });
    } catch (error) {
      // Xato javob
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Barcha stollarni olish
  async getAllTables(req, res) {
    try {
      const tables = await TableService.getAllTables();

      res.status(200).json({
        success: true,
        message: "Stollar ro'yxati",
        data: tables,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Bir stolni olish
  async getTableById(req, res) {
    try {
      const { id } = req.params;

      const table = await TableService.getTableById(id);

      res.status(200).json({
        success: true,
        message: "Stol ma'lumotlari",
        data: table,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Stol statusini o'zgartirish
  async updateTableStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Status mavjudligini tekshirish
      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status kiritilishi kerak",
        });
      }

      const updatedTable = await TableService.updateTableStatus(id, status);

      res.status(200).json({
        success: true,
        message: "Stol statusi o'zgartirildi",
        data: updatedTable,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new TableController();
