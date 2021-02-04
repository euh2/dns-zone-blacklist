FROM node:lts
LABEL org.opencontainers.image.source=https://github.com/euh2/dns-blacklists

WORKDIR /opt/dns-blacklists
COPY *.json ./
COPY pub pub
COPY *.js ./
RUN npm install
