FROM node:14.20.0-alpine3.16 as builder
WORKDIR /app
COPY package*.json ./
COPY ./src/prisma/schema.prisma ./src/prisma/schema.prisma
RUN npm install
COPY . ./
RUN npm run build

FROM node:14.20.0-alpine3.16
WORKDIR /app
COPY --from=builder /app/build/ ./
COPY package.json ./
COPY ./src/prisma/schema.prisma   ./src/prisma/schema.prisma 
RUN npm install --only=production
CMD ["npm", "start"]