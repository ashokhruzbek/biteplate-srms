// Stollar bilan ish logikasi
// Service - business logic va validation bu yerda, database querylar repository-dan chaqiriladi

const TableRepository = require("../repositories/TableRepository");

class TableService {
  // Yangi stol qo'shish - validation va logika
  async createTable(tableNumber, capacity) {
    // 1. Kerakli fieldlarni tekshirish
    if (!tableNumber || !capacity) {
      throw new Error("Stol raqami va sig'imi to'ldirilishi kerak");
    }

    // 2. Stol raqami raqam bo'lishini tekshirish
    if (isNaN(tableNumber) || isNaN(capacity)) {
      throw new Error("Stol raqami va sig'imi raqam bo'lishi kerak");
    }

    // 3. Sig'im 0 dan katta bo'lishini tekshirish
    if (capacity <= 0) {
      throw new Error("Sig'im 1 dan katta bo'lishi kerak");
    }

    // 4. Stol raqami mavjudligini tekshirish (unique)
    const tableExists = await TableRepository.checkTableNumberExists(
      parseInt(tableNumber)
    );
    if (tableExists) {
      throw new Error("Bu stol raqami allaqachon mavjud");
    }

    // 5. Stolni qo'shish
    const newTable = await TableRepository.createTable({
      tableNumber: parseInt(tableNumber),
      capacity: parseInt(capacity),
    });

    return newTable;
  }

  // Barcha stollarni olish
  async getAllTables() {
    const tables = await TableRepository.getAllTables();
    return tables;
  }

  // Bir stolni ID bo'yicha olish
  async getTableById(id) {
    // ID tekshirish
    if (!id || isNaN(id)) {
      throw new Error("ID raqam bo'lishi kerak");
    }

    const table = await TableRepository.getTableById(id);

    if (!table) {
      throw new Error("Stol topilmadi");
    }

    return table;
  }

  // Stol statusini o'zgartirish
  async updateTableStatus(id, newStatus) {
    // ID tekshirish
    if (!id || isNaN(id)) {
      throw new Error("ID raqam bo'lishi kerak");
    }

    // Status tekshirish
    const validStatuses = ["FREE", "RESERVED", "OCCUPIED", "AWAITING_BILL", "CLEARED"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(
        `Status xato. Mumkin: ${validStatuses.join(", ")}`
      );
    }

    // Stol mavjudligini tekshirish
    const table = await TableRepository.getTableById(id);
    if (!table) {
      throw new Error("Stol topilmadi");
    }

    // Statusni o'zgartirish
    const updatedTable = await TableRepository.updateTableStatus(id, newStatus);

    return updatedTable;
  }
}

module.exports = new TableService();
