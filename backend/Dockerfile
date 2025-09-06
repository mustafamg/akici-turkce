# Backend NestJS container
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --silent || true && npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
