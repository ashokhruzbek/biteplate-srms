# BitePlate SRMS

BitePlate — restoran ishini boshqarish uchun yaratilgan **Smart Restaurant Management System** (SRMS). Tizim xodimlar, stollar, menyu, buyurtmalar, billing va buyurtmalar tarixini bitta professional admin dashboard orqali boshqarish imkonini beradi.

Loyiha to'liq REST API backend va zamonaviy React admin panel frontend'idan iborat. Kod tarkibida ettita klassik **design pattern** real holatlarda qo'llanilgan.

---

## Features

- **Staff management** — xodimlarni qo'shish va ro'yxatini ko'rish (lavozim bilan)
- **Table management** — stollarni yaratish va holatini real vaqtda boshqarish
- **Menu management** — taom qo'shish va Decorator orqali taomni moslashtirish
- **Orders** — buyurtma yaratish, tayyorlash, bekor qilish va undo
- **Billing** — soliq, insho'na (tip) va hisobni bo'lish bilan hisob yaratish
- **Order history** — buyurtmalar tarixini sana va stol bo'yicha ko'rish
- **Dashboard analytics** — asosiy ko'rsatkichlar va so'nggi buyurtmalar
- **Responsive admin dashboard** — desktop va mobil uchun moslashtirilgan UI

---

## Tech Stack

**Frontend**

- React
- Vite
- Axios
- React Router
- lucide-react

**Backend**

- Node.js
- Express
- Prisma
- PostgreSQL
- Swagger (swagger-jsdoc + swagger-ui-express)

---

## Design Patterns Used

Loyihada ettita design pattern real funksiyalarda ishlatilgan:

- **Strategy** — buyurtma narxini hisoblashning turli usullari (standart, happy hour, loyalty).
- **Command** — oshxona amallari (prepare, cancel) va oxirgi amalni undo qilish.
- **Singleton** — buyurtmalar tarixi jurnali yagona nusxada saqlanadi.
- **Observer** — buyurtma holati o'zgarganda turli bo'limlar (oshxona, ofitsiant, menejer) xabardor qilinadi.
- **Facade** — billing hisob-kitobi (soliq, tip, split) bitta soddalashtirilgan interfeys orqali.
- **Decorator** — taomga qo'shimcha xususiyatlarni (extra cheese, spicy sauce, gluten free) dinamik qo'shish.
- **Iterator** — buyurtmalar tarixi yozuvlarini ketma-ket aylanib chiqish.

---

## Project Structure

```
BitePlate/
├── backend/      # Express + Prisma REST API
└── frontend/     # React + Vite admin dashboard
```

Har bir qism o'zining alohida README'siga ega:

- [`backend/README.md`](./backend/README.md)
- [`frontend/README.md`](./frontend/README.md)

---
## Live Demo

- **Frontend:** _placeholder (Vercel URL shu yerga qo'yiladi)_
- **Backend:** https://biteplate-srms.onrender.com
- **API Docs (Swagger):** https://biteplate-srms.onrender.com/api-docs

---

## Installation

Loyihani lokal kompyuterda ishga tushirish:

```bash
# repozitoriyani klonlash
git clone <repository-url>
cd BitePlate

# backend
cd backend
npm install
npm run dev

# frontend (yangi terminal)
cd frontend
npm install
npm run dev
```

Backend standart holatda `http://localhost:5000`, frontend esa `http://localhost:5173` manzilida ishga tushadi.

To'liqroq sozlash bo'yicha har bir qismning README'siga qarang.

---

## API Documentation

Barcha endpoint'lar Swagger orqali hujjatlashtirilgan:

- Lokal: `http://localhost:5000/api-docs`
- Production: https://biteplate-srms.onrender.com/api-docs

---

## Author

- **Author:** _placeholder (ism va GitHub profili shu yerga qo'yiladi)_
