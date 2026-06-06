const Command = require("./Command");

class CancelOrderCommand extends Command {
  constructor(order, orderRepository) {
    super();
    this.order = order;
    this.orderRepository = orderRepository;
    this.previousStatus = order.status;
  }

  // Receiver orqali order statusini CANCELLED holatiga o'tkazadi
  async execute() {
    return this.orderRepository.updateOrderStatus(this.order.id, "CANCELLED");
  }

  // Cancel action undo qilinganda oldingi status tiklanadi
  async undo() {
    return this.orderRepository.updateOrderStatus(
      this.order.id,
      this.previousStatus
    );
  }
}

module.exports = CancelOrderCommand;
