class BillGenerator {
  generateBill(subtotal, tax, tip, splitAmountPerPerson) {
    const total = this.round(subtotal + tax + tip);

    return {
      subtotal,
      tax,
      tip,
      total,
      splitAmountPerPerson,
    };
  }

  round(value) {
    return Math.round(value * 100) / 100;
  }
}

module.exports = BillGenerator;
