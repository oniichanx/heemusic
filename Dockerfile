# Stage 1: Build TypeScript
FROM node:23 AS builder

WORKDIR /opt/heemusic/

# Copy only package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and configuration
COPY . .

# Generate Prisma client and build TypeScript
RUN npx prisma db push && \
    npm run build

# Stage 2: Create production image
FROM node:23-slim

ENV NODE_ENV=production

WORKDIR /opt/heemusic/

# Install necessary tools
RUN apt-get update && apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy compiled code and necessary files from the builder stage
COPY --from=builder /opt/heemusic/dist ./dist
COPY --from=builder /opt/heemusic/src/utils/LavaLogo.txt ./src/utils/LavaLogo.txt
COPY --from=builder /opt/heemusic/prisma ./prisma
COPY --from=builder /opt/heemusic/scripts ./scripts
COPY --from=builder /opt/heemusic/locales ./locales

# Install production dependencies
COPY --from=builder /opt/heemusic/package*.json ./
RUN npm install --omit=dev

# Generate Prisma client
RUN npx prisma generate
RUN npx prisma db push

# Ensure application.yml is a file, not a directory
RUN rm -rf /opt/heemusic/application.yml && \
    touch /opt/heemusic/application.yml

# Run as non-root user
RUN addgroup --gid 322 --system heemusic && \
    adduser --uid 322 --system heemusic && \
    chown -R heemusic:heemusic /opt/heemusic/

USER heemusic

CMD ["node", "dist/index.js"]
