# HabitPulse

> **Track Your Activity. Build Better Habits.**

HabitPulse adalah aplikasi web **Health & Productivity Tracker** modern, minimalis, dan berkinerja tinggi yang dirancang untuk membantu pengguna mencatat, memonitor, mengelola, serta menganalisis aktivitas olahraga dan kebiasaan sehat harian secara fleksibel tanpa perlu registrasi akun atau koneksi server pihak ketiga.

---

## 📌 Tentang HabitPulse

HabitPulse mengusung filosofi *Privacy-First* dan *Zero Friction*. Pengguna dapat langsung membuka aplikasi dan mencatat 4 jenis aktivitas olahraga utama:

- 🏃 **Lari (Running)**: Lacak jarak tempuh (KM/Miles), durasi, pace rata-rata, dan estimasi kalori terbakar.
- 🚴 **Bersepeda (Cycling)**: Pantau durasi gowes dan jarak jelajah rute harian.
- 🚶 **Jalan Kaki (Walking)**: Monitor jalan santai harian untuk menjaga mobilitas & kebugaran jantung.
- 🏋️ **Workout (Gym / Fitness)**: Catat sesi latihan fisik, strength training, core workout, dan energi yang dikeluarkan.

### Tujuan & Manfaat Aplikasi
1. **Membangun Konsistensi Habit**: Membantu pengguna mempertahankan *Streak* harian beruntun aktif berolahraga.
2. **Evaluasi Progres Real-Time**: Memberikan statistik komprehensif, grafik tren mingguan, dan target mingguan yang dapat disesuaikan.
3. **Privasi 100% Terjaga**: Seluruh data tersimpan aman secara lokal di peramban (LocalStorage) pengguna.

---

## ⚡ Fitur Utama

- 📊 **Personal User Dashboard**:
  - Greeting kontekstual dinamis berdasarkan waktu perangkat (*Good Morning / Afternoon / Evening*).
  - 4 Kartu Ringkasan Metrik (*Total Activities, Total Distance, Active Time, Calories Burned*).
  - Kartu Progress Target Mingguan (*Weekly Goals*) dengan 3 progress bar dinamis (*Activities, Active Minutes, Distance*).
  - Category Breakdown Grid untuk 4 olahraga dengan visual persentase.
  - Recent Activities Feed dengan tombol filter cepat.

- 📝 **Full Activity CRUD Management**:
  - Modal formulir tambah & edit aktivitas yang user-friendly.
  - Auto-Calorie Estimator berbasis jenis olahraga, durasi, jarak, dan intensitas (*Light, Moderate, Intense*).
  - Keterangan Disklamer Kalori medis yang jelas.
  - Modal Konfirmasi Hapus UI (*Custom Glassmorphic Delete Modal*) menggantikan dialog bawaan browser.

- 🔍 **Activity History & Multi-Criteria Filtering**:
  - Pencarian teks kata kunci *real-time* mencakup judul dan catatan aktivitas.
  - Filter Kategori (*Semua, Lari, Bersepeda, Jalan Kaki, Workout*).
  - Filter Rentang Waktu (*Semua Waktu, Minggu Ini, Bulan Ini*).
  - Sorting (*Terbaru, Terlama, Durasi Terpanjang, Jarak Terjauh, Kalori Terbanyak*).
  - Modal View Detail Aktivitas (*Activity Detail View Modal UI*).
  - Counter Jumlah Hasil (*Result Counter Badge*) & Tampilan *Empty Filter State*.

- 📈 **Statistics & Progress Analytics**:
  - 8 Indikator Metrik Utama (*Total Activities, Total Distance, Total Active Time, Estimated Calories, Average Duration, Most Active Sport, Current Streak, Best Streak*).
  - Perbandingan Mingguan (*This Week vs. Last Week*) dengan indikator delta.
  - Interactive SVG Bar Chart (Menit aktif harian Senin–Minggu dengan hover tooltip).
  - Chart Distribusi Kategori Olahraga.
  - Automated Smart Habit Insights berbasis data riil.

