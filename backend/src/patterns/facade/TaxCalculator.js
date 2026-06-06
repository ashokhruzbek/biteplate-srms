class TaxCalculator {
  // Fixed 12% tax
  calculateTax(amount) {
    return this.round(amount * 0.12);
  }

  round(value) {
    return Math.round(value * 100) / 100;
  }
}

module.exports = TaxCalculator;
