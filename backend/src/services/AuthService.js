// Lightweight staff authentication logikasi
// MUHIM: Bu assignment uchun soddalashtirilgan login. JWT/token/session yo'q.

const StaffRepository = require("../repositories/StaffRepository");

class AuthService {
  // Telefon raqam va parol orqali login
  async login(phoneNumber, password) {
    // 1. Kerakli fieldlarni tekshirish
    if (!phoneNumber || !password) {
      throw new Error("Telefon raqam va parol kiritilishi kerak");
    }

    const normalizedPhone = String(phoneNumber).trim();

    // 2. Foydalanuvchini topish
    const staff = await StaffRepository.findByPhoneWithPassword(normalizedPhone);

    if (!staff) {
      throw new Error("Telefon raqam yoki parol noto'g'ri");
    }

    // 3. Parolni tekshirish (oddiy taqqoslash - assignment doirasida)
    if (staff.password !== password) {
      throw new Error("Telefon raqam yoki parol noto'g'ri");
    }

    // 4. Parolsiz xavfsiz foydalanuvchi ma'lumotini qaytarish
    return {
      id: staff.id,
      fullName: staff.fullName,
      phoneNumber: staff.phoneNumber,
      role: staff.role,
    };
  }
}

module.exports = new AuthService();
