# Use a Node 16 base image
FROM node:20-alpine as development

# Set the working directory to /app inside the container
WORKDIR /app

# Copy app files
COPY . .

# Install dependencies only if package.json or yarn.lock has changed
RUN yarn install

# Build the app
RUN yarn fetch:graphql && \
    yarn generate && \
    # yarn fetch:translations && \
    yarn build 

# Set the env to "production"
ENV NODE_ENV production

# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3100

# Start the app
CMD ["yarn", "serve"]
