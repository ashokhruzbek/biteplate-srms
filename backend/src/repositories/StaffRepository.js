// Xodimlar bilan ma'lumotlar bazasi operatsiyalari
// Repository pattern - butun database logikasi bu yerda

const prisma = require("../prisma/client");

class StaffRepository {
  // Yangi xodim qo'shish
  async createStaff(staffData) {
    try {
      const staff = await prisma.staff.create({
        data: {
          fullName: staffData.fullName,
          email: staffData.email,
          password: staffData.password, // Note: real loyihada hash qilish kerak
          role: staffData.role,
        },
      });
      return staff;
    } catch (error) {
      throw new Error(`Xodim qo'shishda xato: ${error.message}`);
    }
  }

  // Barcha xodimlarni olish
  async getAllStaff() {
    try {
      const staffList = await prisma.staff.findMany({
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      return staffList;
    } catch (error) {
      throw new Error(`Xodimlarni olishda xato: ${error.message}`);
    }
  }

  // ID bo'yicha bir xodim topish
  async getStaffById(id) {
    try {
      const staff = await prisma.staff.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      return staff;
    } catch (error) {
      throw new Error(`Xodimni topishda xato: ${error.message}`);
    }
  }

  // Email bo'yicha xodim mavjudligini tekshirish
  async checkEmailExists(email) {
    try {
      const staff = await prisma.staff.findUnique({
        where: { email },
      });
      return staff ? true : false;
    } catch (error) {
      throw new Error(`Email tekshirishda xato: ${error.message}`);
    }
  }
}

module.exports = new StaffRepository();
