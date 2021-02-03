FROM debian:10-slim

RUN apt-get update && \
 apt-get install -y --no-install-recommends \
 jq curl bash bind9 bind9utils dnsmasq unbound

RUN mkdir -p /pub
COPY /pub /pub
COPY container/tests tests
RUN chmod +x /tests/dns-zone-blacklist-test.sh

CMD ["/tests/dns-zone-blacklist-test.sh"]
