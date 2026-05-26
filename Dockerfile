FROM node:20-alpine

WORKDIR /app

# Instala pnpm
RUN npm install -g pnpm

# Copia archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instala dependencias
RUN pnpm install

# Copia proyecto
COPY . .

EXPOSE 3001

CMD ["pnpm", "run", "dev"]