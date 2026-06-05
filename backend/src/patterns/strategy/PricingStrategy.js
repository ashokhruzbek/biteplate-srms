// Pricing Strategy - Base class (Interface)
// Bu abstract class turli pricing strategiyalarning blueprint-i
// Har bir strategy calculateTotal() metodini implement qiladi

class PricingStrategy {
  // Narxni hisoblash (har bir strategy o'ziga xos yo'lda amalga oshiradi)
  // @param {Array} orderItems - [{ menuItemId, quantity, price, menuItem: { category } }]
  // @return {number} total amount
  calculateTotal(orderItems) {
    throw new Error(
      "calculateTotal() method override qilish kerak Strategy class-da"
    );
  }
}

module.exports = PricingStrategy;
