const Observer = require("./Observer");

class WaiterNotifier extends Observer {
  update(order) {
    const orderLabel = order.orderNumber || order.id;

    console.log(
      `[WAITER NOTIFICATION] Order #${orderLabel} is now ${order.status}`
    );
  }
}

module.exports = WaiterNotifier;
