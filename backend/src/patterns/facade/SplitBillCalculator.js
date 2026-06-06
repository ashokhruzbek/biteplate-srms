class SplitBillCalculator {
  splitAmount(total, peopleCount) {
    const parsedPeopleCount = parseInt(peopleCount);

    if (isNaN(parsedPeopleCount) || parsedPeopleCount <= 0) {
      throw new Error("peopleCount 0 dan katta raqam bo'lishi kerak");
    }

    return this.round(total / parsedPeopleCount);
  }

  round(value) {
    return Math.round(value * 100) / 100;
  }
}

module.exports = SplitBillCalculator;
