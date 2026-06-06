const PricingStrategy = require("./PricingStrategy");

class StandardPricing extends PricingStrategy {
  // Standart pricing - hech qanday discount yo'q
  calculateTotal(orderItems) {
    const total = orderItems.reduce(
      (sum, item) => sum + item.price,
      0
    );

    return total;
  }

  getStrategyName() {
    return "STANDARD";
  }

  getDescription() {
    return "Asosiy narx - chegirma yo'q";
  }
}

module.exports = StandardPricing;