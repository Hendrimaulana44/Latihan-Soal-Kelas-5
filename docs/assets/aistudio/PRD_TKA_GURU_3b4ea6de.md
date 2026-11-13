# PRD: TKA GURU

**Platform Generator Naskah Latihan Tes Kemampuan Akademik (TKA) Berbasis AI** Disusun untuk: SDN 1 Purwasari | Google Apps Script Web App

\---

## 1\. Judul \& Ringkasan Eksekutif

**Nama Produk:** Latihan Soal **Tagline:** "Buat Naskah Ulangan Lebih Mudah dengan AI."

TKA GURU adalah aplikasi web berbasis Google Apps Script (GAS) yang membantu guru SDN 1 Purwasari membuat naskah latihan Tes Kemampuan Akademik (TKA) secara otomatis menggunakan AI (Gemini API), untuk mata pelajaran Matematika dan Bahasa Indonesia, jenjang kelas 1–6 SD. Guru cukup memasukkan kisi-kisi materi; AI akan menyusun stimulus, soal, pilihan jawaban, kunci jawaban, dan pembahasan secara otomatis dan konsisten. Aplikasi menyediakan mode naskah cetak (seperti lembar ujian resmi) dan mode ujian interaktif untuk siswa, lengkap dengan penilaian otomatis dan laporan hasil belajar.

Aplikasi dibangun dengan arsitektur satu aplikasi GAS (pola 4 file: `Code.gs`, `Index.html`, `Stylesheet.html`, `JavaScript.html`), menggunakan Google Sheets sebagai basis data dan Google Drive untuk penyimpanan berkas pendukung.

\---

## 2\. Latar Belakang \& Tujuan Produk

**Latar belakang:** Penyusunan naskah latihan TKA secara manual memakan waktu lama bagi guru — mulai dari menyusun stimulus bacaan/konteks matematis yang orisinal, menyusun variasi tipe soal, hingga memastikan kunci jawaban dan pembahasan benar. Proses ini berulang untuk tiap kelas dan tiap mata pelajaran.

**Tujuan produk:**

* Mengotomatiskan pembuatan naskah latihan TKA dari kisi-kisi materi menggunakan AI, untuk mapel Matematika dan Bahasa Indonesia, kelas 1–6 SD.
* Memungkinkan guru mengedit, menambah, atau menghapus soal secara manual sebagai penyempurnaan hasil AI.
* Menyediakan mode ujian interaktif bagi siswa dengan penilaian otomatis dan laporan analisis performa.
* Menjadi alat bantu bersama bagi seluruh guru (±12 orang) di SDN 1 Purwasari, dengan satu pengelola (Admin) yang mengatur tampilan dan profil guru.

**Ruang lingkup:** Aplikasi dapat diakses melalui tautan publik (tidak dibatasi IP/domain), namun fitur inti (membuat naskah, login siswa, menyimpan hasil) hanya aktif untuk akun guru dan siswa yang sudah terdaftar di sistem.

\---

## 3\. Target Pengguna \& Matriks Hak Akses (RBAC)

### Jenis Pengguna

1. **Admin (Pengelola)** — pemilik aplikasi (1 orang, merangkap sebagai guru biasa).
2. **Guru** — ±12 orang, masing-masing login dengan email terdaftar, setara satu sama lain.
3. **Siswa** — kelas 1–6, login opsional menggunakan NISN yang didaftarkan oleh guru (hanya diperlukan jika ingin nilainya tercatat).

### Matriks Hak Akses

|Fitur / Aksi|Admin|Guru|Siswa|
|-|-|-|-|
|Login via email terdaftar|✔|✔|—|
|Login via NISN terdaftar|—|—|✔ (opsional)|
|Membuat naskah baru (input kisi-kisi → generate AI)|✔ (miliknya)|✔ (miliknya)|✘|
|Melihat/mengelola naskah milik guru lain|✔ (hanya tampilan, bukan kelola)|✘|✘|
|Edit / tambah soal manual / hapus soal pada naskah sendiri|✔|✔|✘|
|Kelola daftar siswa \& NISN kelasnya sendiri|✔|✔|✘|
|Mengatur tema/tampilan aplikasi (warna latar, dsb.)|✔|✘|✘|
|Mengatur/mengedit profil seluruh guru|✔|✘ (hanya profil sendiri)|✘|
|Mengerjakan mode ujian interaktif|—|—|✔|
|Melihat hasil \& pembahasan ujian sendiri|—|✔ (semua naskah miliknya)|✔ (ujian miliknya)|
|Mencetak / ekspor PDF naskah \& kunci jawaban|✔|✔|✘|

