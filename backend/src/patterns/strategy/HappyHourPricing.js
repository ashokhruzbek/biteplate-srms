// Happy Hour Pricing Strategy
// 20% discount bugun butun order-ga

const PricingStrategy = require("./PricingStrategy");

class HappyHourPricing extends PricingStrategy {
  // Happy Hour - 20% discount
  // Barcha taomga chegirma qo'llaniladi
  calculateTotal(orderItems) {
    // Asosiy narxni hisoblash
    const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);

    // 20% discount qo'llash
    const discountPercentage = 0.2; // 20%
    const discountAmount = subtotal * discountPercentage;
    const total = subtotal - discountAmount;

    // Info uchun: Haqiqiy loyihada log qilish kerak
    console.log(
      `Happy Hour: Subtotal=${subtotal}, Discount=${discountAmount}, Total=${total}`
    );

    return total;
  }

  // Info: Strategy pattern-ni aniq ko'rsatish uchun
  getStrategyName() {
    return "HAPPY_HOUR";
  }

  getDescription() {
    return "Happy Hour - 20% chegirma bugun";
  }

  getDiscountPercentage() {
    return 20;
  }
}

module.exports = HappyHourPricing;
