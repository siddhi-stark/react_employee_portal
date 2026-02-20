FROM node:16 AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --f

COPY . .
RUN npm run build

FROM alpine
WORKDIR /app
COPY --from=builder /app/build /var/www/react-app
CMD ["tail", "-f", "/dev/null"]
