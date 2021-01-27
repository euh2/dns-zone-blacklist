#!/bin/bash

url="https://api.github.com/repos/euh2/dns-blacklists/contents/pub"
folders=$(curl -s --insecure -H "Accept: application/vnd.github.v3+json" $url \
| jq '.[] | select( .type == "dir" ) | .name' | tr -d \")
# unblound_nxdomain=`
# server:
# 	include: /pub/base/unbound/unbound-nxdomain.blacklist`
# echo $folders
for i in $folders
do
    echo "------------ $i ------------"
    echo Bind
    named-checkconf /pub/$i/bind/zones.blacklist || exit 1
    named-checkzone dns-zone-blacklist /pub/$i/bind/bind-nxdomain.blacklist || exit 1
    echo Dnsmasq
    dnsmasq --test --conf-file="/pub/$i/dnsmasq/dnsmasq.blacklist" || exit 1
    dnsmasq --test --conf-file="/pub/$i/dnsmasq/dnsmasq-server.blacklist" || exit 1
done

echo Unbound
# unbound-checkconf /pub/$i/tests/unbound.conf || exit 1
unbound-checkconf /tests/unbound-nxdomain.conf 2>/dev/null || exit 1
