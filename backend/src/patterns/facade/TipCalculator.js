class TipCalculator {
  calculateTip(amount, tipPercentage = 0) {
    const percentage = tipPercentage || 0;

    if (isNaN(percentage) || percentage < 0) {
      throw new Error("tipPercentage 0 yoki undan katta raqam bo'lishi kerak");
    }

    return this.round(amount * (percentage / 100));
  }

  round(value) {
    return Math.round(value * 100) / 100;
  }
}

module.exports = TipCalculator;
