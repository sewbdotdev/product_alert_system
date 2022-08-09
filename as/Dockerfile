FROM node:14.20.0-alpine3.16 as builder
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . ./
RUN yarn build

FROM node:14.20.0-alpine3.16
WORKDIR /app
COPY --from=builder /app/build/ ./
COPY package.json ./
RUN yarn install --only=production
CMD ["yarn", "start"]