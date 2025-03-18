# Dokumentasi API (Bahasa Indonesia)

## Persyaratan Sistem

- Node.js 22.x.x
- MySQL 8.x.x atau XAMPP 8.1 untuk database MySQL

## Sebelum Menjalankan Program

1. Pastikan Node.js dan MySQL sudah terinstal.
2. Clone repository dari GitHub:
   ```sh
   git clone https://github.com/joniheri/nodjs-api-assessment-govtech
   ```
3. Buka proyek di Visual Studio Code (VSCode).
4. Buka terminal dan jalankan perintah berikut:
   ```sh
   npm install                  # Install semua dependency
   npx sequelize-cli db:create   # Membuat database 'assessment_govtech'
   npx sequelize-cli db:migrate  # Migrasi semua tabel ke database
   npx sequelize-cli db:seed --seed 20250318064050-user-seeder  # Seed data awal
   ```

## Menjalankan Program

Jalankan server dengan perintah berikut:

```sh
npm run dev
```

Jika berhasil, API dapat diakses melalui `http://localhost:3000`

## Endpoint API

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**

```json
{
  "email": "testing2@email.com",
  "username": "testing2",
  "fullName": "Testing 2",
  "password": "admin"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "User registered successfully",
  "user": {
    "id": 8703,
    "email": "testing2@email.com",
    "username": "testing2",
    "fullName": "Testing 2",
    "level": 2,
    "status": "active"
  }
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "admin@email.com",
  "password": "admin"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Login Success",
  "user": {
    "id": 8701,
    "email": "admin@email.com",
    "username": "admin",
    "fullName": "Administrator",
    "level": 1
  },
  "token": "JWT_ACCESS_TOKEN",
  "refreshToken": "JWT_REFRESH_TOKEN"
}
```

---

### 3. Menampilkan Data Guru

**Endpoint:** `GET /api/teachers`

**Response:**

```json
{
  "status": "success",
  "message": "Get Teachers successfully",
  "data": [
    {
      "id": 2,
      "email": "teacher@email.com",
      "fullName": null,
      "gender": null
    },
    {
      "id": 1,
      "email": "teacher1@email.com",
      "fullName": null,
      "gender": null
    }
  ]
}
```

---

### 4. Register Siswa Oleh Guru

**Endpoint:** `POST /api/teachers/register`

**Request Body:**

```json
{
  "teacher": "teacher@email.com",
  "students": ["student1@email.com", "student2@email.com", "student4@email.com"]
}
```

**Response:** Tidak ada (status: `HTTP 204`)

---

### 5. Mengirim Notifikasi ke Siswa Oleh Guru

**Endpoint:** `POST /api/teachers/retrievefornotifications`

**Request Body:**

```json
{
  "teacher": "teacher@email.com",
  "notification": "Hello students! @student4@email.com"
}
```

**Response:**

```json
{
  "recipients": [
    "student1@email.com",
    "student2@email.com",
    "student4@email.com"
  ]
}
```

---

## Struktur Direktori

```bash
config/              # Database configuration (Sequelize default)
docs/                # Project documentation (Swagger, Markdown, etc.)
migrations/          # Database migrations (Sequelize default)
models/              # Sequelize models
seeders/             # Seeder data (Sequelize default)
src/                 # Main source code
├── config/          # Application-specific configuration
│   ├── database.js
│   ├── jwt-config.js
│
├── controllers/     # Business logic
│   ├── teacher-controller.js
│   ├── student-controller.js
│   ├── auth-controller.js
│
├── middleware/      # Middleware for request handling
│   ├── auth-middleware.js
│   ├── error-handler.js
│
├── routes/          # API endpoint definitions
│   ├── teacher-routes.js
│   ├── student-routes.js
│   ├── auth-routes.js
│
├── index.js         # Application entry point
tests/               # Unit testing with Jest
├── teacher-controller.test.js
├── student-controller.test.js
├── auth-controller.test.js
.env                 # Environment variables
package-lock.json
package.json
```

---

## Catatan

- Beberapa endpoint membutuhkan Authorization `Bearer Token`. Token didapat dari endpoint login.
- Gunakan Postman atau aplikasi sejenis untuk menguji API.

  **Selamat mencoba!**

---

---

# Documentation (English Version)

## System Requirements

- Node.js 22.x.x
- MySQL 8.x.x or XAMPP 8.1 for MySQL database

## Before Running the Program

