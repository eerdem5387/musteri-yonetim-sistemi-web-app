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

# Application başlat
CMD ["npm", "start"] 