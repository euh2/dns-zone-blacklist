# DNS Zone Files
Here you find daily builds of all Variants and all Formats. DNS based Blacklists can support wildcard entries. This tool filters out any subdomains, reducing the number of Zone Entries required.
[Read more about the hosts file variants](https://github.com/StevenBlack/hosts#list-of-all-hosts-file-variants)

DNS Response with `NXDOMAIN` has generally a speed advantage. The client/browser stops immediately instead of trying to resolve `0.0.0.0`.

| Variant | DNS Server | Response | Hosts | Zones | Download | Checksum |
| ------- | :--------: | :------: | :---: | :---: | :------: | :------: |
| base | Bind | NXDOMAIN  | 59,895 | 34,068 | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/bind/bind-nxdomain.blacklist) | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/bind/bind-nxdomain.blacklist.checksum) |
 | base | Bind | 0.0.0.0  | 59,895 | 34,068 | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/bind/zones.blacklist) | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/bind/zones.blacklist.checksum) |
 | base | Dnsmasq | NXDOMAIN  | 59,895 | 34,068 | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/dnsmasq/dnsmasq-server.blacklist) | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/dnsmasq/dnsmasq-server.blacklist.checksum) |
 | base | Dnsmasq | 0.0.0.0  | 59,895 | 34,068 | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/dnsmasq/dnsmasq.blacklist) | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/dnsmasq/dnsmasq.blacklist.checksum) |
 | base | Unbound | NXDOMAIN  | 59,895 | 34,068 | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/unbound/unbound-nxdomain.blacklist) | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/unbound/unbound-nxdomain.blacklist.checksum) |
 | base | Unbound | 0.0.0.0  | 59,895 | 34,068 | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/unbound/unbound.blacklist) | [Link](https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub/base/unbound/unbound.blacklist.checksum) |
 