# Changelog — DILOC Editor

## [v1.12.2] - 2026-11-23 (Bug Fix / Patch)
- **Normalisasi Dropdown Default `"-"` Sebagai Sel Kosong**: Menampilkan opsi default dropdown (`ON/OFF`, `A/B`, `Huruf`) sebagai `"-"` di antarmuka sambil memperlakukan `"-"`, string kosong `""`, dan spasi sebagai sel kosong di balik layar—tidak ikut terhitung pada `Terisi: X / N Cell`, tetap masuk navigasi `Sel Kosong (X)` & validasi sebelum export, dikonversi bersih menjadi `""` (`"checked": false`) saat export `.json` / `.pmr`, serta otomatis kembali ke default `"-"` ketika mengimpor sel bernilai `""` atau `"-"`.
- **Format Stempel Waktu Lokal Sinkronisasi (`Disinkronkan DD/MM/YY HH:mm`)**: Memperbarui tampilan waktu sinkronisasi Firestore pada bagian **Database Master** di Modal Info Versi menjadi format jam lokal 24-jam perangkat (`DD/MM/YY HH:mm`), menyimpan metadata waktu lokal/ISO pada setiap `Auto-Pull` atau `Push` sukses, serta memastikan parser aman terhadap cache lama maupun nilai rusak tanpa menghasilkan `Invalid Date` atau `NaN`.
- **Penanda `schemaVersion` pada Dokumen Master Firestore**: Menyertakan field `schemaVersion: "1.12.2"` saat melakukan `Push` ke `oplap_1`, `oplap_2`, dan `oplap_3`, serta memvalidasi keberadaan dan kesesuaian `schemaVersion` (`>= 1.12.2`) beserta jumlah tepat `167 / 51 / 45` item pada `Auto-Pull` agar dokumen lama di cloud tidak menimpa database master lokal yang bersih.
- **Pembaruan Versi & Cache PWA**: Menaikkan versi ke `v1.12.2` di UI, `manifest.json`, `package.json`, `version.json`, `README.md`, `CHANGELOG.md`, dan cache Service Worker `diloc-editor-v1.12.2`.

---

## [v1.12.1] - 2026-11-23 (Bug Fix / Patch)
- **Label Konsisten & Perapihan Dropdown `Format File` di Layar Sempit**: Menampilkan label **Pilih Operator** dan **Format File** secara konsisten di seluruh ukuran layar (`< 768px` maupun `>= 768px`) dengan perataan bawah tombol `Import` dan `Export` (`106px`) yang sejajar rapi, serta menyetel spasi ikon, panah dropdown, dan kerapatan huruf agar teks `DILOC Automator (.json)` tampil utuh di HP sempit sambil mempertahankan ukuran font kontrol `>= 16px` anti-zoom iOS Safari.
- **Stempel Waktu Sinkronisasi Master Firestore (`Disinkronkan DD/MM HH:mm`)**: Menyimpan waktu sinkronisasi terakhir ke `localStorage` setiap kali `Auto-Pull` atau `Push` ke koleksi `diloc_master_parameter` (`oplap_1`, `oplap_2`, `oplap_3`) berhasil dan menampilkannya di bagian **Database Master** pada Modal Info Versi (atau status jelas bila belum pernah tersinkronisasi).
- **Pembersihan Database Master Lokal & Penguncian Jumlah Op 3 (`45` Item)**: Memperbarui dataset master bawaan untuk **Op Lap 1 (`167` item, indeks `0–166`)**, **Op Lap 2 (`51` item, indeks `0–50`)**, dan **Op Lap 3 (`45` item, indeks `0–44`)** sesuai struktur bersih (`index`, `tag`, `equipment`, `type`, `unit` tanpa `null`), mengunci validasi sinkronisasi & ekspor JSON tepat `167 / 51 / 45` item, serta menyegarkan cache master lokal saat upgrade versi.
- **Pembaruan Versi & Cache PWA**: Menaikkan versi ke `v1.12.1` di UI, `manifest.json`, `package.json`, `version.json`, `README.md`, `CHANGELOG.md`, dan cache Service Worker `diloc-editor-v1.12.1`.

---

