# AI_RULES.md — Panduan Pengembangan PMR Editor

Dokumen ini adalah aturan wajib bagi AI setiap kali memodifikasi, memperbaiki bug, atau menambahkan fitur pada repositori **PMR Editor** (`crocolatozz/pmr-editor`).

---

## 1. Alur Kerja & Penomoran Versi (SemVer)
- **Konfirmasi Sebelum Eksekusi:** Jabarkan ringkasan rencana perubahan dan target nomor versi terlebih dahulu sebelum memodifikasi file proyek.
- **Standar Semantic Versioning (`MAJOR.MINOR.PATCH`):**
  - **MAJOR (`x.0.0`):** Perubahan arsitektur besar atau perubahan format struktur data `.pmr`/`.json`.
  - **MINOR (`1.x.0`):** Penambahan fitur baru atau peningkatan UI/UX tanpa merusak kompatibilitas data.
  - **PATCH (`1.8.x`):** Perbaikan bug, penyesuaian CSS/layout, atau optimalisasi performa minor.

---

## 2. Aturan Sinkronisasi Versi (WAJIB SERENTAK)
Setiap kali nomor versi naik, AI **WAJIB** memperbarui nomor versi secara identik di **seluruh 7 file berikut** tanpa terkecuali:
1. `package.json` — properti `"version"`
2. `index.html` — teks pil/badge versi di header (serta meta/title jika mencantumkan versi)
3. `public/app.js` — konstanta `APP_VERSION` dan fallback highlights versi terbaru
4. `public/sw.js` — konstanta `CACHE_NAME` (misal `pmr-editor-v1.9.0`) serta memastikan aset baru terdaftar di `CORE_ASSETS`
5. `public/version.json` — objek `{"version": "x.y.z"}` untuk pembanding versi sekunder anti-cache
6. `README.md` — keterangan versi saat ini dan ringkasan fitur utama terbaru
7. `CHANGELOG.md` — entri versi terbaru di bagian paling atas dengan format `## [vX.Y.Z] - YYYY-MM-DD`

---

## 3. Standar Visual, Animasi & Native App Feel
- **Identitas Desain:** Pertahankan palet warna *deep slate* (`#0f172a`), tipografi bawaan aplikasi, serta credit footer low-key wajib: `© 2026 — Developed by FIKRI`.
- **Nol Karakter Emoji (Wajib Inline SVG):** Dilarang keras memakai karakter emoji di HTML, CSS, maupun JS. Seluruh ikon wajib menggunakan **inline SVG berwarna kontekstual** (`currentColor` atau warna status semantik).
- **Nol Dialog Bawaan Browser:** Dilarang memanggil `window.alert()`, `window.confirm()`, atau `window.prompt()`.
  - Feedback cepat (sukses, peringatan ringan, error) wajib memakai **Toast Notification 3-Varian** (Success hijau, Warning amber, Error merah) dengan *smart replace* (tidak menumpuk) dan *tap-to-dismiss*.
  - Konfirmasi tindakan penting (reset, lepas file, timpa draft import, export dengan sel kosong) wajib memakai **Custom Modal** aplikasi.
- **Animasi & Transisi Anti-Flicker:**
  - Gunakan kurva transisi halus (*spring / cubic-bezier*) untuk modal, toast, perpindahan tab, dan efek tekan tombol (`scale(0.97)`).
  - Terapkan *fade-in* halus saat aplikasi dibuka serta *fade-out* (maksimal `300ms`, disertai pemulihan `opacity: 1` pada event `pageshow`) sebelum `location.reload()` pasca-update agar bebas kedip layar (*flicker*).

---

## 4. Pagar Teknis Logsheet, PWA & Safari iOS
- **Integritas Data DILOC Urea 1B:** Jangan mengubah skema JSON/PMR (`events`, koordinat, delay, tipe aksi), logika konversi desimal, maupun dataset operator (`operator1.json`, `operator2.json`, `operator3.json`) kecuali diminta eksplisit.
- **Proteksi Safe-Area & Sticky Toolbar iOS:**
  - Pertahankan dukungan `viewport-fit=cover`, perisai *status bar* atas (`body::before`), dan sinkronisasi jarak atas melalui variabel CSS terpadu agar baris tabel tidak tembus di belakang *Dynamic Island* / *notch* saat di-scroll.
  - **Dilarang** memasang properti CSS `transform` permanen pada elemen induk *sticky toolbar* karena merusak `position: sticky` di Safari iOS.
- **Aturan User-Gesture Safari iOS:** Pemanggilan `fileInput.click()` harus dijalankan secara sinkron saat tombol *Import* diklik agar tidak diblokir browser iOS; dialog konfirmasi timpa draft dimunculkan setelah file dipilih di event `onchange`.
- **Kompatibilitas Build Vite & Service Worker:**
  - Pertahankan `base: './'` di `vite.config.js` agar build berjalan mulus di GitHub Pages.
  - Pertahankan registrasi SW dengan `{ updateViaCache: 'none' }`, pengambilan aset inti memakai `cache: 'no-store'`, serta pengaman *timeout* 30 detik pada pengecekan update manual.
  - Jangan menghapus atau mengganti ID elemen DOM yang sudah ada tanpa memperbarui seluruh referensinya di JS/CSS.

---

## 5. Checklist Audit & Format Penutup Respons
Sebelum mengakhiri respons pada setiap pembaruan:
1. Verifikasi sintaks JS (`node --check`) dan pastikan `npm run build` selesai tanpa error.
2. Pastikan **0 emoji**, **0 `alert`/`confirm`**, dan nomor versi di **ketujuh file** sudah 100% sinkron.
3. Sajikan bagian **Audit Potensi Bug/Crash** dan **Kritik & Saran Update Berikutnya** secara ringkas dan kritis.
4. Tutup respons dengan **Changelog versi terbaru di dalam code block** (` ```markdown ... ``` `) agar siap disalin.
