# ──────────────────────────────────────────
# Stage 1: Install dependencies & generate Prisma client
# ──────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

# Install all deps (including devDeps needed for prisma generate)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# ──────────────────────────────────────────
# Stage 2: Production image
# ──────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

# Copy installed modules + generated prisma client
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source code
COPY . .

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

CMD ["node", "server.js"]
