# Imagen de producción: build multi-etapa
FROM node:22-bookworm-slim AS builder

WORKDIR /app

RUN npm install -g npm@11.6.2

COPY package.json package-lock.json ./
RUN npm ci

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

FROM node:22-bookworm-slim AS production

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g npm@11.6.2

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 3000
USER node
CMD ["node", "dist/main.js"]
