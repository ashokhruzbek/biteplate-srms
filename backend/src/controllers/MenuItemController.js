// Menu item-lar uchun HTTP request/response handleri
// Controller - API qo'ngiroqlarni qabul qiladi va service ga o'tkazadi

const MenuItemService = require("../services/MenuItemService");

class MenuItemController {
  // Yangi menu item qo'shish
  async createMenuItem(req, res) {
    try {
      // Request bodydan ma'lumotlarni olish
      const { name, description, category, basePrice } = req.body;

      // Service-ga o'tkazish
      const newMenuItem = await MenuItemService.createMenuItem(
        name,
        description,
        category,
        basePrice
      );

      // Muvaffaqiyatli javob
      res.status(201).json({
        success: true,
        message: "Menu item muvaffaqiyatli qo'shildi",
        data: newMenuItem,
      });
    } catch (error) {
      // Xato javob
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Barcha menu item-larni olish
  async getAllMenuItems(req, res) {
    try {
      const menuItems = await MenuItemService.getAllMenuItems();

      res.status(200).json({
        success: true,
        message: "Menu item-lar ro'yxati",
        data: menuItems,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Bir menu item-ni olish (optional)
  async getMenuItemById(req, res) {
    try {
      const { id } = req.params;

      const menuItem = await MenuItemService.getMenuItemById(id);

      res.status(200).json({
        success: true,
        message: "Menu item ma'lumotlari",
        data: menuItem,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new MenuItemController();
