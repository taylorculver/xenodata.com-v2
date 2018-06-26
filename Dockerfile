# `carbon` is Node 8.x LTS which is the current version used by Lambda
FROM node:carbon-alpine

LABEL maintainer="Mutations Limited <docker@mutations.ltd>" \
      name="XendDATA Parnters Website" \
      vendor="Mutations Limited" \
      version=1.0.0

# The user to run the application as
ENV APP_USER app

# Add an unprivileged application user
RUN addgroup -S "$APP_USER" && adduser -S -g "$APP_USER" "$APP_USER"

# Where the application is installed
ENV APP_DIR /app

# Use `/app` as a conventional location for the application
WORKDIR "$APP_DIR"

# Ensure all system packages are up to date
RUN apk update && \
    apk upgrade && \
    apk add --no-cache --virtual .build-packages \
        g++ \
        make && \
    apk add --no-cache --virtual .runtime-packages \
        git \
        python

# `.arc` requires npm >= 6
RUN npm install -g npm@6

# Where Node lib files are installed
ENV NODE_MODULES_FOLDER "$APP_DIR/node_modules"
ENV NODE_BIN_FOLDER "$NODE_MODULES_FOLDER/.bin"

# Ensure the directories exist
RUN mkdir -p "$APP_DIR" "$NODE_MODULES_FOLDER"

# Copy the application dependency files
COPY package.json package-lock.json "$APP_DIR/"

# Install dependencies
RUN npm install --production --silent

# Add the application
COPY . "$APP_DIR"

# Ensure directories are writable by `USER`
RUN chown -R "$APP_USER":"$APP_USER" \
    "$APP_DIR" \
    "$NODE_MODULES_FOLDER"

# Cleanup temp waste from dependency builds
RUN apk del .build-packages && rm -rf /tmp/*

# Run as unprivileged user
USER "$APP_USER"

# Add node binaries to path
ENV PATH "$PATH:$NODE_BIN_FOLDER"

# Development serverless sandbox runs on `localhost:3333`
EXPOSE 3333

# Static HTML served via Python runs on `localhost:8000`
EXPOSE 8000

# Required by Chokidar
ENV SHELL /bin/sh

ENTRYPOINT []

CMD []
