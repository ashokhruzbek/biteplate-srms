const MenuItemDecorator = require("./MenuItemDecorator");

class ExtraCheeseDecorator extends MenuItemDecorator {
  getDescription() {
    return `${this.menuItem.getDescription()}, Extra Cheese`;
  }

  getPrice() {
    return this.menuItem.getPrice() + 5;
  }
}

module.exports = ExtraCheeseDecorator;
