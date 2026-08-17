# 🇮🇩 DIRGAHAYU REPUBLIK INDONESIA — HUT RI KE-81
### *"Indonesia Berdaulat, Adil, dan Makmur"*

> **Sebuah pengalaman web sinematik 3D** untuk merayakan 81 Tahun Kemerdekaan Indonesia.
> Dibangun dengan React, GSAP, Framer Motion, Three.js, dan Firebase — menghadirkan perjalanan visual dari proklamasi hingga suara rakyat masa kini.

---

## live 
https://birthday-ri81mzky.vercel.app/

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.1-FF0055?style=for-the-badge&logo=framer)
![Three.js](https://img.shields.io/badge/Three.js-0.185-000000?style=for-the-badge&logo=threedotjs)
![Firebase](https://img.shields.io/badge/Firebase-12.17-FFCA28?style=for-the-badge&logo=firebase)

</div>

---

## ✨ Fitur Utama

### 🎬 Scene 1 — Intro Sinematik
- **Frame-by-frame animation** — 311 frame PNG dirender di HTML Canvas (60fps) untuk efek sinematik seperti film
- **3D Flag** — Bendera merah putih 3D murni CSS dengan animasi berkibar realistis + tiang emas berkilau
- **Parallax flag bearer** — Foto pembawa bendera dengan efek parallax berdasarkan gerakan mouse
- **Fireworks effect** — Kembang api meledak otomatis saat scene terbuka
- **Typewriter text** — Teks muncul huruf per huruf dengan animasi ketik profesional
- **Background audio** — Musik latar otomatis dengan kontrol mute/unmute

### 🌀 Scene 2 — Portal Kemerdekaan
- **3D Portal ring** — Cincin portal holografik berputar dengan efek preserve-3d
- **Energy particles** — 12 partikel energi mengorbit portal dengan animasi CSS keyframes
- **Countdown timer** — Hitung mundur real-time menuju 17 Agustus 2026
- **Mouse 3D tilt** — Seluruh portal merespons gerakan mouse secara 3D interaktif
- **Shine sweep effect** — Efek cahaya menyapu permukaan portal secara berkala

### 🏛️ Scene 3 — Proklamasi & Makna
- **Scroll-driven typewriter** — Teks DIRGAHAYU mengetik ulang setiap kali elemen scroll masuk layar
- **useInView scroll reveal** — Setiap section muncul dengan animasi: fade+zoom, slide kiri/kanan
- **3D tilt card** — Kartu Proklamasi, Berdaulat, Adil, Makmur merespons posisi mouse real-time
- **Chat bubble 3D** — Pesan tokoh bangsa tampil sebagai bubble holografik dengan kedalaman Z
- **Holographic card** — Efek shine melintas di kartu Proklamasi + floating animation
- **Parallax background** — Foto pembawa bendera kiri-kanan dengan parallax berbeda
- **Audio backsound** — Musik nasional diputar otomatis di scene ini

### 💬 Scene 4 — Ruang Aspirasi Rakyat
- **Firebase Firestore real-time** — Semua pesan pengunjung tersinkronisasi langsung tanpa reload
- **Google OAuth login** — Login aman dengan akun Google (1 akun = 1 pesan)
- **Anti-spam** — Setiap UID Google hanya bisa kirim 1 pesan selamanya
- **3D message wall** — Pesan tampil sebagai kartu 3D dengan animasi spring
- **Tidak ada batas teks** — Pengunjung bebas menulis pesan sepanjang apapun
- **Data unlimited** — Semua pesan tersimpan permanen di Firestore tanpa limit
- **Meteor shower** — Efek hujan meteor CSS di background
- **Confetti** — Konfeti terus turun merayakan kemerdekaan
- **Video loop background** — scene4.mp4 loop otomatis sebagai background sinematik

---

## 🏗️ Arsitektur — 5-Layer Cinematic Engine

```
App.jsx
├── Layer 1: CinematicOverlay     → CSS gradient + vignette warna per scene
├── Layer 2: FramePlayer          → HTML Canvas 311-frame cinematic player
│                                    + Video loop Scene 4 (scene4.mp4)
├── Layer 3: ParticleEngine       → Three.js partikel merah-putih
├── Layer 4: ConfettiBlast        → canvas-confetti terus-menerus
└── Layer 5: Scene UI (React)
    ├── Scene1Intro.jsx           → Intro + 3D flag + parallax
    ├── Scene2Portal.jsx          → Portal holografik + countdown
    ├── Scene3Flag.jsx            → Proklamasi + scroll reveal + chat 3D
    └── Scene4Messages.jsx        → Aspirasi rakyat + Firebase real-time
```

---

## 🛠️ Tech Stack

| Teknologi | Versi | Kegunaan |
|---|---|---|
| **React** | 19.2 | UI framework utama |
| **GSAP** | 3.15 | Transisi scene, animasi masuk, timeline |
| **Framer Motion** | 13.1 | whileInView, useInView, spring animation, 3D tilt |
| **Three.js** | 0.185 | Partikel 3D merah-putih di background |
| **@react-three/fiber** | 9.7 | React wrapper untuk Three.js |
| **@react-three/drei** | 10.7 | Helpers Three.js |
| **Firebase** | 12.17 | Firestore real-time database + Google Auth |
| **canvas-confetti** | 1.9 | Efek konfeti dan kembang api |
| **HTML Canvas** | — | Frame-by-frame cinematic animation player |

---

## 📁 Struktur Folder

```
src/
├── App.jsx                    # Root app, scene routing, 5-layer engine
├── background/
│   ├── FramePlayer.jsx        # HTML Canvas 311-frame player + video Scene 4
│   └── CinematicOverlay.jsx   # CSS color grade & vignette per scene
├── scenes/
│   ├── Scene1Intro.jsx        # Scene 1: Intro sinematik
│   ├── Scene2Portal.jsx       # Scene 2: Portal holografik
│   ├── Scene3Flag.jsx         # Scene 3: Proklamasi & makna kemerdekaan
│   └── Scene4Messages.jsx     # Scene 4: Aspirasi rakyat Indonesia
├── effects/
│   ├── ConfettiBlast.jsx      # Konfeti terus-menerus
│   ├── Fireworks.js           # Efek kembang api (canvas-confetti)
│   ├── FloatingMessageWall.jsx# Dinding pesan mengambang
│   └── ParticleEngine.jsx     # Partikel Three.js merah-putih
├── firebase/
│   ├── config.js              # Konfigurasi Firebase
│   ├── authService.js         # Google OAuth login/logout
│   └── messagesService.js     # Firestore CRUD + real-time listener
├── hooks/
│   ├── useAuth.js             # Hook state autentikasi
│   └── useMessages.js         # Hook subscribe pesan real-time
├── utils/
│   ├── audio.js               # Load & play backsound
│   └── gsapAnimations.js      # Helper GSAP animateSceneIn
├── index.js
└── index.css
```

---

## 🚀 Cara Install & Jalankan

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install & Run

```bash
# Clone repository
git clone https://github.com/mzkyzak/Website-3D-ID.git
cd Website-3D-ID

# Install dependencies
npm install

# Jalankan di localhost
npm start
```

### Build Produksi

```bash
npm run build
```

---

### 3. Firestore Security Rules
Buka Firebase Console → Firestore → Rules dan paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.auth != null
                   && request.resource.data.name is string
                   && request.resource.data.name.size() > 0
                   && request.resource.data.message is string
                   && request.resource.data.message.size() > 0
                   && request.resource.data.uid == request.auth.uid
                   && request.resource.data.createdAt != null;
      allow update, delete: if false;
    }
  }
}
```

---

## 💾 Keamanan & Skalabilitas Data

| Aspek | Detail |
|---|---|
| **Autentikasi** | Google OAuth — identitas terverifikasi |
| **Anti-spam** | 1 UID Google = 1 pesan selamanya |
| **Keamanan** | Firestore Security Rules mencegah edit/hapus |
| **Skalabilitas** | Firebase auto-scale — tidak ada batas dokumen |
| **Durabilitas** | Data direplikasi ke 3+ Google datacenter |
| **Real-time** | WebSocket — sinkron kurang dari 1 detik ke semua pengunjung |
| **Uptime** | 99.999% SLA Google |

---

## 🌟 Harapan untuk Indonesia

> *"Pemrograman menggunakan React bukan sekadar menulis kode, tetapi menciptakan solusi, membangun website 3D, dan menghadirkan perubahan bagi Indonesia."*

Website ini dibuat sebagai bentuk cinta dan doa untuk Indonesia di hari kemerdekaan ke-81.
Semoga Indonesia terus **Berdaulat, Adil, dan Makmur** — dan generasi muda terus berkarya membangun bangsa melalui teknologi. 🇮🇩

---

## 👨‍💻 Developer

**Taufiq Ikhsan Muzaky** — Mzkyzak
*SMK · Pemrograman · Indonesia*

---

<div align="center">

**🇮🇩 DIRGAHAYU REPUBLIK INDONESIA KE-81 🇮🇩**

*17 Agustus 1945 — 17 Agustus 2026*

</div>
