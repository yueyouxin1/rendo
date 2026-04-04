FROM node:22-alpine

WORKDIR /workspace

RUN corepack enable

COPY package.json tsconfig.json ./
COPY .env.example ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile=false

EXPOSE 3210

CMD ["pnpm", "dev"]
