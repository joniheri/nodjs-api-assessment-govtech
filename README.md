# Documentation

## System Requiremen

- Node JS 22.x.x
- MySQL 8.x.x or atau bisa menggunakan XAMPP 8.1 untuk database MySQL-nya

# To Run Program

- Kamu harus sudah install Node JS 22.x.x dan MySQL 8.x.x (Atau anda bisa menggunakan XAMPP 8.1 untuk Database MySQL) di komputer anda
- Pastikan anda sudah mendapatkan source code ini dati github: https://github.com/joniheri/nodjs-api-assessment-govtech
- Setelah itu, buka source code anda tadi di Text Exitor seperti Visual Studio Code (VSCode)
- Kemudian di VSCode tersebut, silahkan buka terminalnya, kemudian ketikkan sintak berikut:
  - `npm install` enter
  - `npx sequelize-cli db:migrate` enter
  - `npx sequelize-cli db:seed --seed UserSeeder` enter
- Setelah itu, jika semua sudah berhasil, runing project ini dengan cara sintak erikut di termnal VSCode tadi:
  - `npm run dev`
