# TKA GURU - SDN 1 Purwasari
### Platform Otomasi Penyusunan Naskah Asesmen Tes Kemampuan Akademik (TKA) Berbasis AI

Platform resmi SDN 1 Purwasari untuk mempermudah Bapak/Ibu Guru dalam menyusun naskah asesmen, stimulus kontekstual kearifan lokal, bank soal Kurikulum Merdeka, cetak naskah standar A4 dengan Kop Surat resmi, serta simulasi CBT interaktif untuk siswa.

---

## 🚀 Panduan Deploy ke GitHub Pages (Bebas Layar Putih / Blank Screen)

Aplikasi ini telah dikonfigurasi penuh dengan **relative asset paths (`./`)**, **SPA 404 handler**, **`.nojekyll`**, dan **folder rilis `/docs`**. Anda dapat memilih salah satu dari 3 metode deploy berikut:

### Pilihan 1: Otomatis via GitHub Actions (Sangat Disarankan ⭐)
Workflow GitHub Actions telah disediakan di `.github/workflows/deploy.yml`.
1. Push repositori ini ke GitHub (`main` atau `master`).
2. Masuk ke halaman repositori di GitHub -> **Settings** -> **Pages**.
3. Pada bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
4. GitHub Actions akan otomatis mengompilasi dan men-deploy web Anda ke GitHub Pages dalam 1-2 menit.

---

### Pilihan 2: Deploy dari Cabang `main` -> Folder `/docs` (Instan Tanpa Build Server)
Folder `/docs` sudah kami sertakan dan berisi file web yang telah terkompilasi penuh.
1. Masuk ke repositori di GitHub -> **Settings** -> **Pages**.
2. Pada bagian **Build and deployment** > **Source**, pilih **Deploy from a branch**.
3. Pilih Branch: **`main`** (atau `master`).
4. Pilih Folder: **`/docs`** (bukan root `/`).
5. Klik **Save**.
6. Web langsung aktif di URL GitHub Pages Anda tanpa blank putih!

---

### Pilihan 3: Deploy Cepat via Terminal (gh-pages)
Jika Anda memiliki akses terminal atau Git di komputer:
```bash
npm install
npm run deploy
```
Perintah ini akan otomatis menjalankan `npm run build` dan mempublikasikan hasil kompilasi ke branch `gh-pages`. Di GitHub Settings -> Pages, pilih branch `gh-pages` dan folder `/ (root)`.

---

## 💻 Menjalankan di Komputer Lokal (Development)

```bash
# Pasang dependensi
npm install

# Jalankan server lokal
npm run dev

# Buka peramban di http://localhost:3000
```

---

## 🛠️ Fitur Unggulan
1. **Generator Naskah Berbasis AI Gemini**: Menghasilkan stimulus kontekstual kearifan lokal pedesaan Purwasari dan variasi butir soal (PG Tunggal, PG Kompleks, Matriks Benar/Salah).
2. **Editor Naskah & Kisi-kisi**: Penyesuaian stem soal, bobot skor, kunci jawaban, dan pembahasan.
3. **Mode Cetak A4 Standar Dinas**: Kop Surat resmi SDN 1 Purwasari, lembar soal format 2 kolom atau standar, kunci jawaban dan kisi-kisi asesmen siap print/PDF.
4. **Simulasi CBT Interaktif Siswa**: Timer ujian, navigasi nomor 1-30, konfirmasi ragu-ragu dan kirim jawaban.
5. **Analisis Nilai & Cetak Sertifikat**: Visualisasi skor kelulusan, ketercapaian per kompetensi, dan sertifikat prestasi siswa.
