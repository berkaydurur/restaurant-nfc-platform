# 🚀 Restoran NFC & Menü Platformu - Ücretsiz Yayınlama (Deploy) Rehberi

Bu rehber, geliştirdiğimiz sistemi **%0 maliyetle (tamamen ücretsiz)**, SSL sertifikalı (HTTPS) ve 7/24 çalışır şekilde canlıya almanızı sağlar.

---

## 🏛️ Ücretsiz Mimari Planı

| Katman | Servis | Ücretsiz Özellikleri |
|---|---|---|
| **Frontend (Arayüz)** | **Vercel** veya **Netlify** | Sınırsız bant genişliği, ücretsiz SSL (`https`), özel alan adı desteği |
| **Backend (API)** | **Render.com** | Ücretsiz Node.js Web Servisi, otomatik SSL |
| **Veritabanı** | **Neon.tech** veya **Supabase** | Kalıcı ücretsiz PostgreSQL (0.5GB - 1GB depolama, binlerce restoran ve menüye yeterli) |

---

## 📋 Adım Adım Kurulum Rehberi

### ADIM 1: Ücretsiz Veritabanı Açma (Neon.tech - 1 Dakika)

1. [Neon.tech](https://neon.tech) sitesine gidin ve GitHub hesabınızla ücretsiz üye olun.
2. **"Create Project"** butonuna tıklayın (Örn: `restaurant-nfc-db`).
3. Size verilen **Connection String (PostgreSQL bağlantı adresi)** dizesini kopyalayın:
   ```text
   postgresql://kullanici:sifre@ep-xyz.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

4. Yerel projenizde `backend/prisma/schema.prisma` dosyasındaki ilk bloğu SQLite'tan PostgreSQL'e çevirin:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
5. Terminalde `backend` dizininde yeni veritabanını oluşturun ve örnek verileri yükleyin:
   ```bash
   DATABASE_URL="kopyaladiginiz_neon_adresi" npx prisma db push
   DATABASE_URL="kopyaladiginiz_neon_adresi" npx tsx prisma/seed.ts
   ```

---

### ADIM 2: Kodu GitHub'a Yükleme

1. GitHub'da yeni bir özel (Private) veya genel (Public) repository açın (Örn: `restaurant-nfc-platform`).
2. Bilgisayarınızda terminalden projeyi GitHub'a gönderin:
   ```bash
   cd /Users/ugurerdemdurur/Desktop/Projects/restaurant-nfc-platform
   git init
   git add .
   git commit -m "feat: initial commit with clean architecture and angular frontend"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/restaurant-nfc-platform.git
   git push -u origin main
   ```

---

### ADIM 3: Backend API'yi Render.com'da Yayınlama

1. [Render.com](https://render.com) sitesine gidin ve ücretsiz üye olun.
2. Dashboard'da **"New +" -> "Web Service"** seçeneğine tıklayın.
3. GitHub reponuzu bağlayın.
4. Ayarları şu şekilde doldurun:
   * **Name:** `restaurant-nfc-backend`
   * **Root Directory:** `backend`
   * **Environment:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm start`
   * **Instance Type:** `Free`
5. Sayfanın altındaki **"Environment Variables"** (Ortam Değişkenleri) bölümüne şunları ekleyin:
   * `DATABASE_URL` = `(Adım 1'de aldığınız Neon PostgreSQL bağlantı adresi)`
   * `JWT_SECRET` = `nfc-guclu-uretim-anahtari-2026`
   * `NODE_ENV` = `production`
6. **"Create Web Service"** butonuna basın. Birkaç dakika içinde size ücretsiz bir API adresi verecektir:
   * Örn: `https://restaurant-nfc-backend.onrender.com`

---

### ADIM 4: Frontend'i Vercel'de Yayınlama

1. Canlı backend adresinizi `frontend/src/environments/environment.ts` dosyasında güncelleyin:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://restaurant-nfc-backend.onrender.com/api' // Render'dan aldığınız adres
   };
   ```
   Değişikliği GitHub'a gönderin (`git commit -am "update api url" && git push`).

2. [Vercel.com](https://vercel.com) sitesine gidip GitHub ile giriş yapın.
3. **"Add New" -> "Project"** seçin ve GitHub reponuzu seçin.
4. Proje ayarlarını yapın:
   * **Framework Preset:** `Angular`
   * **Root Directory:** `frontend` (Edit butonuna basıp `frontend` klasörünü seçin)
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist/nfc-frontend/browser`
5. **"Deploy"** butonuna tıklayın!

Vercel 1-2 dakika içinde size ücretsiz bir alan adı verecektir (Örn: `https://restaurant-nfc-platform.vercel.app`).

---

## 🎯 Artık Canlıdasınız!

* **Platform Vitrini:** `https://restaurant-nfc-platform.vercel.app`
* **Müşteri NFC Ekranı:** `https://restaurant-nfc-platform.vercel.app/r/lucca-bistro?table=Masa+1`
* **Yönetim Paneli:** `https://restaurant-nfc-platform.vercel.app/login`
* **Özel Alan Adı (Opsiyonel):** Vercel üzerinden dilerseniz kendi aldığınız bir `.com` veya `.com.tr` alan adını da tek tıkla ücretsiz bağlayabilirsiniz!
