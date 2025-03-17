# Documentasi Indonesia

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
  - `npx sequelize-cli db:seed --seed UserSeeder` Menginputkan 1 data ke tabel 'users'

## Jalankan Program

- Setelah itu, jika semua sudah langkah2 diatas berhasil, runing program dengan ketik di termnal VSCode tadi:
  - `npm run dev`
- Jika runing program berhasil, akan bisa di tes ti Base URL: `localhost:3000` di browser anda atau bisa menggunakan postman

# Endpoint API