- Ensure you have installed Node.js 22.x.x and MySQL 8.x.x (or XAMPP 8.1 for MySQL database) on your computer.
- Obtain the source code from GitHub: [https://github.com/joniheri/nodjs-api-assessment-govtech](https://github.com/joniheri/nodjs-api-assessment-govtech)
- Open the source code in a text editor like Visual Studio Code (VSCode).
- Open the terminal in VSCode and run the following commands:
  - `npm install` → Install all required libraries.
  - `npx sequelize-cli db:create` → Create the `assessment_govtech` database.
  - `npx sequelize-cli db:migrate` → Run all table migrations.
  - `npx sequelize-cli db:seed --seed 20250318064050-user-seeder` → Execute the seeder file to insert initial data into the `users` table.

## Running the Program

- Once all the above steps are completed, start the program by running the following command in the VSCode terminal:
  - `npm run dev`
- If the program runs successfully, test the URL: `localhost:3000` in your browser or use Postman.

## API Endpoints

### User Registration:

- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "email": "testin2g@email.com",
    "username": "testing2",
    "fullName": "Testing 1",
    "password": "admin"
  }
  ```
- **Response Body:**
  ```json
  {
    "status": "success",
    "message": "User registered successfully",
    "user": {
      "id": 8703,
      "email": "testin2g@email.com",
      "username": "testing2",
      "fullName": "Testing 1",
      "level": 2,
      "status": "active"
    }
  }
  ```

### User Login:

- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "admin@email.com",
    "password": "admin"
  }
  ```
- **Response Body:**
  ```json
  {
    "status": "success",
    "message": "Login Success",
    "user": {
      "id": 8701,
      "email": "admin@email.com",
      "username": "admin",
      "fullName": "Administrator",
      "level": 1
    },
    "token": "<JWT_TOKEN>",
    "refreshToken": "<REFRESH_TOKEN>"
  }
  ```

### Retrieve Teachers:

- **Endpoint:** `GET /api/teachers`
- **Response Body:**
  ```json
  {
    "status": "success",
    "message": "Get Teachers successfully",
    "data": [
      {
        "id": 2,
        "email": "teacher@email.com",
        "fullName": null,
        "gender": null
      },
      {
        "id": 1,
        "email": "teacher1@email.com",
        "fullName": null,
        "gender": null
      }
    ]
  }
  ```

### Register Students Under a Teacher:

- **Endpoint:** `POST /api/teachers/register`
- **Request Body:**
  ```json
  {
    "teacher": "teacher@email.com",
    "students": [
      "student1@email.com",
      "student2@email.com",
      "student4@email.com"
    ]
  }
  ```
- **Response:** No response body, returns `HTTP 204`

### Retrieve Students for a Specific Teacher:

- **Endpoint:** `GET /api/teachers/commonstudents?teacher=teacher@email.com`
- **Response Body:**
  ```json
  {
    "students": [
      "student1@email.com",
      "student2@email.com",
      "student4@email.com"
    ]
  }
  ```

### Retrieve Students for Multiple Teachers:

- **Endpoint:** `GET /api/teachers/commonstudents?teacher=teacher@email.com&teacher=teacher2@email.com`
- **Response Body:**
  ```json
  {
    "students": [
      "student1@email.com",
      "student2@email.com",
      "student3@email.com",
      "student4@email.com"
    ]
  }
  ```

### Suspend a Student:

- **Endpoint:** `POST /api/teachers/suspend`
- **Request Body:**
  ```json
  {
    "student": "student4@email.com"
  }
  ```
- **Response:** No response body, returns `HTTP 204`

### Send Notifications to Students:

- **Endpoint:** `POST /api/teachers/retrievefornotifications`
- **Request Body:**
  ```json
  {
    "teacher": "teacher@email.com",
    "notification": "Hello students! @student4@email.com"
  }
  ```
- **Response Body:**
  ```json
  {
    "recipients": [
      "student1@email.com",
      "student2@email.com",
      "student4@email.com"
    ]
  }
  ```

### Note:

- For endpoints requiring `Bearer Token` authorization, obtain the token from `POST /api/auth/login`. Only users with level `1` can access these endpoints.

## Directory Structure

```bash
config/              # Database configuration (Sequelize default)
docs/                # Project documentation (Swagger, Markdown, etc.)
migrations/          # Database migrations (Sequelize default)
models/              # Sequelize models
seeders/             # Seeder data (Sequelize default)
src/                 # Main source code
├── config/          # Application-specific configuration
│   ├── database.js
│   ├── jwt-config.js
│
├── controllers/     # Business logic
│   ├── teacher-controller.js
│   ├── student-controller.js
│   ├── auth-controller.js
│
├── middleware/      # Middleware for request handling
│   ├── auth-middleware.js
│   ├── error-handler.js
│
├── routes/          # API endpoint definitions
│   ├── teacher-routes.js
│   ├── student-routes.js
│   ├── auth-routes.js
│
├── index.js         # Application entry point
tests/               # Unit testing with Jest
├── teacher-controller.test.js
├── student-controller.test.js
├── auth-controller.test.js
.env                 # Environment variables
package-lock.json
package.json
```
