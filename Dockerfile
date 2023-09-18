FROM arm64v8/node:lts-buster

ENV NUXT_PUBLIC_API_BASE="UNSET"
ENV NUXT_PUBLIC_WS="UNSET"

# Clone and move into directory
RUN git clone --recurse-submodules https://github.com/cards-against-my-sanity/webclient.git /app
WORKDIR /app

# Install dependencies
RUN yarn install

# Build application
RUN yarn build

# Expose the port
EXPOSE 3000

# Start the app
CMD /bin/sh -c "NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE NUXT_PUBLIC_WS=$NUXT_PUBLIC_WS node .output/server/index.mjs"
