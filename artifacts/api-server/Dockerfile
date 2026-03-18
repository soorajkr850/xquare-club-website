FROM node:20-slim
WORKDIR /app
RUN npm install -g pnpm@10.26.1
COPY ../../pnpm-lock.yaml ./pnpm-lock.yaml
COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ../../package.json ./package.json
COPY ../../lib ./lib
COPY . ./artifacts/api-server
WORKDIR /app/artifacts/api-server
RUN pnpm install --frozen-lockfile --filter @workspace/api-server...
RUN pnpm run build
EXPOSE 3000
CMD ["node", "dist/index.cjs"]
