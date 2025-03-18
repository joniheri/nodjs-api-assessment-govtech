Mohon berkoordinasi dengan kandidat Joni untuk mengikuti tes di tautan berikut: https://gist.github.com/d3hiring/4d1415d445033d316c36a56f0953f4ef. Hasil tes tidak boleh dikirim ke alamat email yang tercantum di sana, melainkan ke cynthia.rahayu@inphosoft.com dan cc: hanifah@kazokku.co.id atau di WhatsApp ini.

Berikut panduan tesnya:

1. Pastikan berkas README Anda memuat semua langkah yang diperlukan untuk menjalankan semua layanan backend. Setiap langkah yang terlewat dapat mengakibatkan kegagalan.

2. Sertakan skema DB dalam berkas README untuk ditinjau.

3. Migrasi DB dan seeder DB diperlukan.

4. Pastikan semua data tersimpan dalam basis data, termasuk kunci primer dan hubungan kunci asing.

5. Harap baca dan ikuti persyaratan dengan saksama, pastikan semua aspek telah terpenuhi dengan benar. Jika satu persyaratan saja tidak terpenuhi, akan dianggap gagal.
6. Pastikan kode Anda mengikuti praktik terbaik dan ditulis secara efisien.

Harap beri tahu kami setelah pengujian selesai.
Terima kasih.

<!-- ========================================= -->

# NodeJS API Assessment

## 1. Latar Belakang (Background)

Guru membutuhkan sistem untuk mengelola administrasi siswa mereka. Identitas guru dan siswa menggunakan alamat email.

---

## 2. Tugas Anda (Your Task)

Anda harus mengembangkan API yang memungkinkan guru mengelola kelas mereka, sesuai dengan daftar _user stories_ yang diberikan.

**Ketentuan:**

- Kode harus diunggah ke GitHub (atau layanan serupa) dalam repositori yang dapat diakses publik.
- **Login dan akses kontrol sudah dianggap selesai, jadi tidak perlu diimplementasikan.**
- _(Opsional)_ API dapat di-_deploy_ ke server publik.
- Setelah tugas selesai sebelum batas waktu, kirimkan link repositori ke **d3hiring@gmail.com**.

Jika ada pertanyaan, bisa menghubungi **d3hiring@gmail.com**.

---

## 3. Persyaratan/Panduan (Requirements/Expectations)

1. Repositori kode harus memiliki file `README.md` yang mencakup:
   - Link API yang telah di-_deploy_ (jika ada).
   - Cara menjalankan API di _local environment_ (karena tim akan menguji API secara lokal).
2. **Gunakan NodeJS sebagai backend.**
3. **Gunakan MySQL sebagai database.**
4. **Harus menyertakan unit test.**
5. Jika lolos ke tahap wawancara, harus siap untuk:
   - Menjelaskan kode kepada interviewer.
   - Menjelaskan keputusan desain dalam kode.
   - Mengubah atau menambahkan _endpoint_ API jika diminta.

---

## 4. Penilaian (Important!)

Penilaian tidak hanya berdasarkan fungsionalitas, tetapi juga:

- **Kebersihan kode** dan keterbacaan.
- **Keamanan dalam penulisan kode.**
- **Struktur dan desain kode** (misalnya modularitas dan kemudahan pengujian).
- API akan diuji menggunakan alat otomatis, jadi harus **sesuai dengan spesifikasi**.
- _(Opsional)_ Bisa menyertakan **Postman collection** untuk API yang dibuat, tetapi tim juga akan menggunakan alat mereka sendiri untuk pengujian.

---

## 5. Daftar Fitur/API (_User Stories_)

### **1. Mendaftarkan Siswa ke Guru** ✅

- **Endpoint:** `POST /api/register`
- **Headers:** `Content-Type: application/json`
- **Response:** HTTP 204 (tidak mengembalikan data)
- **Contoh Request:**

```json
{
  "teacher": "teacherken@gmail.com",
  "students": ["studentjon@gmail.com", "studenthon@gmail.com"]
}
```

### **2. Mendapatkan Siswa yang Terdaftar di Beberapa Guru** ✅

- **Endpoint:** `GET /api/commonstudents`
- **Response:** HTTP 200
- **Contoh Request:**
  - `GET /api/commonstudents?teacher=teacherken%40gmail.com`
  - `GET /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com`
- **Contoh Response:**

```json
{
  "students": ["commonstudent1@gmail.com", "commonstudent2@gmail.com"]
}
```

### **3. Menskors Siswa (Suspend Student)** ✅

- **Endpoint:** `POST /api/suspend`
- **Headers:** `Content-Type: application/json`
- **Response:** HTTP 204
- **Contoh Request:**

```json
{
  "student": "studentmary@gmail.com"
}
```

### **4. Mengirim Notifikasi ke Siswa yang Terdaftar & yang Disebut dalam Notifikasi** ✅

- **Endpoint:** `POST /api/retrievefornotifications`
- **Headers:** `Content-Type: application/json`
- **Response:** HTTP 200
- **Contoh Request:**

```json
{
  "teacher": "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```

- **Contoh Response:**

```json
{
  "recipients": [
    "studentbob@gmail.com",
    "studentagnes@gmail.com",
    "studentmiche@gmail.com"
  ]
}
```

---

## 6. Respons Error ✅

Jika terjadi kesalahan, API harus memberikan:

- **Kode HTTP yang sesuai.**
- **Pesan error dalam format JSON.**
- **Contoh Response Error:**

```json
{ "message": "Some meaningful error message" }
```
