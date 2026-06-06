// Loyalty Card Pricing Strategy
// 10% discount, kelajakda loyalty feature-lar uchun kengaytirish mumkin

const PricingStrategy = require("./PricingStrategy");

class LoyaltyCardPricing extends PricingStrategy {
  // Loyalty Card - butun order-ga 10% discount
  calculateTotal(orderItems) {
    // Asosiy narxni hisoblash
    const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);

    // 10% discount qo'llash
    const discountPercentage = 0.1; // 10%
    const discountAmount = subtotal * discountPercentage;
    const total = subtotal - discountAmount;

    return total;
  }

  // Info: Strategy pattern-ni aniq ko'rsatish uchun
  getStrategyName() {
    return "LOYALTY";
  }

  getDescription() {
    return "Loyalty Card - 10% chegirma";
  }

  getDiscountPercentage() {
    return 10;
  }

  // Kelajakda loyalty points/card level kabi feature-lar shu strategy ichida kengaytiriladi.
}

module.exports = LoyaltyCardPricing;
