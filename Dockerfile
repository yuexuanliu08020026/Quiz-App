FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Initial Sqlite db data
COPY prisma/dev.db /app/prisma/dev.db

# Generate Prisma Client
RUN npx prisma generate

# initialize the sqlite schema
RUN npx prisma db push

RUN npm run build

FROM node:18-alpine

WORKDIR /app

# Install SQLite for the runtime
RUN apk add --no-cache sqlite

COPY --from=builder /app ./

ENV NODE_ENV=production
# Ensure Prisma uses the correct DB path
ENV DATABASE_URL="file:/app/prisma/dev.db"

EXPOSE 3000

CMD ["npm", "run", "start"]
