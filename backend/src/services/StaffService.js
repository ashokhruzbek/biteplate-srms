// Xodimlar bilan ish logikasi
// Service - business logic bu yerda, database querylar repository-dan chaqiriladi

const StaffRepository = require("../repositories/StaffRepository");

class StaffService {
  // Xodim qo'shish - validation va logika
  async createStaff(fullName, email, password, role) {
    // 1. Kerakli fieldlarni tekshirish
    if (!fullName || !email || !password || !role) {
      throw new Error("Barcha maydonlar to'ldirilishi kerak");
    }

    // 2. Email formatini tekshirish
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email formati noto'g'ri");
    }

    // 3. Rol (ro'y) tekshirish
    const validRoles = ["MANAGER", "WAITER", "CHEF", "CASHIER"];
    if (!validRoles.includes(role)) {
      throw new Error("Rol xato. Mumkin: MANAGER, WAITER, CHEF, CASHIER");
    }

    // 4. Email mavjudligini tekshirish
    const emailExists = await StaffRepository.checkEmailExists(email);
    if (emailExists) {
      throw new Error("Bu email allaqachon ro'yxatdan o'tgan");
    }

    // 5. Xodimni qo'shish
    const newStaff = await StaffRepository.createStaff({
      fullName,
      email,
      password,
      role,
    });

    return newStaff;
  }

  // Barcha xodimlarni olish
  async getAllStaff() {
    const staffList = await StaffRepository.getAllStaff();
    return staffList;
  }

  // Bir xodimni ID bo'yicha olish
  async getStaffById(id) {
    // ID tekshirish
    if (!id || isNaN(id)) {
      throw new Error("ID raqam bo'lishi kerak");
    }

    const staff = await StaffRepository.getStaffById(id);
    
    if (!staff) {
      throw new Error("Xodim topilmadi");
    }

    return staff;
  }
}

module.exports = new StaffService();
