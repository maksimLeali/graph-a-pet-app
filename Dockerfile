# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine as development
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . ./app
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN yarn 
# Build the app
RUN yarn build
RUN yarn generate
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3100
# Start the app
CMD [ "yarn", "dev" ]