# DNS Zone Files
Here you find builds of all Variants and all Formats. DNS based Blacklists can support Wildcard entries. This tool filters out subdomains, reducing the number of Zone Entries required.
[Read more about the hosts file variants](https://github.com/StevenBlack/hosts#list-of-all-hosts-file-variants).

The `base` variant blocks Ads and Malware. All other variants are based on `base` and block aditiional hosts.

DNS Response with `NXDOMAIN` has generally a speed advantage. The client/browser aborts immediately instead of trying to resolve `0.0.0.0`.

| Variant | DNS Server | Response | Hosts | Zones | Download | Checksum |
| ------- | :--------: | :------: | :---: | :---: | :------: | :------: |
<% variants.forEach( (variant) => { -%>
| <%= variant.variant %> | <%= variant.server %> | <%= variant.response %>  | <%= variant.hosts %> | <%= variant.zones %> | [Link](<%= variant.url %>) | [Link](<%= variant.checksum %>) |
 <% }) -%>
