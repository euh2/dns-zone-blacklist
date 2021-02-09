[![CI](https://github.com/euh2/dns-blacklists/workflows/CI/badge.svg)](#readme)  [![Tests](https://github.com/euh2/dns-blacklists/workflows/Tests/badge.svg)](#readme)

# DNS Zone Blacklist Generator

This project started as a fork of [oznu's DNS Zone Blacklist Generator](https://github.com/oznu/dns-zone-blacklist). It has some added functionality, like the option to customize the generated output format of Zone Files and the ability to select a custom [Blacklist Variant](https://github.com/StevenBlack/hosts#list-of-all-hosts-file-variants).

This tool generates Zone Files for [BIND](https://en.wikipedia.org/wiki/BIND), [Dnsmasq](https://en.wikipedia.org/wiki/Dnsmasq) and [Unbound](https://en.wikipedia.org/wiki/Unbound_(DNS_server)) DNS servers using data from the [StevenBlack/hosts](https://github.com/StevenBlack/hosts) project. The generated zone files can be used to block Ads and Malware for an entire Network when used with a local DNS Server.

## Blacklist Variants

In the subfolder `./pub` you find all generated [Blacklist Variants](pub/).

## Blacklist Updates

The Blacklists are updated shortly after new releases at [StevenBlack/hosts](https://github.com/StevenBlack/hosts). 

## Building the Blacklist

The blacklist can be generated using [Node.js 12.0](https://nodejs.org) or later.

Install:

```
git clone https://github.com/euh2/dns-blacklists.git
cd dns-blacklists

npm install
```

Then build:

```
node index.js
```

The compiled blacklist files will be saved to the `./pub/<variant>/bind`, `./pub/<variant>/dnsmasq` and `./pub/<variant>/unbound` directories in the root of the project.

## Customizing
*Just remember to use valid [JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON).*

### Custom Entries

Custom entries can be added to the custom.blacklist.json file in the root of this project before building.

### Whitelist

Any domains you wish to exclude from the blacklist can be added to the custom.whitelist.json file in the root of this project before building.

### Custom Formats

You can copy `./custom.formats.json.example` to `./custom.formats.json` and customize formats or enable/disable formats before running `node index.js`.

### Custom Variants

To adjust which Variants from [StevenBlack/hosts](https://github.com/StevenBlack/hosts) are build, copy `./custom.variants.json.example` to `./custom.variants.json` and edit the list `chosen` to your liking.