Catatan: Admin memiliki seluruh hak Guru ditambah dua kewenangan khusus (tema tampilan \& kelola profil semua guru). Tidak ada guru lain yang bisa melihat/mengubah data milik guru lain kecuali Admin (hanya untuk kebutuhan pengelolaan, bukan mengedit isi naskah guru lain).

\---

## 4\. Arsitektur Data (Google Sheets \& Drive) serta Integrasi Workspace

Satu Google Spreadsheet digunakan sebagai basis data utama, dengan sheet terpisah per entitas:

|Sheet|Isi|
|-|-|
|`Guru`|ID guru, nama, email (untuk login), kelas/mapel yang diampu, foto profil (link Drive)|
|`Siswa`|ID siswa, NISN, nama, kelas, guru wali/pendaftar|
|`Naskah`|ID naskah, ID guru pembuat, mapel, kisi-kisi asli, jenjang, tanggal dibuat, status (draft/final)|
|`Soal`|ID soal, ID naskah, ID stimulus (jika ada), tipe soal, teks soal, opsi jawaban, kunci jawaban, pembahasan, sumber (AI/manual)|
|`Stimulus`|ID stimulus, ID naskah, teks/ilustrasi (SVG inline atau link gambar Drive), mapel|
|`HasilUjian`|ID hasil, ID naskah, ID siswa, jawaban siswa (JSON), nilai akhir, jumlah benar/salah/kosong, waktu pengerjaan|
|`PengaturanTema`|Key-value pengaturan tampilan (warna latar, dsb.), diatur oleh Admin|

**Google Drive:**

* Folder khusus `TKA\_GURU\_Files` untuk menyimpan gambar/ilustrasi tambahan yang diunggah guru untuk stimulus soal.
* Folder per naskah (opsional) agar berkas pendukung mudah ditelusuri.

**Integrasi Workspace:**

* **Google Sheets** sebagai database utama (dibaca/ditulis via `SpreadsheetApp`).
* **Google Drive** untuk penyimpanan berkas unggahan guru (`DriveApp`).
* **Gemini API** untuk generasi konten soal — API key disimpan aman di `PropertiesService` (Script Properties), tidak pernah ditanam di sisi client/HTML.
* Tidak memerlukan Gmail/email otomatis (sesuai keputusan: cukup ekspor/cetak PDF, tanpa notifikasi email).

\---

## 5\. Persyaratan Fungsional (User Stories \& Acceptance Criteria)

### 5.1 Autentikasi

* **Sebagai Guru**, saya ingin login menggunakan email yang sudah didaftarkan Admin, agar hanya guru terdaftar yang bisa mengakses dashboard.
* AC: Sistem menolak login jika email tidak ada di sheet `Guru`.
* **Sebagai Siswa**, saya ingin login menggunakan NISN yang didaftarkan guru (opsional), agar nilai ujian saya tercatat.
* AC: Siswa tanpa NISN tetap bisa mengerjakan ujian, namun hasilnya tidak tersimpan permanen di `HasilUjian`.

### 5.2 Pembuatan Naskah Otomatis

* **Sebagai Guru**, saya ingin memasukkan kisi-kisi materi dalam bentuk teks dan menekan tombol "Generate Naskah", agar AI otomatis membuat stimulus, soal, kunci jawaban, dan pembahasan.
* AC: Sistem mendeteksi mapel otomatis dari kisi-kisi; jika dua mapel sekaligus dimasukkan, dibuat dua paket naskah terpisah.
* AC: Default 30 soal per paket (10 stimulus × 3 soal), dapat menyesuaikan jika kisi-kisi terlalu sedikit/banyak.
* AC: Tiap soal lolos validasi otomatis (kesesuaian kisi-kisi, kebenaran kunci, kelayakan pengecoh) sebelum ditampilkan ke guru.

### 5.3 Pengeditan Naskah oleh Guru

* **Sebagai Guru**, saya ingin mengedit stimulus, pertanyaan, opsi jawaban, kunci, dan pembahasan hasil AI.
* **Sebagai Guru**, saya ingin menambahkan soal secara manual ke dalam naskah, baik dengan stimulus maupun tanpa stimulus.
* **Sebagai Guru**, saya ingin menghapus soal tertentu dari naskah.
* AC: Perubahan (edit/tambah/hapus) langsung tersimpan ke sheet `Soal` dan tercermin di mode naskah maupun mode ujian.

