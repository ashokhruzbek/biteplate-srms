# BitePlate Frontend

BitePlate SRMS'ning frontend qismi — restoran tizimini boshqarish uchun zamonaviy, responsive admin dashboard. React va Vite asosida qurilgan bo'lib, backend REST API bilan Axios orqali bog'lanadi.

---

## Frontend Overview

Frontend professional SaaS admin panel ko'rinishida ishlab chiqilgan. Har bir bo'lim (xodimlar, stollar, menyu, buyurtmalar, tarix) alohida sahifaga ega va sidebar navigatsiya orqali oson kezish mumkin.

UI to'liq o'zbek tilida va desktop hamda mobil qurilmalar uchun moslashtirilgan.

---

## Technologies

- **React** — UI kutubxonasi
- **Vite** — build va development server
- **Axios** — backend API bilan ishlash
- **React Router** — sahifalar o'rtasida navigatsiya
- **lucide-react** — toza, professional ikonalar

---

## UI Architecture

Kod qayta ishlatiladigan va tartibli qatlamlarga bo'lingan:

- **Reusable components** (`src/components`) — kichik, qayta ishlatiladigan UI bo'laklari (cards, badges, tables, forms, skeleton va boshqalar). UI primitivlar `components/ui` ichida.
- **Layouts** (`src/layouts`) — sidebar va navbar bilan asosiy sahifa karkasi.
- **Pages** (`src/pages`) — har bir route uchun alohida sahifa.
- **Services** (`src/services`) — backend API chaqiruvlari shu yerda markazlashtirilgan.
- **Styles** (`src/styles`) — design token'lar asosidagi modulli CSS fayllar.
- **Hooks** (`src/hooks`) — qayta ishlatiladigan logika (masalan, ma'lumot yuklash).
- **Utils** (`src/utils`) — yordamchi funksiyalar (formatlash, navigatsiya).

---

## Features

- **Responsive dashboard** — asosiy ko'rsatkichlar va so'nggi buyurtmalar
- **Sidebar navigation** — guruhlangan va yig'iladigan (collapsible) menyu
- **Analytics** — stat kartalar orqali tezkor ko'rinish
- **Forms** — validatsiya va aniq error/success holatlari bilan
- **Filtering** — qidiruv, holat va sana bo'yicha filtrlash
- **Billing UI** — hisobni yaratish va ko'rsatish interfeysi
- **Loading / empty / error states** — skeleton loader va toza bo'sh holatlar

---

## Design Philosophy

- **Professional SaaS dashboard** — Stripe, Linear va zamonaviy POS tizimlaridan ilhomlangan toza ko'rinish.
- **Responsive UX** — kichik ekranlarda sidebar drawer rejimiga o'tadi, gridlar moslashadi.
- **Clean admin architecture** — har bir sahifa bitta mas'uliyatga ega (single responsibility), komponentlar qayta ishlatiladi.
- **Consistent design system** — spacing, radius, shadow va typography uchun yagona token tizimi.

---

## Routing Structure

Asosiy route'lar:

```
/                          Dashboard
/staff                     Xodimlar ro'yxati
/staff/create              Xodim qo'shish
/tables                    Stollar ro'yxati
/tables/create             Stol qo'shish
/menu                      Menyular ro'yxati
/menu/create               Taom qo'shish
/menu/customize            Taomni moslashtirish
/orders                    Buyurtmalar ro'yxati
/orders/create             Buyurtma yaratish
/orders/billing            Billing
/order-history             Buyurtmalar tarixi
/order-history/popular     Popular taom
/order-history/iterator    Iterator ko'rish
```

---

## Environment Variables

`frontend/` papkasida `.env` fayli kerak:

```env
VITE_API_BASE_URL=http://localhost:5000
```

- **VITE_API_BASE_URL** — backend API manzili. Production'da bu qiymat deploy qilingan backend URL'iga o'zgartiriladi (masalan, `https://biteplate-srms.onrender.com`).

---

## Installation

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` manzilida ishga tushadi.

Boshqa buyruqlar:

```bash
npm run build     # production uchun build
npm run preview   # build'ni lokal ko'rish
npm run lint      # kod tekshiruvi
```

---

## Deployment

Frontend **Vercel** platformasiga deploy qilinadi.

1. Vercel'da yangi loyiha yarating va repozitoriyani ulang.
2. Root directory'ni `frontend` deb belgilang.
3. Framework Preset: **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment Variables bo'limiga `VITE_API_BASE_URL` qiymatini (deploy qilingan backend URL) qo'shing.

---

## Folder Structure

```
frontend/
├── public/
├── src/
│   ├── api/                 # Axios client va base URL
│   ├── assets/
│   ├── components/
│   │   ├── common/          # PageHeader va umumiy bo'laklar
│   │   ├── dashboard/       # dashboard kartalari va jadvali
│   │   ├── history/         # tarix komponentlari
│   │   ├── layout/          # Sidebar, TopNavbar
│   │   ├── menu/            # menyu kartalari va formalari
│   │   ├── orders/          # buyurtma jadvali va formalari
│   │   ├── staff/           # xodim jadvali va formasi
│   │   ├── tables/          # stol kartalari va formalari
│   │   └── ui/              # reusable UI primitivlar
│   ├── hooks/               # useAsyncData va boshqalar
│   ├── layouts/             # MainLayout
│   ├── pages/               # route sahifalari
│   ├── routes/              # AppRoutes
│   ├── services/            # API chaqiruvlari
│   ├── styles/              # CSS (design token'lar bilan)
│   ├── utils/               # formatlash, navigatsiya
│   ├── App.jsx
│   └── main.jsx
└── package.json
```
