# Setup Unit Test Menggunakan Jest

## 1 Setup Jest di Project

Jalankan perintah berikut di terminal untuk menginstal Jest dan beberapa library tambahan sebagai devDependencies:

```sh
npm install -D jest supertest sequelize-mock
```

- `jest` → Library utama untuk testing.
- `supertest` → Untuk melakukan HTTP request ke API.
- `sequelize-mock` → Untuk membuat model database tiruan saat testing.

## 2 Konfigurasi Jest

Tambahkan script Jest di `package.json`:

```json
"scripts": {
  "test": "jest --coverage"
}
```

Buat file konfigurasi `.jest.config.js` (opsional) untuk Jest:

```javascript
module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
};
```

## 3 Buat File Unit Test

Buat folder `__tests__` di root project, lalu buat file `teacher.test.js` di dalamnya:

```bash
/__tests__/teacher.test.js
```

Isi dengan kode berikut:

```javascript
const request = require("supertest");
const app = require("../src/index"); // Sesuaikan dengan patch file utama Express-mu
const { Teacher: TeacherModel } = require("../models");
const SequelizeMock = require("sequelize-mock");

const dbMock = new SequelizeMock();

jest.mock("../models", () => ({
  Teacher: dbMock.define("Teacher", {
    id: 1,
    fullName: "John Doe",
    email: "johndoe@example.com",
    gender: "male",
  }),
}));

describe("Teacher API Tests", () => {
  // Create Teacher Test
  test("should create a new teacher", async () => {
    const response = await request(app).post("/teachers").send({
      fullName: "Jane Doe",
      email: "janedoe@example.com",
      gender: "female",
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.teacher.fullName).toBe("Jane Doe");
  });

  // Get Teachers Test
  test("should retrieve all teachers", async () => {
    const response = await request(app).get("/teachers");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // Update Teacher Test
  test("should update teacher details", async () => {
    const response = await request(app).put("/teachers/1").send({
      fullName: "John Updated",
      email: "johnupdated@example.com",
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.teacher.fullName).toBe("John Updated");
  });

  // Delete Teacher Test
  test("should delete a teacher", async () => {
    const response = await request(app).delete("/teachers/1");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  });

  // Teacher Not Found Test
  test("should return 404 if teacher not found", async () => {
    const response = await request(app).delete("/teachers/999");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe("fail");
  });
});
```

## 4 Jalankan Unit Test

Setelah semua siap, jalankan perintah berikut:

```sh
npm test
```

Jika berhasil, hasilnya akan menampilkan semua tes lolos ✅

## Penjelasan Unit Test

- `jest.mock()` → Mocking model TeacherModel agar tidak mempengaruhi database asli.
- `request(app).post()` → Menguji endpoint Create Teacher.
- `request(app).get()` → Menguji endpoint Get All Teachers.
- `request(app).put()` → Menguji endpoint Update Teacher.
- `request(app).delete()` → Menguji endpoint Delete Teacher.
- Tes validasi → Cek jika teacher tidak ditemukan harus return `404`.
