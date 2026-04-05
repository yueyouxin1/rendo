FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /workspace

RUN corepack enable

FROM base AS dev

EXPOSE 3000

CMD ["sh", "-lc", "node scripts/bootstrap.mjs && pnpm --dir apps/web dev --hostname 0.0.0.0 --port 3000"]

FROM base AS release-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json
COPY db/package.json ./db/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY packages/create-rendo/package.json ./packages/create-rendo/package.json
COPY packages/domain/package.json ./packages/domain/package.json
COPY packages/rendo/package.json ./packages/rendo/package.json
COPY packages/sdk/package.json ./packages/sdk/package.json
COPY packages/ui/package.json ./packages/ui/package.json

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile --force

FROM base AS release

ENV NODE_ENV="production"
ENV PORT="3000"
ENV DATABASE_URL="postgresql://rendo:rendo@postgres:5432/rendo"
ENV POSTGRES_URL="postgresql://rendo:rendo@postgres:5432/rendo"
ENV REDIS_URL="redis://redis:6379"
ENV BETTER_AUTH_SECRET="build-secret-build-secret-build-secret"
ENV BETTER_AUTH_URL="http://localhost:3000"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"

COPY . .

COPY --from=release-deps /workspace/node_modules ./node_modules
COPY --from=release-deps /workspace/apps/web/node_modules ./apps/web/node_modules
COPY --from=release-deps /workspace/db/node_modules ./db/node_modules

RUN --mount=type=cache,id=next-cache,target=/workspace/apps/web/.next/cache pnpm build

EXPOSE 3000

CMD ["sh", "-lc", "node scripts/start-release.mjs"]
