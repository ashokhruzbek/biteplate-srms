// Singleton: butun system bo'yicha bitta OrderHistoryLog instance ishlaydi

class OrderHistoryLog {
  constructor() {
    if (OrderHistoryLog.instance) {
      throw new Error("OrderHistoryLog singleton already created");
    }

    this.history = [];
    OrderHistoryLog.instance = this;
  }

  static getInstance() {
    if (!OrderHistoryLog.instance) {
      OrderHistoryLog.instance = new OrderHistoryLog();
    }

    return OrderHistoryLog.instance;
  }

  // Yangi yaratilgan order-ni history cache-ga yozish
  addOrder(order) {
    const historyItem = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      tableId: order.tableId,
      waiterId: order.waiterId,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      items: this.prepareOrderItems(order.orderItems),
    };

    this.history.push(historyItem);

    return this.toPublicHistoryItem(historyItem);
  }

  getAllHistory() {
    return this.history.map((historyItem) =>
      this.toPublicHistoryItem(historyItem)
    );
  }

  getOrdersByTable(tableId) {
    const parsedTableId = parseInt(tableId);

    return this.history
      .filter((historyItem) => historyItem.tableId === parsedTableId)
      .map((historyItem) => this.toPublicHistoryItem(historyItem));
  }

  getOrdersByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("startDate va endDate valid sana bo'lishi kerak");
    }

    return this.history
      .filter((historyItem) => {
        const createdAt = new Date(historyItem.createdAt);
        return createdAt >= start && createdAt <= end;
      })
      .map((historyItem) => this.toPublicHistoryItem(historyItem));
  }

  getMostPopularMenuItem() {
    const menuItemTotals = new Map();

    for (const historyItem of this.history) {
      for (const item of historyItem.items) {
        const currentTotal = menuItemTotals.get(item.menuItemId) || 0;
        menuItemTotals.set(item.menuItemId, currentTotal + item.quantity);
      }
    }

    let mostPopularItem = null;

    for (const [menuItemId, totalQuantity] of menuItemTotals.entries()) {
      if (!mostPopularItem || totalQuantity > mostPopularItem.totalQuantity) {
        mostPopularItem = {
          menuItemId,
          totalQuantity,
        };
      }
    }

    return mostPopularItem;
  }

  prepareOrderItems(orderItems = []) {
    return orderItems.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
    }));
  }

  toPublicHistoryItem(historyItem) {
    return {
      orderId: historyItem.orderId,
      orderNumber: historyItem.orderNumber,
      tableId: historyItem.tableId,
      waiterId: historyItem.waiterId,
      totalAmount: historyItem.totalAmount,
      status: historyItem.status,
      createdAt: historyItem.createdAt,
    };
  }
}

module.exports = OrderHistoryLog;
