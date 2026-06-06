const MenuItemDecorator = require("./MenuItemDecorator");

class SpicySauceDecorator extends MenuItemDecorator {
  getDescription() {
    return `${this.menuItem.getDescription()}, Spicy Sauce`;
  }

  getPrice() {
    return this.menuItem.getPrice() + 2;
  }
}

module.exports = SpicySauceDecorator;
