// Component - barcha menu item va decorator-lar uchun contract

class MenuItemComponent {
  getDescription() {
    throw new Error(
      "getDescription() method component class-da implement qilinishi kerak"
    );
  }

  getPrice() {
    throw new Error("getPrice() method component class-da implement qilinishi kerak");
  }
}

module.exports = MenuItemComponent;
