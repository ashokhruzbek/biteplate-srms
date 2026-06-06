// Command - barcha kitchen command-lar uchun contract

class Command {
  async execute() {
    throw new Error("execute() method command class-da implement qilinishi kerak");
  }

  async undo() {
    throw new Error("undo() method command class-da implement qilinishi kerak");
  }
}

module.exports = Command;
