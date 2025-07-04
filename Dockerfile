# Dockerfile
FROM node:20-slim AS development
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn fetch:graphql \
 && yarn generate \
 && yarn build
ENV NODE_ENV=production
EXPOSE 3100
CMD ["yarn", "serve"]