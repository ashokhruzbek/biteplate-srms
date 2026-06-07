# BitePlate Backend

BitePlate SRMS'ning backend qismi — restoran tizimining barcha biznes logikasi va ma'lumotlarini boshqaradigan REST API. Bu API xodimlar, stollar, menyu, buyurtmalar, billing va buyurtmalar tarixini boshqaradi.

---

## Backend Overview

Backend Express asosida qurilgan va ma'lumotlar bazasi bilan ishlash uchun Prisma ORM hamda PostgreSQL'dan foydalanadi. API hujjatlari Swagger orqali avtomatik generatsiya qilinadi.

Kod toza qatlamlarga ajratilgan: har bir so'rov **route → controller → service → repository** yo'nalishi bo'yicha qayta ishlanadi. Bu strukturani tushunishni va kengaytirishni osonlashtiradi.

---

## Technologies

- **Express** — HTTP server va routing
- **Prisma** — ma'lumotlar bazasi bilan ishlash (ORM)
- **PostgreSQL** — asosiy ma'lumotlar bazasi
- **Swagger** — API hujjatlari (swagger-jsdoc + swagger-ui-express)
- **cors**, **dotenv** — yordamchi kutubxonalar

---

## Architecture

Loyiha quyidagi qatlamlardan iborat:

- **Controllers** — so'rovni qabul qiladi va javobni qaytaradi.
- **Services** — biznes logikasi shu yerda joylashgan.
- **Repositories** — ma'lumotlar bazasi bilan to'g'ridan-to'g'ri ishlaydi (Prisma orqali).
- **Patterns** — design pattern implementatsiyalari alohida papkada.

Bu qatlamlash har bir mas'uliyatni ajratib turadi: controller faqat so'rov bilan, service biznes qoidalari bilan, repository esa ma'lumot bilan ishlaydi.

---

## Design Patterns

Har bir pattern aniq bir ehtiyoj uchun ishlatilgan:

- **Strategy** (`src/patterns/strategy`) — buyurtma narxi turlicha hisoblanishi mumkin (standart, happy hour, loyalty). Strategy narx hisoblash usulini almashtirishni osonlashtiradi.
- **Command** (`src/patterns/command`) — oshxona amallari (prepare, cancel) alohida buyruq sifatida bajariladi va oxirgi amalni undo qilish mumkin.
- **Singleton** (`src/patterns/singleton`) — buyurtmalar tarixi jurnali (OrderHistoryLog) butun tizim davomida yagona nusxada saqlanadi.
- **Observer** (`src/patterns/observer`) — buyurtma holati o'zgarganda oshxona ekrani, ofitsiant va menejer paneli avtomatik xabardor qilinadi.
- **Facade** (`src/patterns/facade`) — billing hisob-kitobi (subtotal, tax, tip, split) bitta BillingFacade orqali soddalashtirilgan.
- **Decorator** (`src/patterns/decorator`) — taomga qo'shimcha xususiyatlar (extra cheese, spicy sauce, gluten free) bazaviy taomni o'zgartirmasdan qo'shiladi.
- **Iterator** (`src/patterns/iterator`) — buyurtmalar tarixi yozuvlari ketma-ket aylanib chiqiladi.

---

## API Modules

API quyidagi modullarga bo'lingan:

### Staff

| Method | Endpoint | Tavsif |
| ------ | -------- | ------ |
| POST | `/api/staff` | Yangi xodim qo'shish |
| GET | `/api/staff` | Barcha xodimlar |
| GET | `/api/staff/:id` | Bitta xodim |

### Tables

| Method | Endpoint | Tavsif |
| ------ | -------- | ------ |
| POST | `/api/tables` | Yangi stol qo'shish |
| GET | `/api/tables` | Barcha stollar |
| GET | `/api/tables/:id` | Bitta stol |
| PATCH | `/api/tables/:id/status` | Stol holatini o'zgartirish |

### Menu

| Method | Endpoint | Tavsif |
| ------ | -------- | ------ |
| POST | `/api/menu-items` | Yangi taom qo'shish |
| GET | `/api/menu-items` | Barcha taomlar |
| GET | `/api/menu-items/:id` | Bitta taom |
| POST | `/api/menu-items/customize` | Taomni moslashtirish (Decorator) |

