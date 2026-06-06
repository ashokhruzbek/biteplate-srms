const Observer = require("./Observer");

class KitchenDisplayNotifier extends Observer {
  update(order) {
    const orderLabel = order.orderNumber || order.id;

    console.log(
      `[KITCHEN DISPLAY] Order #${orderLabel} kitchen status is ${order.status}`
    );
  }
}

module.exports = KitchenDisplayNotifier;
