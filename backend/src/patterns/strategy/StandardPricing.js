// Standart Pricing Strategy
// Asosiy narx - chegirma yo'q

const PricingStrategy = require("./PricingStrategy");

class StandardPricing extends PricingStrategy {
  // Standart pricing - hech qanday discount yo'q
  // Barcha itemlarni simple qo'shish
  calculateTotal(orderItems) {
    // Har bir itemning narxi allaqachon hisoblangan (quantity * basePrice)
    // Faqat yig'indisini olish kerak
    const total = orderItems.reduce((sum, item) => sum + item.price, 0);

    return total;
  }

  // Info: Strategy pattern-ni aniq ko'rsatish uchun
  getStrategyName() {
    return "STANDARD";
  }

  getDescription() {
    return "Asosiy narx - chegirma yo'q";
  }
}

module.exports = StandardPricing;
