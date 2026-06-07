// Default admin (MANAGER) yaratish uchun seed script.
// Ishlatish: `npm run seed` (backend papkasida).
// Idempotent: admin allaqachon mavjud bo'lsa, qayta yaratmaydi.

require("dotenv").config();
const prisma = require("../src/prisma/client");

const DEFAULT_ADMIN = {
  fullName: "Shoxruzbek",
  phoneNumber: "+998907010801",
  password: "12345678",
  role: "MANAGER",
};

async function main() {
  const existing = await prisma.staff.findUnique({
    where: { phoneNumber: DEFAULT_ADMIN.phoneNumber },
  });

  if (existing) {
    console.log(
      `Admin allaqachon mavjud: ${existing.phoneNumber} (${existing.role})`
    );
    return;
  }

  const admin = await prisma.staff.create({
    data: DEFAULT_ADMIN,
  });

  console.log("Default admin yaratildi:");
  console.log(`  Telefon: ${admin.phoneNumber}`);
  console.log(`  Parol:   ${DEFAULT_ADMIN.password}`);
  console.log(`  Rol:     ${admin.role}`);
}

main()
  .catch((error) => {
    console.error("Seed xatosi:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
