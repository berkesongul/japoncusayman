FROM node:22-alpine AS base

# Aşama 1: Bağımlılıkları Kur
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# npm paket bağımlılıklarını kur
COPY package.json package-lock.json* ./
RUN npm ci

# Aşama 2: Next.js Uygulamasını Derle
FROM base AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables derleme sırasında gerekiyorsa boş geç veya dummy ekle
# Prisma client'ı oluştur
RUN npx prisma generate

# Next.js standalone build oluştur
# (next.config.ts içinde output: "standalone" olduğundan emin olun)
RUN npm run build

# Aşama 3: Production İmajı
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next.js telemetry bilgisini kapatır
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache openssl

# Root olmayan bir kullanıcı ekle (Güvenlik)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Public klasörünü kopyala (Resimler, fontlar vb.)
COPY --from=builder /app/public ./public
# Uploads klasörü için kalıcı alanın yazılabilir olduğundan emin ol
RUN mkdir -p public/uploads && chown nextjs:nodejs public/uploads

# Sadece standalone derleme dosyalarını kopyala
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Prisma client veya migrations gibi ekstralar lazımsa kopyalanabilir fakat standalone içine genelde dahil olur.

USER nextjs

EXPOSE 3000

ENV PORT=3000
# sunucu host adını 0.0.0.0 yaparak docker dışına açılır
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