## [v1.12.0] - 2026-11-23 (Minor Update)
- **Integrasi Firestore REST API (`urea1b-project-database`)**: Menambahkan Auto-Pull koleksi `diloc_master_parameter` (`oplap_1`, `oplap_2`, `oplap_3`) saat online lengkap dengan cache `localStorage` dan fallback database master lokal, serta baris **Database Master** + tombol pill **Push** (`PATCH` Firestore REST API dengan dialog konfirmasi dan toast 3 tahap) di Modal Info Versi.
- **Pembersihan Fitur Share & Penataan Ulang Tata Letak**: Menghapus total tombol dan fungsi **Share**, menata Control Card menjadi 2 baris rata kanan di HP portrait (`Import` & `Export` sejajar vertikal) dan 1 baris di layar lebar, merapikan Sticky Toolbar (status + pencarian penuh anti-zoom iOS), memindahkan tombol **Sel Kosong** dan **Reset** ke strip aksi atas card tabel, serta memperbesar judul header kolom tabel rata tengah.
- **Format Nama File & Aturan Data Ekspor**: Mengubah format nama file ekspor menjadi `DILOC_OpLap{op}_YYYY-MM-DD_HH-mm.json` / `.pmr`, memastikan seluruh indeks parameter tercetak penuh (sel kosong `"value": ""`, `"checked": false`, input `"0"` valid), dan mempertahankan status `checked` bawaan hasil import sambil menetapkan default `"checked": false` pada input baru pengguna.
- **Pembaruan Versi & Cache PWA**: Menaikkan versi ke `v1.12.0` di UI, `manifest.json`, `package.json`, `version.json`, `README.md`, `CHANGELOG.md`, dan cache Service Worker `diloc-editor-v1.12.0`.

---

## [v1.11.1] - 2026-11-21 (Bug Fix / Patch)
- **Perbaikan Tata Letak Control Card 1 Baris Desktop (`>= 1024px`)**: Mengubah `.controls-bar` pada `@media (min-width: 1024px)` menjadi Flexbox horizontal `nowrap` (`align-items: center; gap: 10px;`) dan meratakan pembungkus `.export-group` dengan `display: contents;` sehingga ke-5 kontrol tampil dalam 1 baris sejajar sempurna dari kiri ke kanan (`Pilih Operator` `190px`, `Cari Tag / Equipment` `flex: 1 1 auto; min-width: 180px`, `Import` `auto`, `Format File` `238px`, dan `Export` `auto`).
- **Kesejajaran Tinggi `42px` & Urutan Cascade CSS**: Menyembunyikan `<label>` kontrol di desktop `>= 1024px`, menyamakan tinggi `height: 42px; box-sizing: border-box;` pada seluruh 5 kontrol tanpa memotong teks `DILOC Automator (.json)`, serta mempertahankan aturan `@media (min-width: 1024px)` di bagian paling bawah stylesheet agar susunan 3 baris di layar mobile/tablet (`< 1024px`) tetap utuh.
- **Sinkronisasi Versi 7 File**: Memperbarui versi ke `1.11.1` pada `package.json`, `index.html`, `public/app.js`, `public/sw.js` (`diloc-editor-v1.11.1`), `public/version.json`, `README.md`, dan `CHANGELOG.md`.

---

## [v1.11.0] - 2026-11-21 (Minor Update)
- **Rebrand Total ke `DILOC Editor` & Kesiapan Rename Repo**: Mengubah identitas aplikasi menjadi `DILOC Editor` di `package.json` (`diloc-editor`), `index.html`, `public/manifest.json`, `public/app.js`, `public/sw.js` (`diloc-editor-v1.11.0`), `public/version.json`, `README.md`, dan `CHANGELOG.md`, dengan tetap menjaga `base: './'` dan key `localStorage` draft lama agar data tersimpan pengguna tidak ter-reset.
- **Pembaruan Icon Header & Icon Dalam Kontrol**: Mengganti icon SVG header kiri atas agar identik dengan ikon utama aplikasi (bingkai emerald `#10b981`, latar `#1e293b`, bar & tanda centang), serta menambahkan icon SVG statis `pointer-events: none` di sisi kiri dalam kontrol `Pilih Operator`, `Cari Tag / Equipment`, dan `Format File` (`padding-left: 36px`).
- **Control Card 1 Baris Desktop (`>= 1024px`) & 3 Baris Mobile/Tablet (`< 1024px`)**: Menyusun 5 kontrol dalam 1 baris sejajar (`height: 42px`, label disembunyikan rapi, `Format File` `min-width: 242px`) khusus browser desktop `>= 1024px`, sambil mempertahankan tata letak 3 baris seimbang pada layar `< 1024px`.
- **Penyelarasan Master Data & Format Native DILOC Automator (`.json`)**: Memperbarui metadata `operator1.json` (`index: 1` `Temp. U-FA122` ke tag `TG-802`, parameter `A/B` & `ON/OFF` bertipe `"text"`) serta `operator2.json`/`operator3.json`, mengizinkan input teks bebas pada sel bertipe `"text"`, menyetel **`DILOC Automator (.json)`** sebagai format default (`DILOC_OpLap{op}_Preset_YYYY-MM-DD.json` v2.1.2 dengan `opLap`, `exportedAt`, `cells` 0-based `index`, `type`, `value` string, dan `checked`), serta memperbarui parser `Import` (`accept=".json,.pmr,..."`) agar otomatis mendeteksi `diloc-automator-preset`, pindah `opLap` bila berbeda, dan memetakan nilai + `checked` berdasarkan `cell.index`.

