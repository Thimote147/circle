# Étape 1 : Build de l'application Next.js
FROM node:20 AS builder

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer pnpm
RUN npm install -g pnpm

# Installer les dépendances
RUN pnpm install

# Copier le reste du code source
COPY . .

# Construire l'application Next.js
RUN pnpm run build

# Étape 2 : Exécution du serveur Next.js
FROM node:20 AS runner

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers essentiels du builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Exposer le port de Next.js (3000 par défaut)
EXPOSE 3000

# Démarrer Next.js
CMD ["pnpm", "start"]