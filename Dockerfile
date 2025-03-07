FROM node:20.18.3-alpine

WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm

# Copier les fichiers du projet
COPY . .

# Installer les dépendances avec pnpm
RUN pnpm install

# Build le projet Next.js
RUN pnpm run build

# Exposer le port pour l'application Next.js
EXPOSE 3000

# Lancer l'application Next.js
CMD ["pnpm", "start"]