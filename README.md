# Documentasi Bahasa Indonesia

## Persyaratan Sistem

- Node JS 22.x.x
- MySQL 8.x.x or atau bisa menggunakan XAMPP 8.1 untuk database MySQL-nya

## Sebelum Jalankan Program

- Kamu harus sudah install Node JS 22.x.x dan MySQL 8.x.x (atau anda bisa menggunakan XAMPP 8.1 untuk Database MySQL) di komputer anda
- Pastikan anda sudah mendapatkan source code ini dati github: https://github.com/joniheri/nodjs-api-assessment-govtech
- Setelah itu, buka source code anda tadi di Text Exitor seperti Visual Studio Code (VSCode)
- Kemudian di VSCode tersebut, silahkan buka terminalnya, kemudian ketikkan sintak berikut:
  - `npm install` --> Install semua library yang dibutuhakn
  - `npx sequelize-cli db:create` --> Membuat database 'assessment_govtech'
  - `npx sequelize-cli db:migrate` --> Migrasi semua tabel ke databse
  - `npx sequelize-cli db:seed --seed 20250318064050-user-seeder` --> Meng-eksekusi file seeder untuk menginputkan 1 data ke tabel 'users'

## Jalankan Program

- Setelah itu, jika semua sudah langkah2 diatas berhasil, runing program dengan ketik di termnal VSCode tadi:
  - `npm run dev`
- Jika runing program berhasil, akan bisa di tes ti Base URL: `localhost:3000` di browser anda atau bisa menggunakan aplikasi Postman

## Endpoint API

- AuthRoutes:
  - register: method POST `http://localhost:3000/api/auth/register`
  - login: method POST `http://localhost:3000/api/auth/login`
  - refres-token: method POST `http://localhost:3000/api/auth/login`
- TeacherRoutes:
  - Catatan:
    - Untuk mengakses endpoint TeacherRoutes ini, harus menyertakan Authorization `Barier Token`, dimana token `Barier Token` didapat dari setelah hit endpoint `login` dan harus user yang level-nya `1`
  - add-teacher: method POST `http://localhost:3000/api/teachers`
  - get-teachers: method GET `http://localhost:3000/api/teachers`
  - update-teachers: method PATCH `http://localhost:3000/api/teachers/id-teacher`
  - delete-teachers: method DELETE `http://localhost:3000/api/teachers/id-teacher`

## Struktur Directory Folder/File

```bash
config/              # Konfigurasi database (Sequelize bawaan)
docs/                # Dokumentasi proyek (Swagger, Markdown, dsb.)
migrations/          # File migrasi database (Sequelize bawaan)
models/              # Model Sequelize
seeders/             # Data seeder (Sequelize bawaan)
src/                 # Semua kode utama
├── config/          # Konfigurasi khusus aplikasi
│   ├── database.js
│   ├── jwt-config.js
│
├── controllers/     # Logika bisnis aplikasi
│   ├── teacher-controller.js
│   ├── student-controller.js
│   ├── auth-controller.js
│
├── middleware/      # Middleware untuk request handling
│   ├── auth-middleware.js
│   ├── error-handler.js
│
├── routes/          # Definisi endpoint API
│   ├── teacher-routes.js
│   ├── student-routes.js
│   ├── auth-routes.js
│
├── index.js         # Entry point aplikasi
tests/               # Unit testing dengan Jest
├── teacher-controller.test.js
├── student-controller.test.js
├── auth-controller.test.js
.env                 # Environment variables
package-lock.json
package.json
```
