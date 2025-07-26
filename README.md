# Müşteri Yönetim Sistemi - Web Uygulaması

## Genel Bakış
Bu proje, güzellik merkezi için müşteri, hizmet, uzman ve randevu yönetimini sağlayan bir web uygulamasıdır. Frontend Next.js ve Tailwind CSS, backend Node.js (Express) ve PostgreSQL kullanır. Tüm servisler Docker ile kolayca ayağa kaldırılır.

## Klasör Yapısı
```
frontend/   # Next.js tabanlı kullanıcı arayüzü
backend/    # Node.js (Express) tabanlı API
```

## Hızlı Başlangıç (Docker ile)

### 1. Gereksinimler
- Docker ve Docker Compose kurulu olmalı
- Git kurulu olmalı

### 2. Projeyi İndirin
```bash
git clone <repository-url>
cd musteri-yonetim-sistemi-web-app
```

### 3. Ortam Değişkenlerini Ayarlayın
```bash
# Backend için
cp backend/.env.example backend/.env

# Frontend için
cp frontend/.env.example frontend/.env
```

### 4. E-posta Yapılandırması (İsteğe Bağlı)
Randevu bildirimleri için Gmail kullanarak e-posta gönderimi yapılır:

#### Gmail App Password Oluşturma:
1. **Google Hesabınıza gidin:** https://myaccount.google.com/
2. **Güvenlik** sekmesine tıklayın
3. **2 Adımlı Doğrulama**'yı etkinleştirin
4. **Uygulama Şifreleri**'ne tıklayın
5. **Uygulama seçin:** "Diğer (Özel ad)" → "Müşteri Yönetim Sistemi"
6. **Oluşturulan 16 haneli şifreyi kopyalayın**

#### .env Dosyasını Düzenleyin:
```bash
# backend/.env dosyasında:
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_digit_app_password
```

### 5. Sistemi Başlatın
```bash
docker-compose up --build
```

### 6. Veritabanını Hazırlayın
```bash
# Yeni bir terminal açın ve backend container'ına bağlanın
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npm run seed
```

### 7. Erişim
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **PostgreSQL**: localhost:5432

## Geliştirici Kurulumu (Alternatif)

### Backend Kurulumu
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin (e-posta yapılandırması dahil)
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### Frontend Kurulumu
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

### Hizmetler
- `GET /api/services` - Tüm hizmetleri listele
- `POST /api/services` - Yeni hizmet ekle
- `PUT /api/services/:id` - Hizmet güncelle
- `DELETE /api/services/:id` - Hizmet sil

### Uzmanlar
- `GET /api/experts` - Tüm uzmanları listele
- `POST /api/experts` - Yeni uzman ekle
- `PUT /api/experts/:id` - Uzman güncelle
- `DELETE /api/experts/:id` - Uzman sil

### Müşteriler
- `GET /api/customers` - Tüm müşterileri listele
- `POST /api/customers` - Yeni müşteri ekle
- `PUT /api/customers/:id` - Müşteri güncelle
- `DELETE /api/customers/:id` - Müşteri sil

### Randevular
- `GET /api/appointments` - Tüm randevuları listele
- `POST /api/appointments` - Yeni randevu oluştur (çakışma kontrolü ile)
- `PUT /api/appointments/:id` - Randevu güncelle
- `DELETE /api/appointments/:id` - Randevu sil

## Veritabanı Modelleri

### Service (Hizmet)
- id, name, price, description, createdAt, updatedAt

### Expert (Uzman)
- id, name, specialty, workDays[], createdAt, updatedAt

### Customer (Müşteri)
- id, name, phone, email, createdAt, updatedAt

### Appointment (Randevu)
- id, date, time, status, customerId, serviceId, expertId, createdAt, updatedAt

## Özellikler
- ✅ Hizmet, uzman, müşteri ve randevu yönetimi
- ✅ Randevu çakışma kontrolü
- ✅ E-posta bildirimleri (Gmail SMTP)
- ✅ Modern ve kullanıcı dostu arayüz
- ✅ Docker ile kolay kurulum
- ✅ PostgreSQL veritabanı
- ✅ RESTful API
- ✅ CRUD işlemleri (Oluştur, Oku, Güncelle, Sil)
- ✅ Güvenli silme (randevusu olan kayıtlar korunur)

## E-posta Bildirimleri

### Otomatik E-posta Gönderimi
- **Randevu Oluşturulduğunda:** Müşteriye onay e-postası
- **Randevu Güncellendiğinde:** Müşteriye güncelleme e-postası

### E-posta İçeriği
- Randevu detayları (tarih, saat, hizmet, uzman)
- Müşteri bilgileri
- Önemli notlar ve hatırlatmalar
- Profesyonel HTML tasarım

### Gereksinimler
- Gmail hesabı
- 2 Adımlı Doğrulama etkin
- App Password oluşturulmuş

## Teknolojiler
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Axios
- **Backend**: Node.js, Express, Prisma ORM, Nodemailer
- **Veritabanı**: PostgreSQL
- **E-posta**: Gmail SMTP
- **Container**: Docker & Docker Compose

## Geliştirme

### Backend Geliştirme
```bash
cd backend
npm run dev  # Nodemon ile otomatik yeniden başlatma
```

### Frontend Geliştirme
```bash
cd frontend
npm run dev  # Next.js development server
```

### Veritabanı İşlemleri
```bash
cd backend
npx prisma studio  # Veritabanı görsel arayüzü
npx prisma migrate dev  # Yeni migration oluştur
npm run seed  # Örnek veriler ekle
```

## Lisans
Bu proje MIT lisansı altında lisanslanmıştır. 