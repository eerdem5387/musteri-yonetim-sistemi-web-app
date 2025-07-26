# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Package files kopyala
COPY package*.json ./
COPY prisma ./prisma/

# Dependencies yükle
RUN npm install

# Prisma client generate et
RUN npx prisma generate

# Application code kopyala
COPY . .

# Port expose et
EXPOSE 4000

# Migration ve seed script'i oluştur
RUN echo '#!/bin/sh\nnpx prisma migrate deploy\nnpx prisma db seed\nnpm start' > /app/start.sh
RUN chmod +x /app/start.sh

# Application başlat
CMD ["/app/start.sh"] 