- 🎯 **Weekly Goals & Milestone Achievements**:
  - Pengaturan target kustom mingguan (*Target Activities, Active Minutes, Distance*).
  - Sistem Lencana Pencapaian Dinamis (*First Activity, 5 Activities, 10 Activities, First 10 KM, 7 Day Streak*).
  - Real-Time Activity Streak Calculator yang aman dari kendala timezone.
  - Motivational Banner dengan pesan dorongan dinamis.

- ⚙️ **Settings & Pengelolaan Data**:
  - Pengaturan Tema Tampilan (*Light Mode, Dark Mode, System Default*) dengan Anti-FOUC engine.
  - Konversi Satuan Pengukuran Jarak (*Kilometer* ↔ *Miles*).
  - **Export Data Backup (JSON)**: Unduh seluruh data aplikasi ke file `.json`.
  - **Import Data Backup (JSON)**: Upload dan validasi file cadangan untuk memulihkan data.
  - **Clear All Data**: Hapus seluruh data dengan modal konfirmasi destruktif yang aman.

- 📱 **Responsive UI & Mobile Bottom Navigation**:
  - Layout adaptif teruji untuk Mobile (320px–430px), Tablet (768px–820px), Laptop (1024px–1280px), dan Desktop (1440px+).
  - Modern Mobile Bottom Navigation Bar (< 768px) dengan efek glassmorphism blur.
  - Ukuran target sentuh minimal >= 44px untuk kenyamanan perangkat layar sentuh.

---

## 🛠️ Technology Stack

- **Frontend Core**: HTML5 Semantis, CSS3 Vanilla (Custom Properties, Glassmorphism, CSS Grid, Flexbox, SVG Styling).
- **Logic & Architecture**: Vanilla JavaScript ES6+ (Modul ES Native tanpa framework seperti React/Vue/Angular).
- **Build Tooling**: Vite.js v5.4+.
- **Penyimpanan Data**: LocalStorage API bawaan browser dengan penanganan kesalahan defensif.
- **Visualisasi Chart**: Pure SVG & CSS Layout (ringan, tanpa dependensi pustaka grafik berat).
- **Version Control**: Git & GitHub.
- **Production Deployment**: Vercel.

---

## 📁 Struktur Project

```text
habitpulse-app/
├── index.html                  # HTML5 Master Entry Page
├── package.json                # Project Dependencies & Build Scripts
├── vite.config.js              # Vite Build Configuration
├── public/
│   ├── favicon.svg             # Vector SVG Favicon Icon
│   ├── logo.svg                # Primary Vector Logo
│   ├── logo-full.svg           # Full Brand Logo with Typography
│   ├── logo-mark.svg           # Symbol Mark Icon
│   ├── robots.txt              # Search Engine Crawling Directive
│   └── sitemap.xml             # XML Site Structure Map
└── src/
    ├── style.css               # CSS Main Imports Engine
    ├── main.js                 # App Entry Point & Controller Initializer
    ├── js/
    │   ├── activities.js       # Activity Data Store & Query Engine
    │   ├── analytics.js        # Analytics & SVG Chart Renderer
    │   ├── achievements.js     # Goal & Achievement Badge Controller
    │   ├── dashboard.js        # Dashboard UI Controller & Event Handlers
    │   ├── history.js          # Activity History & Multi-Filter Controller
    │   ├── icons.js            # Vector SVG Icons System
    │   ├── landing.js          # Landing Page & Scroll Reveal Observer
    │   ├── settings.js         # App Settings & JSON Import/Export Controller
    │   ├── statistics.js       # Analytics, Streak & Insights Calculator
    │   ├── storage.js          # LocalStorage Wrapper Engine
    │   ├── theme.js            # Light/Dark/System Theme Engine
    │   ├── utils.js            # Formatting, Calorie & Pace Utilities
    │   └── validation.js       # Form Validation & Sanitization Engine
    └── styles/
        ├── variables.css       # Design System Tokens & Color Palette
        ├── reset.css           # Modern CSS Reset
        ├── layout.css          # Core Grid & Flex Containers
        ├── components.css      # Buttons, Badges, Cards & Modals
        ├── landing.css         # Landing Page Section Styles
        ├── dashboard.css       # Dashboard, History & Analytics Styles
        └── responsive.css      # Viewport Media Queries & Mobile Bottom Nav
```

