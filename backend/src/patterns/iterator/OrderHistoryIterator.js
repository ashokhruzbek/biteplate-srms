class OrderHistoryIterator {
  constructor(orderHistoryRecords = []) {
    this.orderHistoryRecords = orderHistoryRecords;
    this.currentIndex = 0;
  }

  // Keyingi history record-ni qaytaradi
  next() {
    if (!this.hasNext()) {
      return null;
    }

    const currentRecord = this.orderHistoryRecords[this.currentIndex];
    this.currentIndex += 1;

    return currentRecord;
  }

  // Iterator ichida yana record borligini tekshiradi
  hasNext() {
    return this.currentIndex < this.orderHistoryRecords.length;
  }

  // Traversal-ni boshidan boshlash uchun index-ni reset qiladi
  reset() {
    this.currentIndex = 0;
  }
}

module.exports = OrderHistoryIterator;