### Orders

| Method | Endpoint | Tavsif |
| ------ | -------- | ------ |
| POST | `/api/orders` | Yangi buyurtma yaratish |
| GET | `/api/orders` | Barcha buyurtmalar |
| GET | `/api/orders/:id` | Bitta buyurtma |
| PATCH | `/api/orders/:id/prepare` | Buyurtmani tayyorlash |
| PATCH | `/api/orders/:id/cancel` | Buyurtmani bekor qilish |
| POST | `/api/orders/undo-last-action` | Oxirgi amalni undo qilish |
| POST | `/api/orders/:id/bill` | Hisob (bill) yaratish |

### History

| Method | Endpoint | Tavsif |
| ------ | -------- | ------ |
| GET | `/api/order-history` | Buyurtmalar tarixi (sana bo'yicha filter) |
| GET | `/api/order-history/iterate` | Iterator orqali tarixni aylanib chiqish |
| GET | `/api/order-history/table/:tableId` | Stol bo'yicha tarix |

---

## Swagger

API'ning to'liq interaktiv hujjatlari Swagger UI orqali ko'riladi:

- Lokal: `http://localhost:5000/api-docs`
- Production: https://biteplate-srms.onrender.com/api-docs

---

## Environment Variables

`backend/` papkasida `.env` fayli kerak:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>"
PORT=5000
```

- **DATABASE_URL** — PostgreSQL ulanish satri (haqiqiy parolni bu yerga qo'ymang, faqat lokal `.env` faylda saqlang).
- **PORT** — server porti (standart `5000`).

---

## Installation

```bash
cd backend
npm install

# Prisma client'ini generatsiya qilish
npx prisma generate

# (ixtiyoriy) sxemani bazaga yuborish
npx prisma db push

# development rejimida ishga tushirish
npm run dev
```

Production uchun:

```bash
npm start
```

---

## Deployment

Backend **Render** platformasiga deploy qilingan.

1. Render'da yangi **Web Service** yarating va repozitoriyani ulang.
2. Root directory'ni `backend` deb belgilang.
3. Build command: `npm install`
4. Start command: `npm start`
5. Environment Variables bo'limiga `DATABASE_URL` qiymatini qo'shing.

Deploy qilingan API: https://biteplate-srms.onrender.com

---

## Example API Responses

Barcha javoblar bir xil formatda qaytadi: `success`, `message`, `data`.

**Buyurtma yaratish — `POST /api/orders`**

```json
{
  "success": true,
  "message": "Buyurtma muvaffaqiyatli qo'shildi",
  "data": {
    "id": 1,
    "orderNumber": "ORD-1780720000000-ab12cd34",
    "status": "PENDING",
    "totalAmount": 40,
    "tableId": 1,
    "waiterId": 1
  }
}
```

**Hisob yaratish — `POST /api/orders/:id/bill`**

```json
{
  "success": true,
  "message": "Bill muvaffaqiyatli yaratildi",
  "data": {
    "subtotal": 100,
    "tax": 12,
    "tip": 10,
    "total": 122,
    "splitAmountPerPerson": 61
  }
}
```

**Xato javobi**

```json
{
  "success": false,
  "message": "Validation error message"
}
```

---

## Folder Structure

```
backend/
├── prisma/
│   └── schema.prisma          # ma'lumotlar bazasi modellari
├── src/
│   ├── config/
│   │   └── swagger.js         # Swagger konfiguratsiyasi
│   ├── controllers/           # so'rov / javob qatlami
│   ├── services/              # biznes logikasi
│   ├── repositories/          # ma'lumotlar bazasi bilan ishlash
│   ├── routes/                # API route'lari
│   ├── patterns/              # design pattern implementatsiyalari
│   │   ├── strategy/
│   │   ├── command/
│   │   ├── singleton/
│   │   ├── observer/
│   │   ├── facade/
│   │   ├── decorator/
│   │   └── iterator/
│   ├── prisma/
│   │   └── client.js          # Prisma client
│   ├── middlewares/
│   ├── utils/
│   └── server.js              # ilova kirish nuqtasi
└── package.json
```