---

## 🚀 Cara Menjalankan Project

### Prerequisites
Pastikan **Node.js** (v18.0.0 atau lebih baru) dan **npm** telah terinstal di perangkat Anda.

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/username/habitpulse-app.git
cd habitpulse-app
npm install
```

### 2. Jalankan Mode Development Server
```bash
npm run dev
```
Buka peramban dan akses `http://localhost:5173`.

### 3. Build untuk Mode Produksi
```bash
npm run build
```

### 4. Preview Build Produksi Secara Lokal
```bash
npm run preview
```

---

## 🌐 Production Deployment (Vercel Integration)

Aplikasi ini siap di-deploy ke **Vercel Production**:

### Langkah Deployment ke Vercel:

1. **Commit & Push ke GitHub**:
   ```bash
   git status
   git add .
   git commit -m "Complete HabitPulse health tracker"
   git push origin main
   ```

2. **Deploy di Vercel Dashboard**:
   - Login ke akun [Vercel](https://vercel.com).
   - Klik tombol **"Add New" ➔ "Project"**.
   - Import repository GitHub `habitpulse-app`.
   - Konfirmasi pengaturan project:
     - **Framework Preset**: `Vite`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Klik **"Deploy"**.

3. **Continuous Deployment (CI/CD)**:
   - Setiap push berikutnya ke branch `main` GitHub akan secara otomatis memicu build dan update deployment terbaru melalui integrasi Vercel CI/CD.

---

## 🤖 AI-Assisted Development

Proyek **HabitPulse** dikembangkan dengan bantuan **AI Development Agent**.

- **AI Tool**: Antigravity dengan model **Gemini Flash 3.6**.
- **Peran & Kontribusi AI Agent**:
  - Membantu perencanaan arsitektur modul JavaScript dan penyusunan struktur folder.
  - Mempercepat penulisan kode HTML5 semantis, CSS3 modern, dan fungsi JavaScript ES6+.
  - Membantu proses refactoring, sanitasi keamanan XSS, dan penanganan kesalahan LocalStorage.
  - Membantu penyusunan media queries responsive design dari 320px hingga 1440px+.
  - Membantu code review dan dokumentasi teknis.

*Catatan: AI digunakan sebagai asisten pengembang (development assistant). Seluruh keputusan fitur, pengujian alur kerja, validasi logika, dan evaluasi kualitas akhir tetap merupakan bagian dari proses developer.*

---

## 💾 Data Storage

HabitPulse menggunakan API **LocalStorage** bawaan browser peramban pengguna:
- **Penyimpanan Lokal**: Seluruh data aktivitas tersimpan secara pribadi di perangkat pengguna.
- **Tanpa Sinkronisasi Otomatis**: Data tidak tersinkronisasi otomatis antar peramban atau perangkat berbeda.
- **Pembersihan Cache**: Menghapus data peramban (*Clear Browser Data*) dapat menghapus data aplikasi.
- **Export / Import JSON**: Pengguna dapat menggunakan fitur *Export Backup (JSON)* pada halaman Settings untuk mencadangkan data dan fitur *Import Backup (JSON)* untuk memulihkan data secara manual.

---

## 🔮 Future Development Plan

Beberapa potensi pengembangan fitur di masa mendatang:
- [ ] **Authentication**: Login pengguna berbasis OAuth / Email.
- [ ] **Cloud Database**: Sinkronisasi data antar-perangkat via Cloud Store (Firebase / Supabase).
- [ ] **Progressive Web App (PWA)**: Dukungan instalasi offline sebagai aplikasi native mobile/desktop.
- [ ] **Wearable Integration**: Integrasi API perangkat smartwatch (Garmin, Strava, Apple Health).

---

## ⚠️ Disclaimer

> **PENTING**: HabitPulse **bukan** merupakan perangkat medis atau aplikasi diagnosis kesehatan. Informasi seperti estimasi kalori terbakar (*Estimated Calories*) dan kalkulasi pace merupakan angka perkiraan untuk melacak latihan kebugaran umum, bukan data medis akurat. Konsultasikan dengan tenaga medis profesional untuk evaluasi kesehatan medis Anda.
