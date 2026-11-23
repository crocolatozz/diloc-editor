# DILOC Editor — Logsheet DILOC Urea 1B

![Version](https://img.shields.io/badge/version-1.12.2-10b981?style=flat-square)
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
  - Mendukung export preset native **`DILOC Automator (.json)`** (`format: "diloc-automator-preset"`, `version: "2.1.2"`) dengan nama `DILOC_OpLap{op}_YYYY-MM-DD_HH-mm.json`, pemetaan `index` 0-based lengkap, `type` (`"number"` / `"text"`), `value` string, dan pelestarian status `checked`.
  - Mendukung export **`Macro PMR (.pmr)`** (`DILOC_OpLap{op}_YYYY-MM-DD_HH-mm.pmr`) dengan kecepatan playback **Normal** terkalibrasi.
- **Sinkronisasi Master Parameter Firestore REST API (`urea1b-project-database`)**
  - Auto-Pull koleksi `diloc_master_parameter` (`oplap_1`, `oplap_2`, `oplap_3`) saat aplikasi online dengan cache `localStorage`, timestamp lokal **`Disinkronkan DD/MM/YY HH:mm`**, penanda `schemaVersion` (`1.12.2`), dan fallback database master bersih bawaan (`167`, `51`, `45` item) yang selalu siap saat offline.
  - Tombol **Push** di modal info versi lengkap dengan dialog konfirmasi dan notifikasi toast 3 tahap untuk mengirim pembaruan master parameter beserta `schemaVersion` ke Firestore.
- **Import Cerdas & Pengisian Fleksibel**
  - Auto-detect file `.json` (`diloc-automator-preset`) dengan perpindahan otomatis ke `opLap` target dan pemetaan berbasis `cell.index`, maupun import ulang file `.pmr` (*PyMacroRecord*).
  - Mendukung input teks bebas pada parameter bertipe `"text"`, pilihan dropdown (`A/B`, `ON/OFF`, `Huruf`) dengan nilai default `"-"` yang dihitung sebagai sel kosong saat validasi & diekspor bersih menjadi `""`, serta filter angka presisi pada parameter numerik (termasuk angka `0`).
- **Control Card, Sticky Toolbar, & Auto-Save Draft (`DD/MM, HH:mm`)**
  - Control Card 2 baris rata kanan di HP portrait (`< 768px`) dan 1 baris horizontal di landscape/tablet/desktop (`>= 768px`) dengan label `Pilih Operator` dan `Format File` yang konsisten tampil, disertai Sticky Toolbar pencarian + indikator status serta strip aksi `Sel Kosong` / `Reset` di atas card tabel.
  - Setiap ketikan dan status `checked` tersimpan otomatis di `localStorage` beserta stempel waktu (`DD/MM, HH:mm`).
- **Native App Experience (iOS & Android)**
  - Mendukung instalasi *Add to Home Screen* dengan *Splash Screen* 1 lapis murni bawaan sistem (`apple-touch-startup-image` di iOS & WebAPK di Android) disertai transisi masuk *smooth fade-in* CSS murni dan berjalan penuh offline (*Service Worker*).
  - Optimasi *safe-area* atas & bawah anti-balok hitam untuk iPhone, input `16px` anti-zoom di iOS Safari, toast notification multi-varian, serta *haptic feedback* di Android.

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
    ├── app.js                  # Logika editor, Firestore REST sync, parser .json/.pmr, toast & modal
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
        ├── operator1.json      # Skema parameter Operator 1
        ├── operator2.json      # Skema parameter Operator 2
        └── operator3.json      # Skema parameter Operator 3
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
2. **Input Data Lapangan** secara berurutan menggunakan tombol *Next* pada keyboard atau gunakan kolom **Cari tag / equipment...** di Sticky Toolbar untuk melompat ke parameter tertentu.
3. Pastikan parameter terisi dengan mengecek indikator progres (`Terisi: X / Y Cell`) atau tombol **Sel Kosong**.
4. Pilih format output (**`DILOC Automator (.json)`** sebagai default atau **`Macro PMR (.pmr)`**), lalu klik **Export** untuk mengunduh file berformat `DILOC_OpLap{op}_YYYY-MM-DD_HH-mm`.

---

## Riwayat Perubahan

Seluruh catatan pembaruan versi tercatat secara terstruktur di file [`CHANGELOG.md`](./CHANGELOG.md).

---

©2026 — Developed by **FIKRI**