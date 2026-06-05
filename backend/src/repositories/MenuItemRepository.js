// Menu item-lar bilan ma'lumotlar bazasi operatsiyalari
// Repository - faqat database querylar bu yerda

const prisma = require("../prisma/client");

class MenuItemRepository {
  // Yangi menu item qo'shish
  async createMenuItem(menuItemData) {
    try {
      const menuItem = await prisma.menuItem.create({
        data: {
          name: menuItemData.name,
          description: menuItemData.description,
          category: menuItemData.category,
          basePrice: menuItemData.basePrice,
          available: true, // Default value
        },
      });

      return menuItem;
    } catch (error) {
      throw new Error(`Menu item qo'shishda xato: ${error.message}`);
    }
  }

  // Barcha menu item-larni olish
  async getAllMenuItems() {
    try {
      const menuItems = await prisma.menuItem.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          basePrice: true,
          available: true,
        },
        orderBy: {
          category: "asc",
        },
      });

      return menuItems;
    } catch (error) {
      throw new Error(`Menu item-larni olishda xato: ${error.message}`);
    }
  }

  // ID bo'yicha bir menu item olish
  async getMenuItemById(id) {
    try {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          basePrice: true,
          available: true,
        },
      });

      return menuItem;
    } catch (error) {
      throw new Error(`Menu item olishda xato: ${error.message}`);
    }
  }
}

module.exports = new MenuItemRepository();
