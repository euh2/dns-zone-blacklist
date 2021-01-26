# DNS Zone Files
Here you find daily builds of all Variants and all Formats. DNS based Blacklists can support wildcard entries. This tool filters out any subdomains, reducing the number of Zone Entries required.
[Read more about the hosts file variants](https://github.com/StevenBlack/hosts#list-of-all-hosts-file-variants)

DNS Response with `NXDOMAIN` has generally a speed advantage. The client/browser stops immediately instead of trying to resolve `0.0.0.0`.

| Variant | DNS Server | Response | Hosts | Zones | Download | Checksum |
| ------- | :--------: | :------: | :---: | :---: | :------: | :------: |
<% variants.forEach( (variant) => { -%>
| <%= variant.variant %> | <%= variant.server %> | <%= variant.response %>  | <%= variant.hosts %> | <%= variant.zones %> | [Link](<%= variant.url %>) | [Link](<%= variant.checksum %>) |
 <% }) -%>