### 5.4 Mode Naskah (Cetak)

* **Sebagai Guru**, saya ingin melihat naskah dalam tampilan dokumen rapi (layout A4) yang siap dicetak/diekspor PDF.
* AC: Penomoran soal konsisten, stimulus \& soal tidak terpisah secara tidak wajar antar halaman cetak.

### 5.5 Mode Ujian Interaktif

* **Sebagai Siswa**, saya ingin mengerjakan soal secara interaktif langsung di aplikasi, dengan navigasi nomor soal, timer, dan penanda soal yang sudah/belum dijawab/ditandai untuk ditinjau.
* AC: Siswa tidak dapat melihat kunci jawaban selama ujian berlangsung.
* AC: Sistem mendukung penilaian otomatis untuk semua tipe soal (PG, PG Kompleks, Benar/Salah, Sesuai/Tidak Sesuai, Mendukung/Tidak Mendukung, dsb.).

### 5.6 Hasil \& Pembahasan

* **Sebagai Siswa**, setelah selesai ujian, saya ingin melihat nilai akhir, jumlah benar/salah/kosong, serta pembahasan tiap soal.
* **Sebagai Guru**, saya ingin melihat rekap hasil seluruh siswa per naskah, dalam bentuk **tabel yang bisa dicari \& difilter** maupun **grafik analisis performa per materi**.
* AC: Data hasil ujian tersimpan permanen di sheet `HasilUjian` (hanya untuk siswa yang login via NISN).

### 5.7 Manajemen Siswa \& Profil Guru

* **Sebagai Guru**, saya ingin mendaftarkan/mengelola daftar siswa (nama \& NISN) di kelas saya.
* **Sebagai Guru**, saya ingin mengatur profil saya sendiri (nama, foto, kelas/mapel yang diampu).

### 5.8 Fitur Khusus Admin

* **Sebagai Admin**, saya ingin mengatur tema/tampilan aplikasi (warna latar dan elemen visual lain) untuk seluruh pengguna.
* **Sebagai Admin**, saya ingin mengelola profil seluruh guru (menambah/menghapus akun guru, mengedit data guru).

### 5.9 Ekspor \& Cetak

* **Sebagai Guru**, saya ingin mencetak naskah dan kunci jawaban secara terpisah, atau mengunduhnya sebagai PDF melalui fitur print browser.

\---

## 6\. Persyaratan Non-Fungsional \& Keterbatasan Spesifik GAS

* **Performa:** Proses generate naskah (panggilan ke Gemini API) harus menampilkan indikator progres bertahap (menganalisis kisi-kisi → membuat stimulus → menyusun soal → validasi → selesai), karena panggilan API bisa memakan waktu beberapa detik hingga puluhan detik.
* **Batas eksekusi GAS:** Fungsi server-side (`google.script.run`) pada akun Google biasa dibatasi maksimal 6 menit per eksekusi — proses generate per paket soal harus dirancang agar selesai dalam batas ini, atau dipecah per kelompok stimulus jika kisi-kisi sangat panjang.
* **Kuota API:** Panggilan `UrlFetchApp` ke Gemini API dan kuota harian GAS (jumlah panggilan eksternal per hari) perlu diperhitungkan mengingat ±12 guru dan ±7 naskah/minggu — volume ini masih jauh di bawah kuota standar akun Google Workspace/akun biasa.
* **Keamanan API key:** API key Gemini disimpan di `PropertiesService` sisi server, tidak pernah dikirim ke client/HTML.
* **Konkurensi:** Karena banyak guru memakai spreadsheet yang sama sebagai database, penulisan data harus menggunakan `LockService` untuk mencegah tabrakan data saat beberapa guru menyimpan secara bersamaan.
* **Ukuran data:** Jika jumlah naskah \& hasil ujian terus bertambah, perlu dipertimbangkan arsip berkala agar performa pembacaan spreadsheet tetap cepat.
* **Kompatibilitas:** Tampilan harus responsif (desktop untuk guru, bisa diakses dari HP/tablet untuk siswa saat ujian).
* **Ketersediaan:** Aplikasi di-deploy sebagai GAS Web App dengan akses "Siapa saja yang memiliki link" (eksekusi berjalan sebagai pemilik skrip), namun validasi login (email guru / NISN siswa) tetap dilakukan di level aplikasi sebelum fitur inti dapat dipakai.

\---

