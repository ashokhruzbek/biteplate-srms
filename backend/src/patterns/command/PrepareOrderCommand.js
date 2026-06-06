const Command = require("./Command");

class PrepareOrderCommand extends Command {
  constructor(order, orderRepository) {
    super();
    this.order = order;
    this.orderRepository = orderRepository;
  }

  // Receiver orqali order statusini PREPARING holatiga o'tkazadi
  async execute() {
    return this.orderRepository.updateOrderStatus(this.order.id, "PREPARING");
  }

  // Prepare action undo qilinganda order yana PENDING bo'ladi
  async undo() {
    return this.orderRepository.updateOrderStatus(this.order.id, "PENDING");
  }
}

module.exports = PrepareOrderCommand;
