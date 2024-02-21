FROM node:20 as builder

WORKDIR /opt/heemusic/

# Copy package files
COPY package*.json ./

# Create an empty tsconfig.json file if it doesn't exist
RUN test -f tsconfig.json || echo '{}' > tsconfig.json

# Update package lists and install dependencies
RUN apt-get update && \
    apt-get install -y --fix-missing && \
    npm install

# Copy source code
COPY . .

# Copy tsconfig.json
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Create production image
FROM node:20-slim

ENV NODE_ENV production

WORKDIR /opt/heemusic/

# Copy compiled code
COPY --from=builder /opt/heemusic/dist ./dist
COPY --from=builder /opt/heemusic/src/utils/LavaLogo.txt ./src/utils/LavaLogo.txt
COPY --from=builder /opt/heemusic/src/database/lavamusic.db ./src/database/lavamusic.db

# Copy package files and install production dependencies
COPY --from=builder /opt/heemusic/package*.json ./
RUN apt-get update && \
    apt-get install -y --fix-missing && \
    npm install --only=production

CMD [ "node", "dist/index.js" ]