## 7\. Spesifikasi Antarmuka (Frontend) \& Alur Kerja Client-Server

Aplikasi dibangun dalam **satu proyek Google Apps Script**, dengan 4 file standar:

* `Code.gs` — seluruh logika server: autentikasi, akses Sheets/Drive, pemanggilan Gemini API, validasi soal, penilaian ujian.
* `Index.html` — struktur halaman (dashboard, input kisi-kisi, preview naskah, mode ujian, hasil, pengaturan).
* `Stylesheet.html` — gaya visual: tema biru-putih, EdTech profesional, modern minimalis, responsive.
* `JavaScript.html` — logika client-side, memanggil fungsi server via `google.script.run`, mengelola state navigasi SPA di sisi client.

**Halaman utama:**

1. **Login** (email guru / NISN siswa / masuk tanpa NISN untuk latihan tanpa pencatatan nilai).
2. **Dashboard Guru** — daftar naskah, tombol buat naskah baru, status (draft/final), mapel \& tanggal.
3. **Input Kisi-Kisi** — textarea + tombol Generate Naskah.
4. **Proses Generasi** — indikator tahapan AI.
5. **Preview Naskah** — mode naskah (A4, siap cetak) dan mode ujian (interaktif) dalam satu halaman dengan toggle.
6. **Editor Soal** — tambah/edit/hapus soal \& stimulus.
7. **Mode Ujian Siswa** — navigasi soal, timer, progress, submit.
8. **Hasil \& Pembahasan** — nilai, analisis performa (grafik + tabel filter).
9. **Kelola Siswa** — tambah/edit NISN \& nama siswa per kelas.
10. **Pengaturan Profil** (semua guru) \& **Pengaturan Tema + Kelola Profil Guru** (khusus Admin).

**Alur client-server:** Client (`JavaScript.html`) memanggil fungsi di `Code.gs` melalui `google.script.run.withSuccessHandler(...).namaFungsi(...)`. Semua validasi hak akses (role Admin/Guru/Siswa) dilakukan di sisi server sebelum data dikembalikan ke client, bukan hanya disembunyikan di tampilan.

\---

## 8\. Rencana Deployment \& Pengujian

**Deployment:**

1. Setup Google Spreadsheet basis data dengan seluruh sheet pada bagian 4.
2. Setup folder Google Drive untuk berkas pendukung.
3. Simpan API key Gemini di Script Properties.
4. Deploy sebagai Web App (akses: "Siapa saja yang memiliki link", eksekusi sebagai pemilik skrip).
5. Daftarkan akun 12 guru awal (email) dan Admin di sheet `Guru`.
6. Bagikan link aplikasi ke seluruh guru SDN 1 Purwasari.

**Pengujian:**

* Uji login guru (email terdaftar/tidak terdaftar) dan siswa (NISN terdaftar/tidak terdaftar/tanpa NISN).
* Uji generate naskah untuk kisi-kisi Matematika, Bahasa Indonesia, dan keduanya sekaligus.
* Uji tambah/edit/hapus soal manual, termasuk soal tanpa stimulus.
* Uji mode ujian interaktif untuk seluruh tipe soal (PG, PG Kompleks, Benar/Salah, Sesuai/Tidak Sesuai, Mendukung/Tidak Mendukung) dan verifikasi penilaian otomatis.
* Uji penyimpanan hasil ujian ke `HasilUjian` dan tampilan laporan (tabel filter + grafik).
* Uji cetak/ekspor PDF naskah \& kunci jawaban terpisah.
* Uji fitur khusus Admin (ubah tema, kelola profil guru lain).
* Uji konkurensi: beberapa guru generate/simpan naskah secara bersamaan.

\---

> ---
>
> ### 🎨 Tahapan Khusus: Penentuan Visual UI/UX
>
> 1. \*\*Unggah Referensi:\*\* Silakan unggah referensi gambaran aplikasi, skema warna, dan karakteristik UI/UX yang diinginkan untuk website ini.
> 2. \*\*Jika Belum Ada Gambaran:\*\*
>    - \*\*COPY\*\* seluruh teks dokumen PRD FINAL di atas.
>    - Buka \*\*Google Stitch\*\*, lalu \*\*PASTE\*\* hasil PRD tadi ke dalamnya.
>    - Cek dan unduh hasil visualisasi UI/UX yang dibuat Google Stitch.
>    - Unggah kembali file gambar hasil UI/UX tersebut ke percakapan ini untuk dibedah dan diterapkan model desainnya.

