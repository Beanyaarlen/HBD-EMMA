# Usagi Birthday Surprise

Website ulang tahun satu halaman yang siap dipasang di GitHub Pages. Tombol **Buka Surat** akan menjalankan animasi kejutan: amplop bergerak, 18 gambar Usagi transparan meledak dari tombol, lalu surat terbuka. Semua Usagi akan memantul, berputar, dan menghilang perlahan bersama confetti.

## Personalisasi

### Nama

Buka `script.js`, lalu ubah bagian ini:

```js
const CONFIG = {
  name: 'Sayang',
  letterName: 'Sayang',
};
```

### Isi ucapan

Ubah teks di dalam bagian `<article class="letter-card">` pada `index.html`. Tombol **Ulangi Kejutan!** sudah ditempatkan di bagian bawah surat.

### Musik

Lagu Usagi sudah disertakan sebagai:

```text
assets/birthday-song.mp3
```

Lagu diputar menggunakan tombol musik di kanan atas dan otomatis mengulang dari awal setelah selesai. Jika file tersebut dihapus atau tidak tersedia, tombol musik memakai melodi sintetis singkat yang original.

## Menjalankan di komputer

Cukup buka `index.html` di browser. Tidak ada instalasi atau proses build.

## Publish ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `birthday-usagi`.
2. Upload seluruh isi folder ini ke repository tersebut.
3. Buka **Settings → Pages**.
4. Pada **Source**, pilih **Deploy from a branch**.
5. Pilih branch `main`, folder `/ (root)`, lalu klik **Save**.
6. Tunggu sampai GitHub menampilkan URL website.

## Catatan

- Semua aset Usagi transparan berada di folder `assets/` dengan nama `usagi-01.png` sampai `usagi-18.png`.
- Animasi menyesuaikan layar desktop maupun ponsel.
- Pengguna yang mengaktifkan *reduced motion* akan melihat semua Usagi muncul sebagai kolase tanpa efek pantulan.
- Halaman ini merupakan karya fan-made. Pastikan gambar dan musik yang dipakai sesuai dengan izin penggunaan yang kamu miliki.
