// Xodimlar bilan ish logikasi
// Service - business logic bu yerda, database querylar repository-dan chaqiriladi

const StaffRepository = require("../repositories/StaffRepository");

const VALID_ROLES = ["MANAGER", "WAITER", "CHEF", "CASHIER"];
// Oddiy telefon format: + bilan boshlanib, 9-15 ta raqam (masalan +998901112233)
const PHONE_REGEX = /^\+?\d{9,15}$/;

class StaffService {
  // Xodim qo'shish - validation va logika
  async createStaff(fullName, phoneNumber, password, role) {
    // 1. Kerakli fieldlarni tekshirish
    if (!fullName || !phoneNumber || !password || !role) {
      throw new Error("Barcha maydonlar to'ldirilishi kerak");
    }

    // 2. Telefon raqam formatini tekshirish
    const normalizedPhone = String(phoneNumber).trim();
    if (!PHONE_REGEX.test(normalizedPhone)) {
      throw new Error("Telefon raqam formati noto'g'ri (masalan: +998901112233)");
    }

    // 3. Parol uzunligini tekshirish
    if (String(password).length < 6) {
      throw new Error("Parol kamida 6 belgidan iborat bo'lishi kerak");
    }

    // 4. Rol tekshirish
    if (!VALID_ROLES.includes(role)) {
      throw new Error("Rol xato. Mumkin: MANAGER, WAITER, CHEF, CASHIER");
    }

    // 5. Telefon raqam mavjudligini tekshirish
    const phoneExists = await StaffRepository.checkPhoneExists(normalizedPhone);
    if (phoneExists) {
      throw new Error("Bu telefon raqam allaqachon ro'yxatdan o'tgan");
    }

    // 6. Xodimni qo'shish
    const newStaff = await StaffRepository.createStaff({
      fullName,
      phoneNumber: normalizedPhone,
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
