# Documentasi Bahasa Indonesia

## Persyaratan Sistem

- Node JS 22.x.x
- MySQL 8.x.x or atau bisa menggunakan XAMPP 8.1 untuk database MySQL-nya

## Sebelum Jalankan Program

- Kamu harus sudah install Node JS 22.x.x dan MySQL 8.x.x (atau anda bisa menggunakan XAMPP 8.1 untuk Database MySQL) di komputer anda
- Pastikan anda sudah mendapatkan source code ini dari github: https://github.com/joniheri/nodjs-api-assessment-govtech
- Setelah itu, buka source code anda tadi di Text Exitor seperti Visual Studio Code (VSCode)
- Kemudian di VSCode tersebut, silahkan buka terminalnya, kemudian ketikkan sintak berikut:
  - `npm install` --> Install semua library yang dibutuhakn
  - `npx sequelize-cli db:create` --> Membuat database 'assessment_govtech'
  - `npx sequelize-cli db:migrate` --> Migrasi semua tabel ke databse
  - `npx sequelize-cli db:seed --seed 20250318064050-user-seeder` --> Meng-eksekusi file seeder untuk menginputkan 1 data ke tabel 'users'

## Jalankan Program

- Setelah itu, jika semua langkah2 diatas sudah berhasil, runing program dengan ketik di termnal VSCode tadi:
  - `npm run dev`
- Jika runing program berhasil, anda bisa di tes URL: `localhost:3000` di browser anda atau bisa menggunakan aplikasi Postman

## Endpoint API

- AuthRoutes:
  - `POST` `http://localhost:3000/api/auth/register` --> register-user
  - `POST` `http://localhost:3000/api/auth/login` --> login-user
  - `POST` `http://localhost:3000/api/auth/refres-token` --> refres-token-user
- TeacherRoutes:
  - `POST` `http://localhost:3000/api/teachers/register` --> register siswa oleh guru
  - `POST` `Bearer Token` `http://localhost:3000/api/teachers/register-protected` --> register siswa oleh guru menggunakan token (ini hanya contoh endpoint yang menggunakan middleware)
  - `GET` `http://localhost:3000/api/teachers/commonstudents?teacher=teacher@email.com` --> menampilkan data siswa berdasarkan guru
  - `GET` `http://localhost:3000/api/teachers/commonstudents?teacher=teacher@email.com&teacher=teacher2@email.com` --> menampilkan data siswa berdasarkan multi guru
  - ` POST` `http://localhost:3000/api/teachers/suspend ` --> memberikan suspend/skors ke siswa
  - ` POST` `http://localhost:3000/api/teachers/retrievefornotifications ` --> mengirimi notifikasi ke siswa
  - Catatan:
    - Untuk endpoint yang harus menyertakan Authorization `Barier Token`, dapatkan token dari endpoint `http://localhost:3000/api/auth/register` dan harus user yang level-nya `1`.

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
