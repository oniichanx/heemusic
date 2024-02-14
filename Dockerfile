FROM node:18 as builder

WORKDIR /opt/lavamusic/

# Copy package files
COPY package*.json ./

# Update package lists and install dependencies
RUN apt-get update && \
    apt-get install -y --fix-missing && \
    npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create production image
FROM node:18-slim

ENV NODE_ENV production

WORKDIR /opt/lavamusic/

# Copy compiled code
COPY --from=builder /opt/lavamusic/dist ./dist
COPY --from=builder /opt/lavamusic/src/utils/LavaLogo.txt ./src/utils/LavaLogo.txt
COPY --from=builder /opt/lavamusic/database/lavamusic.db ./database/lavamusic.db

# Copy package files and install production dependencies
COPY package*.json ./
RUN apt-get update && \
    apt-get install -y --fix-missing && \
    npm install --only=production

CMD [ "node", "dist/index.js" ]
