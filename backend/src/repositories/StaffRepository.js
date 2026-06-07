// Xodimlar bilan ma'lumotlar bazasi operatsiyalari
// Repository pattern - butun database logikasi bu yerda

const prisma = require("../prisma/client");

const PUBLIC_FIELDS = {
  id: true,
  fullName: true,
  phoneNumber: true,
  email: true,
  role: true,
  createdAt: true,
};

class StaffRepository {
  // Yangi xodim qo'shish
  async createStaff(staffData) {
    try {
      const staff = await prisma.staff.create({
        data: {
          fullName: staffData.fullName,
          phoneNumber: staffData.phoneNumber,
          email: staffData.email || null,
          password: staffData.password, // Note: real loyihada hash qilish kerak
          role: staffData.role,
        },
        select: PUBLIC_FIELDS,
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
        select: PUBLIC_FIELDS,
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
        select: PUBLIC_FIELDS,
      });
      return staff;
    } catch (error) {
      throw new Error(`Xodimni topishda xato: ${error.message}`);
    }
  }

  // Telefon raqam bo'yicha xodim mavjudligini tekshirish
  async checkPhoneExists(phoneNumber) {
    try {
      const staff = await prisma.staff.findUnique({
        where: { phoneNumber },
      });
      return staff ? true : false;
    } catch (error) {
      throw new Error(`Telefon tekshirishda xato: ${error.message}`);
    }
  }

  // Login uchun: telefon bo'yicha xodimni parol bilan birga topish
  async findByPhoneWithPassword(phoneNumber) {
    try {
      const staff = await prisma.staff.findUnique({
        where: { phoneNumber },
      });
      return staff;
    } catch (error) {
      throw new Error(`Xodimni topishda xato: ${error.message}`);
    }
  }
}

module.exports = new StaffRepository();
