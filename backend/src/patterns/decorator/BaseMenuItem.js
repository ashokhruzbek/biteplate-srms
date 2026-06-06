const MenuItemComponent = require("./MenuItemComponent");

class BaseMenuItem extends MenuItemComponent {
  constructor(name, basePrice) {
    super();
    this.name = name;
    this.basePrice = basePrice;
  }

  getDescription() {
    return this.name;
  }

  getPrice() {
    return this.basePrice;
  }
}

module.exports = BaseMenuItem;
