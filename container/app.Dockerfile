FROM mirror.gcr.io/node:lts

WORKDIR /opt/dns-blacklists
COPY *.json ./
COPY pub pub
COPY *.js ./
RUN npm install