---

## [v1.10.1] - 2026-11-19 (Bug Fix / Patch)
- **Hapus Splash Screen Lapis Kedua (`#app-splash` & Timer `1.4` Detik)**: Menghapus elemen overlay HTML `#app-splash`, gaya CSS terkait, script deteksi inline, serta logika penahan `1.4` detik / `performance.now()` di `public/app.js` guna menghilangkan *glitch* lompatan ikon saat aplikasi dibuka di iPhone.
- **Splash Screen 1 Lapis Murni Bawaan iOS**: Mempertahankan seluruh 10 tag `<link rel="apple-touch-startup-image">` (`public/splash-*.png`) di `index.html` dan daftarnya di `CORE_ASSETS` (`public/sw.js`) agar sistem iOS menampilkan splash screen secara instan tanpa transisi overlay ganda.
- **Transisi Masuk `Smooth Fade-In` CSS Murni Anti-Bug Safari**: Memperhalus animasi `@keyframes appFadeIn` pada `.app-container` menjadi `380ms` (`cubic-bezier(0.22, 1, 0.36, 1) both`) dengan **hanya properti `opacity`** (tanpa `transform`) agar `position: sticky` toolbar logsheet di Safari iOS tetap presisi, menjaga warna dasar `#0f172a` pada `html` & `body`, serta memastikan event `pageshow` selalu memulihkan `opacity: 1` agar aman dari bug bfcache blank transparan.
- **Sinkronisasi Versi 7 File**: Memperbarui versi ke `1.10.1` secara serentak pada `package.json`, `index.html`, `public/app.js`, `public/sw.js`, `public/version.json`, `README.md`, dan `CHANGELOG.md`.

---

## [v1.10.0] - 2026-11-19 (Minor Update)
- **Hapus Visual Mode Satset & Kunci Kecepatan Normal**: Menghapus kontrol/checkbox `Kecepatan Pengisian / Mode Satset` beserta referensi DOM/event/draft terkait di `index.html` dan `public/app.js`, serta mengunci playback ke kecepatan **Normal** dengan tetap mempertahankan optimasi profil delay & konsistensi struktur timestamp `.pmr`/`.json`.
- **Tata Ulang Grid Control Card Presisi (Semua Viewport)**: Menata ulang `.controls-bar` menjadi 3 baris CSS Grid seimbang di HP kecil, tablet, maupun desktop — Baris 1 (`Pilih Operator` & `Import` tinggi seragam `44px` sejajar bawah), Baris 2 (`Cari Tag / Equipment` full-width `100%`), dan Baris 3 (`Format & Export` seimbang penuh rata kiri-kanan).
- **Timestamp Draft Lengkap (`DD/MM, HH:mm`)**: Memperbarui indikator status penyimpanan otomatis menjadi `Draft tersimpan (DD/MM, HH:mm)` serta menyelaraskan ukuran badge status pada *sticky toolbar* mobile agar tetap sejajar satu baris tanpa wrapping/terpotong di layar sempit.
- **Splash Screen Gaya Samsung (PWA Standalone Only) & Anti-Balok Hitam iOS**: Menambahkan 10 aset static `<link rel="apple-touch-startup-image">` (`public/splash-*.png`) plus *overlay* `#app-splash` (`#0f172a` solid + ikon tengah `min(45vw, 188px)` tanpa teks, tahan minimal `1.4` detik + fade-out `300ms`) khusus iOS standalone dengan isolasi ketat agar tidak tampil di browser biasa maupun menyebabkan *double-splash* di Android WebAPK, sekaligus memperkuat `safe-area-inset-bottom` (`calc(20px + env(safe-area-inset-bottom, 0px))`) dan `min-height: -webkit-fill-available` guna mencegah balok hitam bawah di iPhone.
- **Sinkronisasi Versi & Cache SW**: Memperbarui nomor versi ke `1.10.0` di seluruh 7 file (`package.json`, `index.html`, `public/app.js`, `public/sw.js`, `public/version.json`, `README.md`, `CHANGELOG.md`) dan mendaftarkan seluruh aset `splash-*.png` ke `CORE_ASSETS` di `public/sw.js`.

