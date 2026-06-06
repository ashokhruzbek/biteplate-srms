const MenuItemComponent = require("./MenuItemComponent");

class MenuItemDecorator extends MenuItemComponent {
  constructor(menuItem) {
    super();
    this.menuItem = menuItem;
  }

  getDescription() {
    return this.menuItem.getDescription();
  }

  getPrice() {
    return this.menuItem.getPrice();
  }
}

module.exports = MenuItemDecorator;
