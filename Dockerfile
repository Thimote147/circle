# Étape 1 : Build de l'application Next.js
FROM node:20 AS builder

WORKDIR /app

# Copier les fichiers nécessaires pour l'installation
COPY package.json pnpm-lock.yaml ./

# Installer pnpm
RUN npm install -g pnpm

# Installer les dépendances sans les packages inutiles
RUN pnpm install --frozen-lockfile

# Copier tout le code source
COPY . .

# Build de Next.js
RUN pnpm run build

# Étape 2 : Démarrer le serveur Next.js
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers nécessaires au runtime
COPY --from=builder /app ./

# Exposer le port de Next.js
EXPOSE 3000

# Commande pour démarrer Next.js en mode serveur
CMD ["pnpm", "run", "start"]