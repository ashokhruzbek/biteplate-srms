// Menu item-lar bilan ish logikasi
// Service - validation va business logic bu yerda

const MenuItemRepository = require("../repositories/MenuItemRepository");

class MenuItemService {
  // Yangi menu item qo'shish
  async createMenuItem(name, description, category, basePrice) {
    // 1. Kerakli fieldlarni tekshirish
    if (!name || !description || !category || !basePrice) {
      throw new Error("Nom, tavsif, kategoriya va narx to'ldirilishi kerak");
    }

    // 2. Narx tekshirish (raqam bo'lish)
    if (isNaN(basePrice)) {
      throw new Error("Narx raqam bo'lishi kerak");
    }

    // 3. Narx 0 dan katta bo'lishini tekshirish
    if (parseFloat(basePrice) <= 0) {
      throw new Error("Narx 0 dan katta bo'lishi kerak");
    }

    // 4. Nom string bo'lishini tekshirish
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Nom satrli bo'lishi kerak");
    }

    // 5. Menu item yaratish
    const newMenuItem = await MenuItemRepository.createMenuItem({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      basePrice: parseFloat(basePrice),
    });

    return newMenuItem;
  }

  // Barcha menu item-larni olish
  async getAllMenuItems() {
    const menuItems = await MenuItemRepository.getAllMenuItems();
    return menuItems;
  }

  // Bir menu item-ni ID bo'yicha olish
  async getMenuItemById(id) {
    // ID tekshirish
    if (!id || isNaN(id)) {
      throw new Error("ID raqam bo'lishi kerak");
    }

    const menuItem = await MenuItemRepository.getMenuItemById(id);

    if (!menuItem) {
      throw new Error("Menu item topilmadi");
    }

    return menuItem;
  }
}

module.exports = new MenuItemService();
