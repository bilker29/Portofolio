<div align="center">

# 🌐 Billy Wicaksono — Official Web Portfolio
### Modern Interactive Portfolio • 3D ID Card Experience • Full-Stack Developer Showcase

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.15.0-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)

<br/>

[🌟 Live Website](https://billy-wicaksono-website-portofolio.vercel.app/) • [📂 GitHub Repository](https://github.com/bilker29/Portofolio_V5.git) • [📄 Download CV](https://billywicaksono.com/CV%20Billy%20Wicaksono.pdf)

</div>

---

## 📌 Ringkasan Proyek (Overview)

Website portofolio resmi **Billy Wicaksono**, Mahasiswa S1 Teknik Informatika di **Universitas Pasundan** (IPK 3.76/4.00, Penerima Beasiswa Penuh KIP-Kuliah), perwakilan aktif **Google Student Ambassador 2026**, serta bersertifikasi kompetensi **IT Support & Jaringan dari LSP BNSP**.

Dibangun dengan arsitektur modern berbasis **React 18**, **Vite**, dan **Tailwind CSS**, portofolio ini dirancang untuk menyajikan rekayasa perangkat lunak, simulasi infrastruktur jaringan Cisco, sertifikasi profesional, dan galeri aktivitas dalam balutan antarmuka interaktif yang elegan, cepat, dan responsif.

---

## ✨ Fitur Unggulan (Key Features)

### 🪪 1. Interactive 3D Hanging ID Card (Lanyard Parallax)
- **Physics Lanyard Suspension**: Menggantung secara realistis dengan tali lanyard tenun, buckle logam crimp, dan swivel carabiner ring.
- **3D Parallax Tilt**: Kartu merespons pergerakan kursor mouse dan layar sentuh (*gyroscope-style 3D tilt*) dengan sumbu `rotateX` dan `rotateY`.
- **Dynamic Holographic Sheen**: Refleksi cahaya holografik bergerak dinamis di permukaan kartu PVC mengikuti sudut pandang.
- **Interactive 3D Card Flip**: Kartu dapat dibalik (*Front & Back*) secara interaktif dalam ruang 3D 360°, menampilkan barcode terenkripsi, QR Code resmi, detail akademik UNPAS, chip mikroprosesor, serta tanda tangan terverifikasi.
- **Floating Tech Badges**: Badge melayang dengan animasi *gentle float* mengelilingi kartu ID (Java GUI, BNSP, Cisco, GSA 2026).

### ⏳ 2. Dynamic HUD Capsule Loading Screen (1% - 100%)
- Desain kapsul *Dynamic Island HUD* futuristik bernuansa gelap obsidian dengan *dual glow aura* (Sky Blue & Emerald Green).
- Counter persentase numerik animasi dari **1% hingga 100%** dengan easing non-linear yang mulus dan indikator cursor blok `█`.
- Transisi keluar halus menggunakan **Framer Motion** (*blur dissolve & scale expansion*) saat website siap ditampilkan.
- Dukungan opsi *instant skip* dengan klik cepat.

### 🎨 3. Vibrant Modern Glassmorphism Aesthetic
- Palet warna cerah dan profesional dengan mesh gradient gradasi Sky Blue (`#0284c7`), Teal (`#0d9488`), dan Emerald Green (`#059669`).
- Efek *frosted glass* (`backdrop-blur-xl`), border berpendar (*glow pulse*), dan marquee ganda untuk galeri kegiatan.

### 💻 4. Project Showcase & Technical Details
- Menampilkan proyek unggulan seperti sistem desktop **Java GUI & MySQL (PUSTANI)**, perancangan topologi bandara **Cisco Packet Tracer (VLAN, OSPF, DHCP)**, dan aplikasi web responsif.
- Dilengkapi modal detail proyek, tag arsitektur teknologi, serta tautan langsung ke *Live Demo* dan *GitHub Repository*.

### 📜 5. Verified Credentials & Certifications Lightbox
- Pratinjau interaktif sertifikat resmi: **LSP BNSP IT Support**, **TOEIC English Proficiency**, dan penghargaan prestasi nasional Karate.

### 💬 6. Real-time Guestbook & Comments
- Sistem komentar dan interaksi pengunjung langsung yang terhubung ke basis data **Supabase PostgreSQL**.

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18.3](https://react.dev/) | Library UI berbasis komponen performa tinggi |
| **Build Tool** | [Vite 5.4](https://vitejs.dev/) | Bundler generasi baru dengan Hot Module Replacement (HMR) kilat |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Utility-first CSS framework dengan glassmorphism custom |
| **Animations** | [Framer Motion 11](https://www.framer.com/motion/) & [AOS](https://michalsnik.github.io/aos/) | Animasi transisi 3D, physics, dan scroll trigger |
| **Icons & UI** | [Lucide React](https://lucide.dev/) & [MUI](https://mui.com/) | Koleksi ikon vektor modern dan modal preview |
| **Database & Auth** | [Supabase](https://supabase.com/) | Backend PostgreSQL terkelola & Realtime API |
| **SEO & Meta** | [React Helmet Async](https://github.com/staylor/react-helmet-async) | Optimasi Open Graph, Schema.org JSON-LD & meta tag |
| **Hosting & Deployment** | [Vercel](https://vercel.com/) | CDN global dengan pipeline continuous deployment otomatis |

---

## 📁 Struktur Direktori (Project Structure)

```bash
Portofolio/
├── public/                     # Aset statis publik
│   ├── gallery/                # Foto dokumentasi kegiatan & event
│   ├── Photo.jpg               # Foto profil resmi Billy Wicaksono
│   ├── CV Billy Wicaksono.pdf  # Curriculum Vitae resmi
│   └── icons & svgs...         # Vektor teknologi & brand
├── src/
│   ├── assets/                 # Aset internal aplikasi
│   ├── components/             # Komponen UI modular
│   │   ├── IdCard.jsx          # 🪪 Komponen 3D Hanging ID Card & Lanyard
│   │   ├── Navbar.jsx          # Navigasi sticky dengan progress bar scroll
│   │   ├── CardProject.jsx     # Kartu showcase proyek interaktif
│   │   ├── Certificate.jsx     # Komponen sertifikat dengan modal lightbox
│   │   ├── Commentar.jsx       # Formulir komentar Supabase
│   │   ├── Background.jsx      # Animated ambient background mesh
│   │   └── Footer.jsx          # Footer & social channels
│   ├── Pages/                  # Halaman aplikasi
│   │   ├── Home.jsx            # Hero section utama dengan 3D ID Card
│   │   ├── About.jsx           # Biodata, riwayat pendidikan & pengalaman
│   │   ├── Portofolio.jsx      # Katalog proyek & tech stack
│   │   ├── Gallery.jsx         # Dual marquee activity gallery
│   │   ├── Contact.jsx         # Formulir kontak terintegrasi FormSubmit
│   │   └── WelcomeScreen.jsx   # ⏳ Kapsul loading counter HUD (1-100%)
│   ├── utils/                  # Helper utilities (slug generator, helpers)
│   ├── supabase.js             # Konfigurasi Supabase Client
│   ├── index.css               # Styling global, utilitas 3D & custom keyframes
│   ├── App.jsx                 # Root router & layout wrapper
│   └── main.jsx                # Entry point aplikasi React
├── index.html                  # Dokumen HTML utama dengan meta SEO
├── tailwind.config.js          # Konfigurasi kustom tema Tailwind
├── vite.config.js              # Konfigurasi Vite
└── package.json                # Dependensi dan scripts proyek
```

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### 1. Prasyarat
Pastikan sistem Anda telah terpasang:
- [Node.js](https://nodejs.org/) (versi `18.x` atau lebih baru)
- Package manager: `npm` atau `pnpm`

### 2. Kloning Repositori
```bash
git clone https://github.com/bilker29/Portofolio_V5.git
cd Portofolio
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Buat file `.env` di root direktori jika Anda ingin menghubungkan Supabase secara independen:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Menjalankan Server Lokal (Development)
```bash
npm run dev
```
Buka browser pada `http://localhost:5173` untuk melihat tampilan portofolio.

### 6. Membangun Versi Produksi (Build)
```bash
npm run build
```
Hasil build yang dioptimalkan akan tersedia di dalam folder `dist/`.

---

## 📱 Kontrol Interaktif 3D ID Card

- **3D Tilt**: Gerakkan kursor mouse di atas kartu (atau sentuh layar di perangkat seluler) untuk melihat kartu miring mengikuti perspektif ruang 3D.
- **Hologram Shine**: Perhatikan kilau pantulan holografis yang bergeser dinamis melintasi permukaan kartu saat kemiringan berubah.
- **Balik Kartu (Flip)**: Klik kartu di mana saja atau klik tombol **"Balik ID Card"** untuk memutar kartu 180° dan membaca kredensial di sisi belakang.
- **Pendulum Sway**: Saat mouse keluar dari kartu, kartu akan berayun santai mengikuti simulasi gravitasi fisik.

---

## 👤 Kontak & Media Sosial

- **Nama**: Billy Wicaksono
- **Email**: [billywicaksono.999@gmail.com](mailto:billywicaksono.999@gmail.com)
- **LinkedIn**: [linkedin.com/in/billy-wicaksono-315898372](https://www.linkedin.com/in/billy-wicaksono-315898372)
- **GitHub**: [github.com/bilker29](https://github.com/bilker29)
- **Instagram**: [@billy.w.2005](https://www.instagram.com/billy.w.2005)
- **TikTok**: [@gemers2905](https://www.tiktok.com/@gemers2905)

---

<div align="center">
  <p>Dikembangkan dengan ❤️ dan dedikasi tinggi oleh <b>Billy Wicaksono</b></p>
  <p>© 2026 Billy Wicaksono. Hak Cipta Dilindungi Undang-Undang.</p>
</div>
