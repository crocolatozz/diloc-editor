# PMR Editor — Logsheet DILOC Urea 1B

![Version](https://img.shields.io/badge/version-1.10.0-10b981?style=flat-square)
![Vite](https://img.shields.io/badge/build-Vite-646cff?style=flat-square&logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-0ea5e9?style=flat-square)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-334155?style=flat-square)

Aplikasi web progresif (**PWA**) ringan berbasis **Vite + Vanilla JavaScript** untuk pencatatan dan penyuntingan data parameter *Logsheet* lapangan **Pabrik Urea 1B** secara cepat, akurat, dan *offline-first*, lalu mengekspornya langsung menjadi skrip otomasi **PyMacroRecord (`.pmr`)** maupun format **Web Runner (`.json`)**.

**Live App:** [https://crocolatozz.github.io/pmr-editor/](https://crocolatozz.github.io/pmr-editor/)

---

## Fitur Utama

- **Dukungan Multi-Operator Lengkap**
  - **Operator 1:** 167 parameter lapangan
  - **Operator 2:** 51 parameter lapangan
  - **Operator 3:** 45 parameter lapangan
- **Kecepatan Playback Normal Terkalibrasi**
  - Input angka & pilihan menggunakan pengaman tanda titik ganda (`.`), tombol *Next* bawaan pada keyboard numerik HP, serta struktur delay & konsistensi timestamp playback **Normal** (termasuk mempertahankan profil timing file `.pmr`/`.json` hasil import).
- **Import, Export & Direct Share**
  - Mendukung buka/edit ulang file `.pmr` (*PyMacroRecord*) maupun `.json` (*Web Runner*) dengan konfirmasi aman sebelum menimpa draft aktif.
  - Ekspor instan dengan penamaan otomatis berbasis tanggal (`Logsheet_operatorX_YYYY-MM-DD.pmr`) serta tombol **Share** langsung ke AirDrop, LocalSend, Files, atau WhatsApp.
- **Auto-Save Draft (Tanggal & Jam) & Navigasi Cepat**
  - Setiap ketikan tersimpan otomatis di `localStorage` beserta stempel waktu lengkap (`DD/MM, HH:mm`) sehingga aman meski browser tertutup.
  - Dilengkapi indikator progres (`Terisi: X / Y Cell`), pencarian Tag/Equipment lebar penuh, dan tombol lompat cepat ke sel kosong (`Sel Kosong (X)`).
- **Native App Experience (iOS & Android)**
  - Mendukung instalasi *Add to Home Screen* dengan *Splash Screen* seragam bergaya Samsung (khusus mode PWA standalone iOS & WebAPK Android) dan berjalan penuh tanpa koneksi internet (*Service Worker*).
  - Optimasi *safe-area* atas & bawah anti-balok hitam untuk iPhone (*notch / Dynamic Island / home indicator*), input `16px` anti-zoom otomatis di iOS Safari, kunci *pull-to-refresh*, toast notification 3-varian, serta *haptic feedback* di Android.

---

## Struktur Proyek

```text
pmr-editor/
├── index.html                  # Struktur antarmuka utama, splash screen iOS & gaya tampilan
├── package.json                # Konfigurasi dependensi & skrip Vite
├── vite.config.js              # Konfigurasi build Vite (base: './')
├── AI_RULES.md                 # Panduan standar pengembangan & versioning
├── CHANGELOG.md                # Riwayat pembaruan setiap rilis versi
└── public/
    ├── app.js                  # Logika utama editor, parser .pmr/.json, toast & modal
    ├── sw.js                   # Service Worker untuk caching offline & auto-update
    ├── version.json            # Penanda versi sekunder anti-cache
    ├── manifest.json           # Konfigurasi PWA & ikon multi-platform
    ├── icon.svg                # Master ikon vektor aplikasi
    ├── apple-touch-icon.png    # Ikon khusus iOS Home Screen (180x180)
    ├── splash-*.png            # Aset startup splash screen iOS standalone
    ├── icon-192.png            # Ikon standar PWA (192x192)
    ├── icon-512.png            # Ikon standar PWA (512x512)
    ├── icon-maskable-*.png     # Ikon adaptif Android anti-crop
    └── data/
        ├── operator1.json      # Skema parameter & koordinat makro Operator 1
        ├── operator2.json      # Skema parameter & koordinat makro Operator 2
        └── operator3.json      # Skema parameter & koordinat makro Operator 3
```

---

## Instalasi & Pengembangan Lokal

Pastikan **Node.js** sudah terpasang di perangkat kamu, lalu jalankan perintah berikut:

```bash
# 1. Clone repository
git clone https://github.com/crocolatozz/pmr-editor.git
cd pmr-editor

# 2. Install dependensi
npm install

# 3. Jalankan server development
npm run dev

# 4. Build untuk produksi (hasil di folder dist/)
npm run build
```

---

## Alur Penggunaan Singkat

1. **Pilih Operator** (`Operator 1`, `2`, atau `3`) pada baris atas Control Card, atau **Import** file `.pmr`/`.json` yang sudah ada.
2. **Input Data Lapangan** secara berurutan menggunakan tombol *Next* pada keyboard atau gunakan kolom **Cari Tag / Equipment** selebar penuh untuk melompat ke parameter tertentu.
3. Pastikan seluruh parameter terisi dengan mengecek indikator progres (`Terisi: X / Y Cell`) atau tombol **Sel Kosong**.
4. Pilih format output lalu klik **Export** untuk mengunduh file `.pmr` / `.json`, atau klik **Share** untuk mengirim file langsung ke PC ruang kontrol.

---

## Riwayat Perubahan

Seluruh catatan pembaruan versi tercatat secara terstruktur di file [`CHANGELOG.md`](./CHANGELOG.md).

---

© 2026 — Developed by **FIKRI**