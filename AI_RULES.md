# AI Rules — DILOC Editor

## 1. Identitas & Konteks Aplikasi
- **Nama Aplikasi:** DILOC Editor (Progressive Web App / Web App statis untuk menyusun & mengedit preset logsheet operator pabrik urea).
- **Deployment:** GitHub Pages (terhubung langsung ke repository GitHub; tidak menggunakan fitur publish internal platform).
- **Penyimpanan Data:** Berbasis lokal (`localStorage` / cache browser) tanpa *cloud auto-save* untuk draf pengguna.
- **Credit Footer:** Wajib mempertahankan format `©2026 — Developed by FIKRI`.

## 2. Backend Master Parameter (Firestore REST API)
- **Project ID:** `urea1b-project-database`
- **Collection:** `diloc_master_parameter`
- **Dokumen:** `oplap_1`, `oplap_2`, `oplap_3`
- **Jumlah Parameter Acuan:** Op Lap 1 (`167` item, indeks `0–166`), Op Lap 2 (`51` item, indeks `0–50`), Op Lap 3 (`45` item, indeks `0–44`).
- **Skema Field per Parameter:** `index` (`integerValue`), `tag` (`stringValue`), `equipment` (`stringValue`), `type` (`stringValue`: `number` / `text`), dan `unit` (`stringValue`: `""` jika kosong, dilarang `null`). Status `randomize` tidak disimpan di master database.
- **Prinsip Sinkronisasi:** Selalu pertahankan database master bawaan di kode sebagai *local-first fallback* saat *offline* atau saat dokumen cloud belum tersedia. Lakukan *auto-pull* saat *online* dan simpan ke `localStorage`.

## 3. Aturan Data, Ekspor & Kompatibilitas DILOC Automator
- **Format Nama File Ekspor:** `DILOC_OpLap{op}_YYYY-MM-DD_HH-mm.json` dan `DILOC_OpLap{op}_YYYY-MM-DD_HH-mm.pmr` menggunakan waktu lokal perangkat (tanpa kata `Preset`).
- **Kelengkapan Array `cells` JSON:** Wajib mengekspor seluruh indeks operator (`167` / `51` / `44`), sel kosong bernilai `"value": ""` dan `"checked": false`, serta angka `"0"` tetap diperlakukan sebagai nilai terisi yang valid.
- **Status `checked`:** Input baru bernilai default `false`; nilai `checked` bawaan dari hasil import wajib dipertahankan utuh.

## 4. Standar UI, Responsivitas & Keamanan Kode
- **Breakpoint Responsif:** HP portrait `< 768px` (2 baris terstruktur rapi sesuai spesifikasi) dan layar `>= 768px` (1 baris sejajar). Input pencarian/teks di mobile minimal `16px` agar tidak memicu auto-zoom iOS Safari.
- **Konvensi Penamaan:** Gunakan istilah **DILOC Editor** dan **DILOC Automator** secara konsisten di seluruh kode, komentar, manifest, dan dokumen. Jangan menyisakan nama proyek atau istilah lama yang sudah diganti.
- **Kualitas Kode:** Hindari *hardcoded secrets/API keys* di repository, bungkus panggilan jaringan dengan `try...catch`, cegah *double-click* saat proses *Push*, dan pastikan `z-index` notifikasi *toast* berada di atas modal.
