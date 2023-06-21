# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine as development
# Set the working directory to /app inside the container
COPY . ./app
WORKDIR /app
# Copy app files
RUN yarn 
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
# Build the app
RUN yarn generate
RUN yarn build
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3100
# Start the app
CMD [ "yarn", "start" ]