# Usar la imagen oficial de Bun como base
FROM oven/bun:latest as base
WORKDIR /app

# ---- Etapa de Dependencias ----
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb* /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# ---- Etapa de Producción ----
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Exponer el puerto que usa ElysiaJS
EXPOSE 3000

# Comando para iniciar la aplicación
USER bun
ENTRYPOINT [ "bun", "run", "start" ]
