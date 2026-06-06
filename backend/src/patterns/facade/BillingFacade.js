const TaxCalculator = require("./TaxCalculator");
const TipCalculator = require("./TipCalculator");
const SplitBillCalculator = require("./SplitBillCalculator");
const BillGenerator = require("./BillGenerator");

class BillingFacade {
  constructor() {
    this.taxCalculator = new TaxCalculator();
    this.tipCalculator = new TipCalculator();
    this.splitBillCalculator = new SplitBillCalculator();
    this.billGenerator = new BillGenerator();
  }

  // Facade: billing ichidagi barcha murakkab hisob-kitoblarni bitta method yashiradi
  generateBill(order, options = {}) {
    if (!order) {
      throw new Error("Bill yaratish uchun order kerak");
    }

    const subtotal = this.round(order.totalAmount);
    const tax = this.taxCalculator.calculateTax(subtotal);
    const tip = this.tipCalculator.calculateTip(
      subtotal,
      options.tipPercentage
    );
    const total = this.round(subtotal + tax + tip);
    const peopleCount =
      options.peopleCount === undefined ||
      options.peopleCount === null ||
      options.peopleCount === ""
        ? 1
        : options.peopleCount;
    const splitAmountPerPerson = this.splitBillCalculator.splitAmount(
      total,
      peopleCount
    );

    return this.billGenerator.generateBill(
      subtotal,
      tax,
      tip,
      splitAmountPerPerson
    );
  }

  round(value) {
    return Math.round(value * 100) / 100;
  }
}

module.exports = BillingFacade;
