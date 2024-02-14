FROM node:18 as builder

WORKDIR /opt/heemusic/

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

WORKDIR /opt/heemusic/

# Copy compiled code
COPY --from=builder /opt/heemusic/dist ./dist
COPY --from=builder /opt/heemusic/src/utils/LavaLogo.txt ./src/utils/LavaLogo.txt
COPY --from=builder /opt/heemusic/src/database/lavamusic.db ./src/database/lavamusic.db

# Copy package files and install production dependencies
COPY package*.json ./
RUN apt-get update && \
    apt-get install -y --fix-missing && \
    npm install --only=production

CMD [ "node", "dist/index.js" ]
