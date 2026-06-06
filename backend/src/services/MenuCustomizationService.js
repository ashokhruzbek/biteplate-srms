// Decorator Pattern demo service - database-ga yozmaydi

const BaseMenuItem = require("../patterns/decorator/BaseMenuItem");
const ExtraCheeseDecorator = require(
  "../patterns/decorator/ExtraCheeseDecorator"
);
const SpicySauceDecorator = require("../patterns/decorator/SpicySauceDecorator");
const GlutenFreeDecorator = require("../patterns/decorator/GlutenFreeDecorator");

const DECORATORS = {
  EXTRA_CHEESE: ExtraCheeseDecorator,
  SPICY_SAUCE: SpicySauceDecorator,
  GLUTEN_FREE: GlutenFreeDecorator,
};

class MenuCustomizationService {
  customizeMenuItem(name, basePrice, extras = []) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("name to'ldirilishi kerak");
    }

    if (basePrice === undefined || basePrice === null || isNaN(basePrice)) {
      throw new Error("basePrice raqam bo'lishi kerak");
    }

    const parsedBasePrice = parseFloat(basePrice);

    if (parsedBasePrice <= 0) {
      throw new Error("basePrice 0 dan katta bo'lishi kerak");
    }

    if (!Array.isArray(extras)) {
      throw new Error("extras array bo'lishi kerak");
    }

    let customizedMeal = new BaseMenuItem(name.trim(), parsedBasePrice);

    for (const extra of extras) {
      const normalizedExtra = String(extra).toUpperCase();
      const DecoratorClass = DECORATORS[normalizedExtra];

      if (!DecoratorClass) {
        throw new Error(
          "Invalid extra. Allowed extras: EXTRA_CHEESE, SPICY_SAUCE, GLUTEN_FREE"
        );
      }

      customizedMeal = new DecoratorClass(customizedMeal);
    }

    return {
      description: customizedMeal.getDescription(),
      totalPrice: this.round(customizedMeal.getPrice()),
    };
  }

  round(value) {
    return Math.round(value * 100) / 100;
  }
}

module.exports = new MenuCustomizationService();
