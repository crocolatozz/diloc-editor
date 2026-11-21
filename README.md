# DILOC Editor — Logsheet DILOC Urea 1B

![Version](https://img.shields.io/badge/version-1.11.0-10b981?style=flat-square)
![Vite](https://img.shields.io/badge/build-Vite-646cff?style=flat-square&logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-0ea5e9?style=flat-square)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-334155?style=flat-square)

Aplikasi web progresif (**PWA**) ringan berbasis **Vite + Vanilla JavaScript** untuk pencatatan dan penyuntingan data parameter *Logsheet* lapangan **Pabrik Urea 1B** secara cepat, akurat, dan *offline-first*, lalu mengekspornya langsung menjadi preset **DILOC Automator (`.json`)** maupun skrip otomasi **PyMacroRecord (`.pmr`)**.

**Live App:** [https://crocolatozz.github.io/diloc-editor/](https://crocolatozz.github.io/diloc-editor/)

---

## Fitur Utama

- **Dukungan Multi-Operator Lengkap**
  - **Operator 1:** 167 parameter lapangan
  - **Operator 2:** 51 parameter lapangan
  - **Operator 3:** 45 parameter lapangan
- **Integrasi Penuh DILOC Automator (`.json`) & Macro PMR (`.pmr`)**
  - Mendukung export & share langsung preset native **`DILOC Automator (.json)`** (`format: "diloc-automator-preset"`, `version: "2.1.2"`) dengan pemetaan `index` 0-based, `type` (`"number"` / `"text"`), `value` string, dan status `checked`.
  - Mendukung export **`Macro PMR (.pmr)`** dengan kecepatan playback **Normal** terkalibrasi serta mempertahankan profil timing hasil import.
- **Import Cerdas & Pengisian Fleksibel**
  - Auto-detect file `.json` (`diloc-automator-preset`) dengan perpindahan otomatis ke `opLap` target dan pemetaan berbasis `cell.index`, maupun import ulang file `.pmr` (*PyMacroRecord*).
  - Mendukung input teks bebas pada parameter bertipe `"text"`, pilihan dropdown (`A/B`, `ON/OFF`, `Huruf`), dan filter angka presisi pada parameter numerik.
- **Control Card Adaptif & Auto-Save Draft (`DD/MM, HH:mm`)**
  - Tata letak **1 baris ringkas** di browser desktop (`>= 1024px`) dan **3 baris seimbang** di HP/tablet (`< 1024px`) dengan icon SVG statis di dalam kontrol.
  - Setiap ketikan dan status `checked` tersimpan otomatis di `localStorage` beserta stempel waktu (`DD/MM, HH:mm`).
- **Native App Experience (iOS & Android)**
  - Mendukung instalasi *Add to Home Screen* dengan *Splash Screen* 1 lapis murni bawaan sistem (`apple-touch-startup-image` di iOS & WebAPK di Android) disertai transisi masuk *smooth fade-in* CSS murni dan berjalan penuh offline (*Service Worker*).
  - Optimasi *safe-area* atas & bawah anti-balok hitam untuk iPhone, input `16px` anti-zoom di iOS Safari, toast notification 3-varian, serta *haptic feedback* di Android.

---

## Struktur Proyek

```text
diloc-editor/
├── index.html                  # Struktur antarmuka utama & gaya tampilan
├── package.json                # Konfigurasi dependensi & skrip Vite
├── vite.config.js              # Konfigurasi build Vite (base: './')
├── AI_RULES.md                 # Panduan standar pengembangan & versioning
├── CHANGELOG.md                # Riwayat pembaruan setiap rilis versi
└── public/
    ├── app.js                  # Logika utama editor, parser .json/.pmr, toast & modal
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
        ├── operator1.json      # Skema parameter Operator 1 (167 sel)
        ├── operator2.json      # Skema parameter Operator 2 (51 sel)
        └── operator3.json      # Skema parameter Operator 3 (45 sel)
```

---

## Instalasi & Pengembangan Lokal

Pastikan **Node.js** sudah terpasang di perangkat kamu, lalu jalankan perintah berikut:

```bash
# 1. Clone repository
git clone https://github.com/crocolatozz/diloc-editor.git
cd diloc-editor

# 2. Install dependensi
npm install

# 3. Jalankan server development
npm run dev

# 4. Build untuk produksi (hasil di folder dist/)
npm run build
```

---

## Alur Penggunaan Singkat

1. **Pilih Operator** (`Operator 1`, `2`, atau `3`) atau **Import** file `.json` (*DILOC Automator*) / `.pmr` (*PyMacroRecord*).
2. **Input Data Lapangan** secara berurutan menggunakan tombol *Next* pada keyboard atau gunakan kolom **Cari Tag / Equipment** untuk melompat ke parameter tertentu.
3. Pastikan parameter terisi dengan mengecek indikator progres (`Terisi: X / Y Cell`) atau tombol **Sel Kosong**.
4. Pilih format output (**`DILOC Automator (.json)`** sebagai default atau **`Macro PMR (.pmr)`**), lalu klik **Export** untuk mengunduh atau **Share** untuk mengirim langsung ke PC ruang kontrol.

---

## Riwayat Perubahan

Seluruh catatan pembaruan versi tercatat secara terstruktur di file [`CHANGELOG.md`](./CHANGELOG.md).

---

© 2026 — Developed by **FIKRI**