# 1단계: 빌드
FROM node:22.19.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 실행 (최소화)
FROM node:22.19.0-alpine AS runner
WORKDIR /app

# 빌드 결과물만 복사 (standalone)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
