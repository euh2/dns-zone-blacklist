FROM docker.pkg.github.com/initaneti/node-lts/2021-02-03_20-26-04:main

WORKDIR /opt/dns-blacklists
COPY *.json ./
COPY pub pub
COPY *.js ./
RUN npm install

