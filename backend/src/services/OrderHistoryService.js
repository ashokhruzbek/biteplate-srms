// Order History business logic

const OrderHistoryLog = require("../patterns/singleton/OrderHistoryLog");
const OrderHistoryCollection = require(
  "../patterns/iterator/OrderHistoryCollection"
);

const orderHistoryLog = OrderHistoryLog.getInstance();

class OrderHistoryService {
  async getAllHistory(startDate, endDate) {
    if (startDate || endDate) {
      if (!startDate || !endDate) {
        throw new Error("startDate va endDate birga berilishi kerak");
      }

      return orderHistoryLog.getOrdersByDateRange(startDate, endDate);
    }

    return orderHistoryLog.getAllHistory();
  }

  async getOrdersByTable(tableId) {
    if (!tableId || isNaN(tableId)) {
      throw new Error("tableId raqam bo'lishi kerak");
    }

    return orderHistoryLog.getOrdersByTable(tableId);
  }

  async getMostPopularMenuItem() {
    return orderHistoryLog.getMostPopularMenuItem();
  }

  async iterateAllHistory() {
    const history = orderHistoryLog.getAllHistory();
    const historyCollection = new OrderHistoryCollection(history);
    const historyIterator = historyCollection.createIterator();
    const traversedHistory = [];

    // Iterator Pattern: service array structure-ni bilmasdan traversal qiladi
    while (historyIterator.hasNext()) {
      traversedHistory.push(historyIterator.next());
    }

    historyIterator.reset();

    return traversedHistory;
  }
}

module.exports = new OrderHistoryService();
