# NOTO — Marketing Website (Repositori Web)

> Repositori Website Publik & Landing Page resmi platform produktivitas **NOTO — Get Things Done**.

Proyek ini dibangun murni menggunakan **HTML5 semantik, CSS3 responsif, dan Vanilla JavaScript (ES6+)** tanpa framework atau build tools.

---

## 📁 Isi Repositori Ini (`web`)

```
noto-web/
├── index.html        # Landing page (Hero, Fitur, Cara Kerja, Nilai, Harga, FAQ, Footer)
├── styles.css        # Desain editorial responsif & dark mode
├── web.js            # Controller website & koneksi otomatis ke repositori apps
├── vercel.json       # Konfigurasi routing Vercel
├── assets/           # Ikon favicon dan logo
└── README.md
```

---

## ⚠️ CARA UPLOAD KE GITHUB AGAR VERCEL TIDAK 404!

Penyebab utama error **404 NOT_FOUND** di Vercel adalah karena file `index.html` terbungkus di dalam folder `web/`.

**Langkah yang Benar:**
1. Buat repository baru di GitHub bernama **`noto-web`**.
2. Di laptop Anda, buka folder: **`C:\Users\HP\Documents\NOTO\web`**.
3. **MASUK KE DALAM FOLDER `web` TERSEBUT**.
4. Blok / pilih **semua file dan folder yang ada di dalamnya**:
   - `index.html`
   - `styles.css`
   - `web.js`
   - `vercel.json`
   - folder `assets`
5. **Drag & Drop** file-file tersebut ke halaman upload GitHub.
6. Klik **Commit changes**.
   *(Pastikan di halaman GitHub, file `index.html` berada langsung di halaman depan repository, BUKAN di dalam folder `web/`)*.
7. Di Vercel, buat project baru dan import repository `noto-web` tersebut. Vercel akan langsung aktif tanpa 404!

---

## 🔗 Cara Menghubungkan ke Repositori Aplikasi (`noto-apps`)

Di file `web.js`, sistem sudah memiliki **fitur auto-detect**:
* Jika URL web Anda adalah `https://noto-web.vercel.app`, tombol di website akan **otomatis** mengarah ke `https://noto-apps.vercel.app`!
* Jika URL aplikasi Anda berbeda, cukup buka file `web.js` baris ke-9 dan isi alamatnya:
  ```javascript
  const CUSTOM_APP_URL = 'https://alamat-vercel-aplikasi-anda.vercel.app';
  ```
