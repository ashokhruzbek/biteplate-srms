// Buyurtmalar bilan ish logikasi
// Service - validation va business logic bu yerda

const OrderRepository = require("../repositories/OrderRepository");

class OrderService {
  // Yangi buyurtma qo'shish
  async createOrder(tableId, waiterId, items) {
    // 1. Kerakli fieldlarni tekshirish
    if (!tableId || !waiterId || !items) {
      throw new Error("tableId, waiterId va items to'ldirilishi kerak");
    }

    // 2. Items array bo'lishini tekshirish
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items kam bo'ladi 1 ta item");
    }

    // 3. Stol mavjudligini tekshirish
    const tableExists = await OrderRepository.checkTableExists(tableId);
    if (!tableExists) {
      throw new Error("Stol topilmadi");
    }

    // 4. Xodim mavjudligini tekshirish
    const waiterExists = await OrderRepository.checkWaiterExists(waiterId);
    if (!waiterExists) {
      throw new Error("Xodim topilmadi");
    }

    // 5. Menu items-larni tekshirish va total hisoblash
    let totalAmount = 0;
    const preparedItems = [];

    for (const item of items) {
      // Item validation
      if (!item.menuItemId || !item.quantity) {
        throw new Error("Har bir item-da menuItemId va quantity bo'lishi kerak");
      }

      if (isNaN(item.menuItemId) || isNaN(item.quantity)) {
        throw new Error("menuItemId va quantity raqam bo'lishi kerak");
      }

      if (item.quantity <= 0) {
        throw new Error("Quantity 0 dan katta bo'lishi kerak");
      }

      // Menu item-ni database dan olish
      const menuItem = await OrderRepository.getMenuItemById(item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ID ${item.menuItemId} topilmadi`);
      }

      // Item available bo'lishini tekshirish
      if (!menuItem.available) {
        throw new Error(
          `"${menuItem.name}" mavjud emas (available: false)`
        );
      }

      // Narxni hisoblash
      const itemPrice = menuItem.basePrice * item.quantity;
      totalAmount += itemPrice;

      // Item prepare qilish (database-ga yozish uchun)
      preparedItems.push({
        menuItemId: parseInt(item.menuItemId),
        quantity: parseInt(item.quantity),
        price: itemPrice,
      });
    }

    // 6. Buyurtma yaratish
    const orderData = {
      tableId: parseInt(tableId),
      waiterId: parseInt(waiterId),
      totalAmount,
      items: preparedItems,
    };

    const newOrder = await OrderRepository.createOrder(orderData);

    return newOrder;
  }

  // Barcha buyurtmalarni olish
  async getAllOrders() {
    const orders = await OrderRepository.getAllOrders();
    return orders;
  }

  // Bir buyurtmani ID bo'yicha olish
  async getOrderById(id) {
    // ID tekshirish
    if (!id || isNaN(id)) {
      throw new Error("ID raqam bo'lishi kerak");
    }

    const order = await OrderRepository.getOrderById(id);

    if (!order) {
      throw new Error("Buyurtma topilmadi");
    }

    return order;
  }
}

module.exports = new OrderService();
