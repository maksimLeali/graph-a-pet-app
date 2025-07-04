FROM node:20-slim AS development
WORKDIR /app

# 1) Installa i certificati di sistema
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# 2) Copia e installa dipendenze
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 3) Copia tutto il codice
COPY . .

# 4) Introspect + generate + build
RUN yarn fetch:graphql \
 && yarn generate \
 && yarn build

ENV NODE_ENV=production
EXPOSE 3100
CMD ["yarn", "serve"]
