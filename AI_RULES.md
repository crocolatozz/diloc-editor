# Profil & Gaya Komunikasi
- User: Fikri (Operator Pabrik Urea 1B, Petrokimia Gresik).
- Gaya bahasa: Bahasa Indonesia santai, singkat, kritis, to the point, dan gunakan emoji secukupnya. Jangan bertele-tele.

# Aturan Versioning & Workflow (WAJIB DIPATUHI)
1. **Semantic Versioning (`1.x.x`):** Penomoran versi wajib format `1.x.x` (contoh: `1.7.0`). Setiap kali diminta update, jelaskan dulu apakah perubahan tersebut termasuk **Major**, **Minor**, atau **Bug Fix / Patch**, lalu sinkronkan angkanya di `index.html`, `APP_VERSION` (`public/app.js`), `CACHE_NAME` (`public/sw.js`), `package.json`, `CHANGELOG.md`, dan `README.md`.
2. **Pemeliharaan `CHANGELOG.md` (Single Source of Truth):**
   - Setiap ada update atau perubahan kode, WAJIB perbarui file `CHANGELOG.md` di root repository (versi terbaru di paling atas).
   - Gunakan format standar berikut agar mudah dibaca di GitHub sekaligus kompatibel dengan parser pop-up di `public/app.js`:

         ## [v1.x.x] - YYYY-MM-DD (Kategori)
         - Poin perubahan 1 (jelas & ringkas)
         - Poin perubahan 2

   - Pastikan `vite.config.js` menyalin `CHANGELOG.md` ke folder `dist/` saat `vite build` dan `public/sw.js` ikut menyimpannya di `CORE_ASSETS` agar pop-up tetap jalan saat offline.
3. **Hemat Kuota Token:** Jika ada beberapa revisi, kumpulkan dan konfirmasi dulu rencananya sebelum mengeksekusi perubahan kode besar atau generate build baru.
4. **Audit & Kritik Wajib:** Setiap selesai membuat update versi terbaru, wajib cek ulang potensi bug/crash di kode, lalu berikan kritik & saran konkret apa yang bisa di-improve untuk versi berikutnya.
5. **Changelog Wajib dalam Code Block:** Setiap selesai melakukan update atau ada perubahan kode apa pun, wajib sertakan **changelog lengkap di dalam code block** di akhir respons chat agar mudah langsung di-copy paste oleh user ke Gemini.
6. **Footer Credit:** Pertahankan credit low-key di footer dengan format persis:
   `© 2026 — Developed by FIKRI`

# Pagar Teknis Proyek (PMR Editor — Logsheet DILOC Urea 1B)
- Pertahankan arsitektur ringan berbasis Vite + Vanilla JS (`public/app.js` sebagai classic script) tanpa memaksa migrasi ke React/framework berat kecuali diminta eksplisit.
- Jaga `base: './'` di `vite.config.js` agar kompatibel dengan sub-path GitHub Pages.
- DILARANG mengubah struktur data `public/data/operator1.json` (167 param), `operator2.json` (51 param), dan `operator3.json` (45 param), maupun skema output export `.pmr` (PyMacroRecord) dan `.json` (Web Runner).
- Pertahankan standar visual icon SVG berwarna kontekstual (`v1.7.0+`, tanpa emoji mentah di UI) serta dukungan PWA offline (`public/sw.js`, `manifest.json`) dan optimasi layar native iPhone/Android (safe-area notch padding, `body::before` status-bar shield, input `16px` anti-zoom iOS, dan haptic feedback).