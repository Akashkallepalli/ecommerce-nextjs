FROM node:20-alpine

WORKDIR /app

# ADD THIS NEW LINE HERE:
# RUN apk add --no-cache openssl
RUN apk add --no-cache openssl libc6-compat
# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]