---

## [v1.9.0] - 2026-11-17 (Minor Update)
- **Toast Notification 3-Varian**: Menambahkan sistem notifikasi toast bergaya Kolase Foto TPM (`Success`, `Warning`, `Error`) dengan SVG inline kontekstual, fitur *smart replace* anti-tumpuk, *tap-to-dismiss*, serta penghapusan total dialog `alert()`/`confirm()` bawaan browser.
- **Pengaman Import & Export Logsheet**: Menambahkan dialog konfirmasi Custom Modal sebelum menimpa draft aktif saat import, counter dinamis sisa sel pada tombol `Sel Kosong (X)`, serta modal peringatan dengan opsi `Tetap Export` dan `Cek Sel Kosong`.
- **Navigasi & Produktivitas Lapangan**: Memastikan input logsheet memakai `enterkeyhint="next"` dengan *smooth scroll* tepat di bawah *sticky toolbar*, tombol *clear* (`×`) pencarian dengan icon SVG, dan tombol melayang *Scroll-to-Top* yang menghormati `safe-area-inset-bottom`.
- **Animasi Native App Feel & Safe-Area iOS**: Merombak transisi modal/toast/tab operator dengan kurva *spring* `cubic-bezier`, efek tekan `scale(0.97)`, *fade-in/fade-out* anti-flicker sebelum reload (timeout maks `300ms` + pemulihan `pageshow` bfcache), serta penyatuan jarak atas iOS ke variabel CSS `--ios-top-clearance`.
- **Changelog Accordion & Deteksi Versi Akurat**: Memuat seluruh riwayat versi dari `CHANGELOG.md` ke dalam mode *accordion* di modal versi, menambah pembanding sekunder `public/version.json` (`cache: 'no-store'`), serta menampilkan titik notifikasi pada pil versi saat update terdeteksi di latar belakang.

---

## [v1.8.1] - 2026-11-17 (Bug Fix / Patch)
- Menambahkan workflow GitHub Actions resmi (`.github/workflows/deploy.yml`) untuk build & auto-deploy ke GitHub Pages setiap push ke branch `main` dengan izin `contents: read`, `pages: write`, dan `id-token: write`.
- Memastikan build Vite memakai `base: './'` dan menginstal dependensi via `npm install` agar CI tidak gagal akibat ketiadaan `package-lock.json`.
- Menambahkan `./CHANGELOG.md` ke `CORE_ASSETS` di `public/sw.js` agar rincian pembaruan di modal versi tetap tersedia saat mode offline.
- Menyinkronkan nomor versi `1.8.1` pada `package.json`, `index.html`, `public/app.js`, `public/sw.js`, `README.md`, dan `CHANGELOG.md`.

---

## [1.8.0] — Minor Update

### Perbaikan Anti-Cache & Auto-Update PWA (`public/sw.js` & `public/app.js`)
- **Bypass HTTP Cache saat Install SW**: Mengganti `cache.addAll()` dengan `fetch(new Request(asset, { cache: 'no-store' }))` per aset memakai `Promise.allSettled` agar kegagalan satu file tidak menggagalkan instalasi Service Worker baru di iPhone PWA & GitHub Pages.
- **Deteksi Update Agresif iOS PWA**: Mendaftarkan Service Worker dengan `{ updateViaCache: 'none' }` dan memicu `reg.update()` pada event `load`, `visibilitychange`, `pageshow` (mengatasi *bfcache* Safari/PWA iOS), dan `online`.
- **Perbaikan Alur `controllerchange`**: Menangani transisi kontroler Service Worker dengan flag `swHadControllerOnBoot` dan `bgUpdatePromptShown` agar instalasi pertama tidak memicu pop-up palsu, sementara pembaruan berikutnya langsung menampilkan kartu update atau reload bersih.

