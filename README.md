# ⚡ Antigravity Restaurant NFC & Menü Platformu

Müşterilerin masadaki NFC etiketlerine telefonlarını yaklaştırdığında (veya masa QR kodunu okuttuğunda) mekanın dijital menüsüne, otomatik Wi-Fi bağlantısına, Google yorum sayfasına ve masa servisine anında ulaştığı **Multi-Tenant (Çoklu Restoranlı) Akıllı Menü ve Yönetim Sistemi**.

---

## 🚀 Öne Çıkan Özellikler

### 📱 1. Müşteri Deneyimi (NFC Landing Hub - `/r/:slug`)
* **Uygulama İndirme Zorunluluğu Yok**: NFC etiketi tarandığı anda tarayıcıda doğrudan açılır.
* **Masa Numarası Desteği**: `?table=Masa+4` gibi parametreleri algılar, garson ve hesap çağrılarına masayı otomatik ekler.
* **1-Tıkla Wi-Fi Bağlantısı**:
  * iOS ve Android kameralarının tanıdığı standart `WIFI:S:...;T:WPA;P:...;;` QR kodu.
  * 1-Tıkla "Şifreyi Kopyala" butonu.
* **Google 5★ Değerlendirme Yönlendiricisi**: Masadaki müşteriyi doğrudan Google Haritalar / Yorum sayfasına sevk eder.
* **Zengin Dijital Menü**:
  * Anlık arama (canlı filtreleme).
  * Kategori sekmeleri (Başlangıçlar, Makarnalar, Kokteyller, Tatlılar, vb.).
  * Diyet filtreleri (Vejetaryen, Glutensiz, vb.).
  * Alerjen uyarıları, kalori bilgisi, şefin seçimi ve popülerlik rozetleri.
  * Yemek detay modalları.
* **Garson & Hesap Çağrısı**: Masadan "Garson Çağır", "Nakit Hesap" veya "Kredi Kartı ile Hesap" talepleri.
* **Çift Dil Desteği**: Türkçe ve İngilizce (TR / EN) tek tıkla geçiş.

### 📊 2. Restoran Yönetim Paneli (Admin Dashboard - `/admin`)
* **Canlı İstatistikler & Analitik**:
  * Toplam NFC okutma sayısı.
  * Wi-Fi bağlantı talepleri.
  * Google yorum tıklamaları.
  * Menü ve yemek görüntüleme sayıları.
  * Masalardan gelen garson / hesap çağrıları.
  * Gerçek zamanlı etkileşim akışı (son 20 işlem).
* **Menü Yönetimi (Menu & Category CRUD)**:
  * Kategori ekleme, düzenleme, silme, emoji ve sıra belirleme.
  * Yemek ekleme, düzenleme, fiyat güncelleme, fotoğraf yükleme.
  * **Anlık Stok / Tükendi Butonu**: Tek tıkla yemeği satışa kapatıp açabilme.
* **Mekan, Wi-Fi & Google Ayarları**:
  * Mekan adı, slogan, adres, telefon, Instagram ve WhatsApp hattı.
  * Canlı Renk Seçici: Mekanın marka rengine göre müşteri temasını anında güncelleme.
  * Wi-Fi SSID, şifre ve şifreleme tipi yapılandırması (Canlı Wi-Fi QR önizlemesi ile).
  * Google Yorum linki yapılandırması (Canlı Google QR önizlemesi ile).
* **NFC Masa Standı Üretici (Printable Desk Stands)**:
  * Masalara konulacak şık stand tasarımları.
  * Masa 1'den istenen sayıya kadar toplu stand ve QR üretimi.
  * Tek tıkla **Yazdır / PDF Olarak Kaydet** desteği.
* **Canlı Mobil Ekran Simülatörü**: Yönetim panelinden çıkmadan müşteri ekranını telefon çerçevesinde anlık test etme.

---

## 🏗️ Clean Architecture (Temiz Mimari)

Backend `Node.js + Express + TypeScript + Prisma ORM (SQLite)` kullanılarak **Clean Architecture** prensiplerine göre katmanlara ayrılmıştır:

```
backend/src/
├── core/                       # 1. Domain Katmanı (En iç katman - Bağımsız)
│   ├── entities/               # Restaurant, MenuCategory, MenuItem, User, Analytics
│   ├── repositories/           # IRestaurantRepository, IMenuRepository, IUserRepository, IAnalyticsRepository
│   └── errors/                 # AppError, NotFoundError, UnauthorizedError, ConflictError
│
├── application/                # 2. Use Cases Katmanı (İş Mantığı)
│   └── use-cases/
│       ├── auth/               # LoginUseCase, RegisterRestaurantUseCase
│       ├── restaurant/         # GetPublicRestaurantProfile, UpdateRestaurantProfile
│       ├── menu/               # FullMenu, Category CRUD, Item CRUD, ToggleAvailability
│       ├── analytics/          # TrackEventUseCase, GetStatsUseCase
│       └── qr/                 # WifiQr, GoogleQr, TableStandQr Generator
│
├── infrastructure/             # 3. Altyapı Katmanı (Veritabanı & Dış Servisler)
│   ├── database/               # Prisma Client (SQLite / PostgreSQL hazır)
│   ├── repositories/           # PrismaRestaurantRepository, PrismaMenuRepository, vb.
│   ├── security/               # PasswordHasher (bcrypt), TokenService (JWT)
│   └── qr/                     # QrCodeService (Standart Wi-Fi & URL QR motoru)
│
└── presentation/               # 4. Sunum Katmanı (Web & HTTP)
    ├── controllers/            # Auth, Public, RestaurantAdmin, MenuAdmin, Analytics, Qr
    ├── middlewares/            # JWT Auth middleware, ErrorHandler
    ├── app.ts                  # Dependency Injection Composition Root
    └── server.ts               # Sunucu başlatıcı
```

Frontend ise **Angular 22** ile:
* Standalone Components
* Signals & Computed Reactivity
* Lazy Loaded Routing
* SafeUrl Pipes
* Dark Luxury Glassmorphism CSS Design System

---

## 🔑 Hazır Demo Hesaplar

Platform veritabanına otomatik olarak iki farklı lüks restoran ve menüsü tohumlanmıştır (seeded):

| Mekan Adı | Slug (NFC Linki) | Yönetici E-posta | Şifre |
|---|---|---|---|
| **Lucca Bistro & Lounge** | `/r/lucca-bistro` | `admin@lucca.com` | `password123` |
| **Gusto Trattoria** | `/r/gusto-trattoria` | `admin@gusto.com` | `password123` |

---

## 🏃‍♂️ Çalıştırma Talimatları

### 1. Backend API (Port 3001)
```bash
cd backend
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev # veya npm run start
```
* API Adresi: `http://localhost:3001`
* Sağlık Kontrolü: `http://localhost:3001/health`

### 2. Angular Frontend (Port 4200)
```bash
cd frontend
npm install
npm run start
```
* Web Adresi: `http://localhost:4200`
* Lucca Müşteri NFC Ekranı: `http://localhost:4200/r/lucca-bistro?table=Masa+4`
* Gusto Müşteri NFC Ekranı: `http://localhost:4200/r/gusto-trattoria?table=Masa+1`
* Yönetim Paneli Girişi: `http://localhost:4200/login`
