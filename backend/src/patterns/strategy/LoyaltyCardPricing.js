// Loyalty Card Pricing Strategy
// 10% discount + bir ichimlik bepul (agar ichimlik bo'lsa)

const PricingStrategy = require("./PricingStrategy");

class LoyaltyCardPricing extends PricingStrategy {
  // Loyalty Card - 10% discount + bir ichimlik bepul
  calculateTotal(orderItems) {
    // Asosiy narxni hisoblash
    const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);

    // 10% discount qo'llash
    const discountPercentage = 0.1; // 10%
    const discountAmount = subtotal * discountPercentage;
    let total = subtotal - discountAmount;

    // Bir ichimlik bepul qilish (agar mavjud bo'lsa)
    const beverageItem = orderItems.find((item) => {
      // Beverage category qidirish (ichimlik)
      return (
        item.menuItem &&
        item.menuItem.category &&
        item.menuItem.category.toLowerCase().includes("beverage")
      );
    });

    if (beverageItem) {
      // Birinchi ichimlikni bepul qilish
      const freeBeverageDiscount = Math.min(
        beverageItem.price,
        beverageItem.menuItem.basePrice
      );
      total -= freeBeverageDiscount;

      // Info uchun: Haqiqiy loyihada log qilish kerak
      console.log(
        `Loyalty: Free Beverage="${beverageItem.menuItem.name}", Amount=${freeBeverageDiscount}`
      );
    }

    // Info uchun: Haqiqiy loyihada log qilish kerak
    console.log(
      `Loyalty Card: Subtotal=${subtotal}, Discount=${discountAmount}, Total=${total}`
    );

    return total;
  }

  // Info: Strategy pattern-ni aniq ko'rsatish uchun
  getStrategyName() {
    return "LOYALTY";
  }

  getDescription() {
    return "Loyalty Card - 10% chegirma + 1 ichimlik bepul";
  }

  getDiscountPercentage() {
    return 10;
  }

  hasFreeBeverage() {
    return true;
  }
}

module.exports = LoyaltyCardPricing;
