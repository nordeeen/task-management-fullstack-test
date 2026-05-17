# Task Management System

Aplikasi manajemen tugas pribadi berbasis fullstack yang dibangun dengan **Express.js**, **React**, dan **MongoDB**. Dilengkapi autentikasi JWT via HTTP-only cookies, CRUD tugas lengkap dengan pagination, filter status dan pencarian tugas.

---

## Screenshots

### Halaman Login
![Halaman Login](screenshots/login-page-task-manager.png)

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v4 |
| State Management | Zustand (auth), TanStack React Query (server state) |
| Backend | Express.js, TypeScript, Node.js |
| Database | MongoDB dengan Mongoose |
| Autentikasi | JWT via HTTP-only cookies |
| Testing | Jest + Supertest (backend) |

---

## Fitur

- **Autentikasi** — Register, login, logout dengan JWT yang disimpan di HTTP-only cookies
- **CRUD Tugas** — Tambah, lihat, edit, dan hapus tugas
- **Pencarian & Filter** — Pencarian dengan debounce + filter status (pending / in-progress / done)
- **Pagination** — Ukuran halaman dapat dikonfigurasi
- **Responsif** — Desain mobile-first dengan sidebar drawer di mobile/tablet
- **Proteksi Route** — Route guard di frontend + middleware autentikasi di backend
- **Unit Test** — Test endpoint autentikasi dengan mocked services

---

## Struktur Folder

```
task-management-fullstack/
├── backend/          # API Express.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts        # Setup Express app
│   │   └── server.ts     # Koneksi DB + listen
│   └── ...
└── frontend/         # React + Vite
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   ├── services/
    │   ├── stores/
    │   ├── types/
    │   └── utils/
    └── ...
```

---

## Cara Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) berjalan di lokal

---

### Setup Backend

**1. Install dependencies**

```bash
cd backend
npm install
```

**2. Buat file environment**

Buat file `.env` di dalam folder `backend/`:

```env
MONGODB_URI=mongodb://localhost:27017/task_management
JWT_SECRET=isi_dengan_string_random_yang_panjang
JWT_EXPIRE=7d
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

| Variable | Keterangan |
|----------|------------|
| `MONGODB_URI` | String koneksi MongoDB |
| `JWT_SECRET` | Kunci rahasia untuk menandatangani JWT (gunakan string random yang panjang) |
| `JWT_EXPIRE` | Durasi kedaluwarsa token (contoh: `7d`, `24h`) |
| `PORT` | Port server API berjalan |
| `CORS_ORIGIN` | Origin frontend yang diizinkan |

**3. Pastikan MongoDB sudah berjalan**

- Windows: buka MongoDB Compass atau jalankan `mongod` di terminal
- Mac:
```bash
brew services start mongodb-community
```
- Linux:
```bash
sudo systemctl start mongod
```

**4. Jalankan server development**

```bash
npm run dev
```

API akan berjalan di `http://localhost:5000`

**5. Jalankan unit test**

```bash
npm test
```

---

### Setup Frontend

**1. Install dependencies**

```bash
cd frontend
npm install
```

**2. Buat file environment**

Buat file `.env` di dalam folder `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

**3. Jalankan server development**

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## Referensi API

Base URL: `http://localhost:5000/api`

Semua endpoint tugas memerlukan autentikasi (JWT cookie yang di-set setelah login).

### Autentikasi

| Method | Endpoint | Keterangan | Perlu Auth |
|--------|----------|------------|:----------:|
| `POST` | `/auth/register` | Daftarkan user baru | ❌ |
| `POST` | `/auth/login` | Login & set cookie | ❌ |
| `POST` | `/auth/logout` | Hapus cookie autentikasi | ❌ |
| `GET` | `/auth/me` | Ambil data user yang sedang login | ✅ |

**Contoh Request Body:**

```json
// POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Tugas

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|-------------|
| `GET` | `/tasks` | Ambil daftar tugas (dengan pagination) | `page`, `limit`, `status`, `q` |
| `POST` | `/tasks` | Buat tugas baru | — |
| `GET` | `/tasks/:id` | Ambil detail satu tugas | — |
| `PUT` | `/tasks/:id` | Update tugas | — |
| `DELETE` | `/tasks/:id` | Hapus tugas | — |
| `GET` | `/tasks/search` | Cari tugas berdasarkan judul | `q` |

**Contoh Objek Tugas:**

```json
{
  "_id": "abc123",
  "title": "Selesaikan laporan",
  "description": "Deskripsi tugas",
  "status": "pending",
  "deadline": "2026-05-20T00:00:00.000Z",
  "userId": "user123",
  "createdAt": "2026-05-17T09:00:00.000Z",
  "updatedAt": "2026-05-17T09:00:00.000Z"
}
```

**Contoh Response Pagination:**

```json
{
  "success": true,
  "count": 5,
  "total": 12,
  "page": 1,
  "totalPages": 3,
  "data": []
}
```

**Nilai status yang valid:** `pending` | `in-progress` | `done`

---

## Menjalankan Backend & Frontend Bersamaan

Buka dua terminal secara bersamaan:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

---

## Ringkasan Environment Variables

### Backend (`backend/.env`)

| Variable | Wajib | Contoh |
|----------|:-----:|--------|
| `MONGODB_URI` | ✅ | `mongodb://localhost:27017/task_management` |
| `JWT_SECRET` | ✅ | `string_random_yang_sangat_panjang` |
| `JWT_EXPIRE` | ✅ | `7d` |
| `PORT` | ✅ | `5000` |
| `CORS_ORIGIN` | ✅ | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Wajib | Contoh |
|----------|:-----:|--------|
| `VITE_API_URL` | ✅ | `http://localhost:5000/api` |