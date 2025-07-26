# Müşteri Yönetim Sistemi - Web Uygulaması

## Genel Bakış
Bu proje, güzellik merkezi için müşteri, hizmet, uzman ve randevu yönetimini sağlayan bir web uygulamasıdır. Frontend Next.js ve Tailwind CSS, backend Node.js (Express) ve PostgreSQL kullanır. Tüm servisler Docker ile kolayca ayağa kaldırılır.

## Klasör Yapısı
```
frontend/   # Next.js tabanlı kullanıcı arayüzü
backend/    # Node.js (Express) tabanlı API
```

## Hızlı Başlangıç (Docker ile)
1. Gerekli dosyaları ve ortam değişkenlerini ayarlayın:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
2. Tüm sistemi başlatın:
   ```bash
   docker-compose up --build
   ```
3. Frontend: http://localhost:3000
   Backend API: http://localhost:4000

## Geliştirici Kurulumu (Alternatif)
- PostgreSQL lokal kurulumu veya Docker ile başlatma
- `backend/` ve `frontend/` klasörlerinde bağımlılıkların kurulması

## Temel Özellikler
- Hizmet, uzman, müşteri ve randevu yönetimi
- Randevu çakışma kontrolü
- SMS/E-posta bildirimleri
- Modern ve kullanıcı dostu arayüz

## Ekstra
- Kod kalitesi: ESLint, Prettier
- Testler: Jest/Vitest
- API dokümantasyonu: Swagger

---
Kurulum ve kullanım detayları ilgili klasörlerin README dosyalarında bulunacaktır. 