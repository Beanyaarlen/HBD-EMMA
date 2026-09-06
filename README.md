# Usagi Birthday Website

Website ulang tahun satu halaman, responsive, dan siap dipasang di GitHub Pages.

## Cara personalisasi

1. Buka `script.js` lalu ubah:
   ```js
   const CONFIG = {
     name: 'Sayang',
     letterName: 'Sayang',
   };
   ```
2. Ubah isi ucapan langsung di `index.html`.
3. Untuk foto, ganti elemen `.photo-placeholder` dengan gambar, contoh:
   ```html
   <img src="assets/photo1.jpg" alt="Foto kita">
   ```
   Lalu tambahkan style `width:100%;aspect-ratio:4/5;object-fit:cover;display:block;`.
4. Untuk musik, masukkan file audio milikmu ke:
   `assets/birthday-song.mp3`

   Jika file tidak ada, tombol musik otomatis memakai melodi sintetis cute yang original.

## Publish ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `birthday-usagi`.
2. Upload semua file dari folder ini ke repository.
3. Masuk ke **Settings → Pages**.
4. Source: **Deploy from a branch**.
5. Pilih branch `main`, folder `/ (root)`, lalu **Save**.
6. GitHub akan memberikan URL website-mu.

## Catatan musik & karakter

Website ini adalah fan-made birthday page. Untuk lagu Chiikawa/Usagi tertentu, gunakan file audio yang memang kamu punya izin/hak untuk gunakan. Template sengaja tidak menyertakan rekaman lagu berhak cipta.
