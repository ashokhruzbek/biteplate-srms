const OrderHistoryIterator = require("./OrderHistoryIterator");

class OrderHistoryCollection {
  constructor(orderHistoryRecords = []) {
    this.orderHistoryRecords = orderHistoryRecords;
  }

  // Collection traversal logic-ni iterator orqali kapsulalaydi
  createIterator() {
    return new OrderHistoryIterator(this.orderHistoryRecords);
  }
}

module.exports = OrderHistoryCollection;
