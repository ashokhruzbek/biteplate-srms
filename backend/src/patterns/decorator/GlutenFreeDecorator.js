const MenuItemDecorator = require("./MenuItemDecorator");

class GlutenFreeDecorator extends MenuItemDecorator {
  getDescription() {
    return `${this.menuItem.getDescription()}, Gluten Free`;
  }

  getPrice() {
    return this.menuItem.getPrice() + 4;
  }
}

module.exports = GlutenFreeDecorator;
