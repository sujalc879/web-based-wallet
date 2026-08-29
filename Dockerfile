# Stage 1: Compile the frontend assets using Bun
FROM oven/bun:1 AS builder
WORKDIR /usr/src/app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .

# 👇 ADD THESE TWO LINES HERE
ARG VITE_ALCHEMY_URL
ENV VITE_ALCHEMY_URL=$VITE_ALCHEMY_URL

RUN bun run build

# Stage 2: Deploy production assets to Nginx
FROM nginx:alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
