// Buyurtmalar bilan ma'lumotlar bazasi operatsiyalari
// Repository - faqat database querylar bu yerda

const prisma = require("../prisma/client");

class OrderRepository {
  // Yangi buyurtma qo'shish (order + items)
  async createOrder(orderData) {
    try {
      // Order number yaratish (unique ID)
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Buyurtma qo'shish va uning itemlarini qo'shish
      const order = await prisma.order.create({
        data: {
          orderNumber,
          tableId: orderData.tableId,
          waiterId: orderData.waiterId,
          totalAmount: orderData.totalAmount,
          status: "PENDING", // Default status
          orderItems: {
            createMany: {
              data: orderData.items,
            },
          },
        },
        include: {
          orderItems: true,
          table: true,
          waiter: {
            select: {
              id: true,
              fullName: true,
              role: true,
              email: true,
              createdAt: true,
            },
          },
        },
      });

      return order;
    } catch (error) {
      throw new Error(`Buyurtma qo'shishda xato: ${error.message}`);
    }
  }

  // Barcha buyurtmalarni olish (relations bilan)
  async getAllOrders() {
    try {
      const orders = await prisma.order.findMany({
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
          table: true,
          waiter: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return orders;
    } catch (error) {
      throw new Error(`Buyurtmalarni olishda xato: ${error.message}`);
    }
  }

  // ID bo'yicha bir buyurtma olish (relations bilan)
  async getOrderById(id) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
          table: true,
          waiter: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
      });

      return order;
    } catch (error) {
      throw new Error(`Buyurtmani olishda xato: ${error.message}`);
    }
  }

  // Buyurtma statusini yangilash
  async updateOrderStatus(orderId, status) {
    try {
      const order = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status },
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
          table: true,
          waiter: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
      });

      return order;
    } catch (error) {
      throw new Error(`Buyurtma statusini yangilashda xato: ${error.message}`);
    }
  }

  // Stol mavjudligini tekshirish
  async checkTableExists(tableId) {
    try {
      const table = await prisma.restaurantTable.findUnique({
        where: { id: parseInt(tableId) },
      });

      return table ? true : false;
    } catch (error) {
      throw new Error(`Stol tekshirishda xato: ${error.message}`);
    }
  }

  // Xodim mavjudligini tekshirish (WAITER role)
  async checkWaiterExists(waiterId) {
    try {
      const waiter = await prisma.staff.findUnique({
        where: { id: parseInt(waiterId) },
      });

      return waiter ? true : false;
    } catch (error) {
      throw new Error(`Xodim tekshirishda xato: ${error.message}`);
    }
  }

  // Menu item mavjudligini tekshirish
  async getMenuItemById(menuItemId) {
    try {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: parseInt(menuItemId) },
      });

      return menuItem;
    } catch (error) {
      throw new Error(`Menu item tekshirishda xato: ${error.message}`);
    }
  }
}

module.exports = new OrderRepository();
