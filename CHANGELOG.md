# Changelog — PMR Editor

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
