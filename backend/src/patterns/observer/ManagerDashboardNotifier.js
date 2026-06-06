const Observer = require("./Observer");

class ManagerDashboardNotifier extends Observer {
  update(order) {
    const orderLabel = order.orderNumber || order.id;

    console.log(
      `[MANAGER DASHBOARD] Order #${orderLabel} status changed to ${order.status}`
    );
  }
}

module.exports = ManagerDashboardNotifier;
