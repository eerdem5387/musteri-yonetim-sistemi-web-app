# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Package files kopyala
COPY package*.json ./

# Dependencies yükle
RUN npm ci

# Application code kopyala
COPY . .

# Build uygulaması
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Non-root user oluştur
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Build output kopyala
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Port expose et
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Application başlat
CMD ["node", "server.js"]