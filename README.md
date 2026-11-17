# 📋 PMR Editor — Logsheet DILOC Urea 1B

![Version](https://img.shields.io/badge/version-1.9.0-10b981?style=flat-square)
![Vite](https://img.shields.io/badge/build-Vite-646cff?style=flat-square&logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-0ea5e9?style=flat-square)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-334155?style=flat-square)

Aplikasi web progresif (**PWA**) ringan berbasis **Vite + Vanilla JavaScript** untuk pencatatan dan penyuntingan data parameter *Logsheet* lapangan **Pabrik Urea 1B** secara cepat, akurat, dan *offline-first*, lalu mengekspornya langsung menjadi skrip otomasi **PyMacroRecord (`.pmr`)** maupun format **Web Runner (`.json`)**.

🔗 **Live App:** [https://crocolatozz.github.io/pmr-editor/](https://crocolatozz.github.io/pmr-editor/)

---

## ✨ Fitur Utama

- **Dukungan Multi-Operator Lengkap**
  - **Operator 1:** 167 parameter lapangan
  - **Operator 2:** 51 parameter lapangan
  - **Operator 3:** 45 parameter lapangan
- **⚡ Mode Satset (Fast Input)**
  - Otomatis berpindah ke sel parameter berikutnya setelah nilai diinput, lengkap dengan pengaman tanda titik ganda (`..`) dan tombol *Next* bawaan pada keyboard numerik HP.
- **Import, Export & Direct Share**
  - Mendukung buka/edit ulang file `.pmr` (*PyMacroRecord*) maupun `.json` (*Web Runner*).
  - Ekspor instan dengan penamaan otomatis berbasis tanggal (`Logsheet_operatorX_YYYY-MM-DD.pmr`) serta tombol **Share** langsung ke AirDrop, LocalSend, Files, atau WhatsApp.
- **Auto-Save Draft & Navigasi Cepat**
  - Setiap ketikan tersimpan otomatis di `localStorage` sehingga aman meski browser tertutup.
  - Dilengkapi indikator progres (`Terisi: X / Y Cell`), fitur pencarian Tag/Equipment, dan tombol lompat cepat ke sel yang masih kosong.
- **Native App Experience (iOS & Android)**
  - Mendukung instalasi *Add to Home Screen* dan berjalan penuh tanpa koneksi internet (*Service Worker*).
  - Optimasi *safe-area* untuk *notch / Dynamic Island* iPhone, input `16px` anti-zoom otomatis di iOS Safari, kunci *pull-to-refresh*, serta *haptic feedback* di Android.

---

## 🗂️ Struktur Proyek

```text
pmr-editor/
├── index.html                  # Struktur antarmuka utama & gaya tampilan
├── package.json                # Konfigurasi dependensi & skrip Vite
├── vite.config.js              # Konfigurasi build Vite (base: './')
├── AI_RULES.md                 # Panduan standar pengembangan & versioning
├── CHANGELOG.md                # Riwayat pembaruan setiap rilis versi
└── public/
    ├── app.js                  # Logika utama editor, parser .pmr/.json & modal
    ├── sw.js                   # Service Worker untuk caching offline & auto-update
    ├── manifest.json           # Konfigurasi PWA & ikon multi-platform
    ├── icon.svg                # Master ikon vektor aplikasi
    ├── apple-touch-icon.png    # Ikon khusus iOS Home Screen (180x180)
    ├── icon-192.png            # Ikon standar PWA (192x192)
    ├── icon-512.png            # Ikon standar PWA (512x512)
    ├── icon-maskable-*.png     # Ikon adaptif Android anti-crop
    └── data/
        ├── operator1.json      # Skema parameter & koordinat makro Operator 1
        ├── operator2.json      # Skema parameter & koordinat makro Operator 2
        └── operator3.json      # Skema parameter & koordinat makro Operator 3
```

---

## 🚀 Instalasi & Pengembangan Lokal

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

## 🛠️ Alur Penggunaan Singkat

1. **Pilih Operator** (`Operator 1`, `2`, atau `3`) pada menu kontrol atas.
2. **Input Data Lapangan** secara berurutan (aktifkan **Mode Satset** untuk lompat sel otomatis) atau **Import** file `.pmr`/`.json` yang sudah ada untuk direvisi.
3. Pastikan seluruh parameter terisi dengan mengecek indikator progres atau tombol **Sel Kosong**.
4. Klik **Export** untuk mengunduh file `.pmr` / `.json`, atau klik **Share** untuk mengirim file langsung ke PC ruang kontrol.

---

## 📝 Riwayat Perubahan

Seluruh catatan pembaruan versi tercatat secara terstruktur di file [`CHANGELOG.md`](./CHANGELOG.md).

---

© 2026 — Developed by **FIKRI**