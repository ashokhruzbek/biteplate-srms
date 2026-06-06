class KitchenQueue {
  constructor() {
    this.commandHistory = [];
  }

  // Invoker command-ni ishga tushiradi va undo uchun history-ga saqlaydi
  async executeCommand(command) {
    if (!command || typeof command.execute !== "function") {
      throw new Error("Valid command object berilishi kerak");
    }

    const result = await command.execute();
    this.commandHistory.push(command);

    return result;
  }

  // Oxirgi kitchen action-ni undo qiladi
  async undoLastCommand() {
    const lastCommand = this.commandHistory.pop();

    if (!lastCommand) {
      throw new Error("Undo qilish uchun kitchen action mavjud emas");
    }

    return lastCommand.undo();
  }
}

module.exports = KitchenQueue;
