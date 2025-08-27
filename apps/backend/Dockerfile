# Use Node.js 18 Alpine
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files - use Railway-specific package.json
COPY package.railway.json ./package.json
COPY prisma ./prisma
COPY tsconfig.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY src ./src

# Generate Prisma client and build
RUN pnpm build

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Start the application
CMD ["pnpm", "railway:deploy"]