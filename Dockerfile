# Stage 1: Build TypeScript
FROM node:18 as builder

WORKDIR /opt/heemusic/

# Copy package files and install dependencies
COPY package*.json ./
RUN apt-get update && \
    apt-get install -y && \
    npm install
# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Create production image
FROM node:18-slim

ENV NODE_ENV production

WORKDIR /opt/heemusic/

# Copy compiled code
COPY --from=builder /opt/heemusic/dist ./dist
COPY --from=builder /opt/heemusic/src/utils/LavaLogo.txt ./src/utils/LavaLogo.txt
COPY --from=builder /opt/heemusic/database/lavamusic.db ./database/lavamusic.db

# Copy package files and install dependencies
COPY package*.json ./
RUN apt-get update && \
    apt-get install -y openssl && \
    npm install --only=production


CMD [ "node", "dist/index.js" ]