### Fitur Pil Versi Interaktif & Pop-Up Cek Update (`index.html`, `public/app.js`, `vite.config.js`)
- **Pil Versi Interaktif di Header**: Mengubah `.version-badge` (`v1.8.0`) menjadi tombol interaktif (`role="button"`, `tabindex="0"`, efek hover/active, haptic feedback) lengkap dengan icon SVG `refresh-cw` kontekstual.
- **Pop-Up Cek & Perbarui Aplikasi**: Menampilkan versi terpasang, status koneksi, status Service Worker, ringkasan changelog terbaru langsung dari `CHANGELOG.md` (dengan fallback `UPDATE_HIGHLIGHTS`), tombol **"Cek & Perbarui Aplikasi"** dengan spinner anti klik-ganda, status hasil real-time, serta pengaman batas waktu **30 detik**.
- **Sinkronisasi Versi & Build**: Memperbarui versi ke `1.8.0` di `package.json`, `index.html`, `public/app.js`, `public/sw.js`, `README.md`, dan menyalin `CHANGELOG.md` ke folder `dist/` saat build melalui `vite.config.js`.

---

## [1.7.0] — Minor Update (UI / Visual Only)

### Perubahan Visual & UI
- **Sistem Icon SVG Berwarna Kontekstual**: Mengganti seluruh emoji pada `index.html` dan `public/app.js` menjadi inline SVG standar (`fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`) sejajar vertikal (`inline-flex`) dengan ukuran konsisten (`16px`–`18px` tombol/badge, `20px`–`22px` judul/modal).
  - **Judul Header**: Menambahkan wadah *tinted badge* Emerald (`#10b981`) untuk icon logsheet/clipboard ala header card Kolase Foto TPM.
  - **Status & Kecepatan**: Icon petir pada `Mode Satset` dan `Offline Mode` berwarna Amber (`#f59e0b` / `#fbbf24`); icon centang `Draft tersimpan` berwarna Emerald (`#34d399`); icon file/database pada badge `File aktif` berwarna Sky terang (`#7dd3fc`) dengan tombol lepas file (`X`) berwarna Rose (`#fca5a5`).
  - **Tombol Aksi**: Icon mewarisi warna teks/aksen tombol (`currentColor`) — `Reset` Rose (`#fca5a5`), `Share` Sky Blue (`#38bdf8`), `Sel Kosong` mengikuti teks/Emerald saat hover, `Import` Slate terang (`#f8fafc`), dan `Export` gelap kontras (`#0f172a`) di atas tombol Emerald.
  - **Custom Modal & Update Card**: Mengganti icon header modal & bullet list menjadi SVG di dalam *tinted icon box* sesuai varian (`info` = Sky Blue, `success`/`update` = Emerald, `warning` = Amber, `danger` = Rose).
  - **Dropdown `<select>`**: Membersihkan emoji pada opsi format export menjadi `Macro PMR (.pmr)` dan `Web Runner (.json)`, serta penanda nilai tak dikenal menjadi `(!)`.
- **Polish Desain Ala Kolase Foto TPM**: Menghaluskan kedalaman *card*, presisi border, kontras hierarki teks, serta transisi hover tombol tanpa mengubah palet warna utama, font bawaan, layout responsif HP/PC, safe-area notch iPhone, input `16px` anti-zoom iOS, haptic feedback, maupun PWA offline (`public/sw.js`).
- **Sinkronisasi Versi**: Memperbarui versi ke `1.7.0` di `package.json`, `index.html`, `public/app.js`, `public/sw.js`, dan `CHANGELOG.md`.

### Catatan Kompatibilitas
- **Nihil perubahan logika**: seluruh alur kerja, handler `onclick`/event listener, `id`/`name` elemen, parser `.pmr`/`.json`, validasi sel, penyimpanan `localStorage`, data `public/data/operator1..3.json`, dan skema output export tetap 100% identik.

---

## [1.6.3] — Bug Fix / Patch

- Menghapus file duplikat di root yang identik dengan folder `/public/`.
- Mengoptimalkan render tabel 167 parameter (`DocumentFragment`), pencarian (`_searchText`), dan debounce penyimpanan draft `localStorage`.
- Memperbaiki proteksi XSS header tabel, race-condition pindah operator, concurrency modal, error handling file import, serta null-safety parser makro.
