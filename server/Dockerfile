# ──────────────────────────────────────────
# Stage 1: Install dependencies & generate Prisma client
# ──────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# openssl is required by Prisma engine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
# Copy prisma.config.ts so Prisma CLI can read the TypeScript config
COPY prisma.config.ts ./

# Install ALL deps (devDeps needed for prisma generate + tsx for TS config)
RUN npm ci

# DATABASE_URL is required by prisma generate (reads prisma.config.ts)
# Pass it as a build argument from the platform (Koyeb build args)
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma Client from schema
RUN npx prisma generate

# ──────────────────────────────────────────
# Stage 2: Lean production image
# ──────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

# Copy generated node_modules (includes Prisma client) from build stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy all source code (prisma.config.ts, app.js, server.js, modules/, etc.)
COPY . .

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

CMD ["node", "server.js"]
