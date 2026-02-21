# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Build Next.js app
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Install SSL certificates and networking tools for proper HTTPS handling
RUN apk add --no-cache \
    ca-certificates \
    curl \
    openssl \
    && update-ca-certificates

# Configure Node.js for better SSL handling
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
ENV NODE_TLS_REJECT_UNAUTHORIZED=1

ENV NODE_ENV=production
# Keep image optimization enabled
ENV NEXT_IMAGE_UNOPTIMIZED=false

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js

EXPOSE 3000

CMD ["npm", "start"]