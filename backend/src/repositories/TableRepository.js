// Stol bilan ma'lumotlar bazasi operatsiyalari
// Repository pattern - butun database logikasi bu yerda

const prisma = require("../prisma/client");

class TableRepository {
  // Yangi stol qo'shish
  async createTable(tableData) {
    try {
      const table = await prisma.restaurantTable.create({
        data: {
          tableNumber: tableData.tableNumber,
          capacity: tableData.capacity,
          status: "FREE", // Default status
        },
      });
      return table;
    } catch (error) {
      throw new Error(`Stol qo'shishda xato: ${error.message}`);
    }
  }

  // Barcha stollarni olish
  async getAllTables() {
    try {
      const tables = await prisma.restaurantTable.findMany({
        select: {
          id: true,
          tableNumber: true,
          capacity: true,
          status: true,
        },
      });
      return tables;
    } catch (error) {
      throw new Error(`Stollarni olishda xato: ${error.message}`);
    }
  }

  // ID bo'yicha bir stol topish
  async getTableById(id) {
    try {
      const table = await prisma.restaurantTable.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          tableNumber: true,
          capacity: true,
          status: true,
        },
      });
      return table;
    } catch (error) {
      throw new Error(`Stol topishda xato: ${error.message}`);
    }
  }

  // Stol raqami bo'yicha tekshirish (unique)
  async checkTableNumberExists(tableNumber) {
    try {
      const table = await prisma.restaurantTable.findUnique({
        where: { tableNumber },
      });
      return table ? true : false;
    } catch (error) {
      throw new Error(`Stol tekshirishda xato: ${error.message}`);
    }
  }

  // Stol statusini o'zgartirish
  async updateTableStatus(id, newStatus) {
    try {
      const table = await prisma.restaurantTable.update({
        where: { id: parseInt(id) },
        data: { status: newStatus },
        select: {
          id: true,
          tableNumber: true,
          capacity: true,
          status: true,
        },
      });
      return table;
    } catch (error) {
      throw new Error(`Stol statusini o'zgartirishda xato: ${error.message}`);
    }
  }
}

module.exports = new TableRepository();
