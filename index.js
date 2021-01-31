'use strict'

const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const crypto = require('crypto')
const fetch = require('node-fetch')

const worker = require('./worker.js')

class Blacklist {
  constructor () {
    this.whitelist = require('./custom.whitelist')
    this.custom_blacklist = require('./custom.blacklist')
    this.readmeDataURL = 'https://raw.githubusercontent.com/StevenBlack/hosts/master/readmeData.json'
    this.baseURL = 'https://raw.githubusercontent.com/StevenBlack/hosts/master/'
    this.baseURLFile = 'hosts'
    this.pubURL = 'https://raw.githubusercontent.com/euh2/dns-blacklists/master/pub'
    this.pubDataAll = []
    this.zonefileSerial = () => {
      const d = new Date()
      return d.getTime()
    } 

    const custom_formats = './custom.formats.json'
    let formats = [
      {
        type: 'bind',
        filename: 'zones.blacklist',
        response: "0.0.0.0",
        enabled: true,
        template: 'zone "<%= host %>" { type master; notify no; file "null.zone.file"; };'
      },
      {
        type: 'bind',
        filename: 'bind-nxdomain.blacklist',
        response: "NXDOMAIN",
        enabled: true,
        template: '<%= host %> CNAME .\n*.<%= host %> CNAME .',
        header: `$TTL 60\n@ IN SOA localhost. dns-zone-blacklist. (<%= serial %> 3H 1H 1W 1H)\ndns-zone-blacklist. IN NS localhost.`,
        footer: `\n`
      },
      {
        type: 'dnsmasq',
        filename: 'dnsmasq.blacklist',
        response: "0.0.0.0",
        enabled: true,
        template: 'address=/<%= host %>/0.0.0.0'
      },
      {
        type: 'dnsmasq',
        filename: 'dnsmasq-server.blacklist',
        response: "NXDOMAIN",
        enabled: true,
        template: 'server=/<%= host %>/'
      },
      {
        type: 'unbound',
        filename: 'unbound.blacklist',
        response: "0.0.0.0",
        enabled: true,
        template: 'local-zone: "<%= host %>" redirect\nlocal-data: "<%= host %> A 0.0.0.0"'
      },
      {
        type: 'unbound',
        filename: 'unbound-nxdomain.blacklist',
        response: "NXDOMAIN",
        enabled: true,
        template: 'local-zone: "<%= host %>" always_nxdomain'
      }
    ]

    // check for custom.formats file
    fs.readFile(custom_formats, (err, data) => {
      if (err) {
        if(err.code === 'ENOENT' ){
          this.formats = formats.filter( (obj) => {return (obj.enabled)})
          return
        }
        throw err
      }
      //file exists
      formats = JSON.parse(data); 
      this.formats = formats.filter( (obj) => {return (obj.enabled)})
    })
  }

  get_url(variant){
    return new Promise((resolve, reject) => {
      let url
      if (variant === 'base') {
        resolve(url = `${this.baseURL}${this.baseURLFile}`)
      }
      let variantJSON = {}
      const json = this.readmeDataJSON
      Object.keys(json).forEach( key => {
        if(variant.valueOf() == key){
          variantJSON = json[key]
        }
      })
      if (variantJSON === undefined) { reject(console.error(`Specified key not found: ${variant}`)) }
      let location = JSON.stringify(variantJSON.location, null, 2)
      location = location.replace(/"([^"]+)"/g, '$1');
      url = `${this.baseURL}${location}${this.baseURLFile}`
      resolve(url).catch(error  => reject(error))
    })
  }

  write_zonefiles(variant, blacklist) {
    return new Promise((resolve, reject) => {
      // Build a zonefile for each enabled format type
      let pubData = []
      console.log(`\nWrite Zone Files for "${variant}" variant ...`)
      this.formats.forEach((format) => {
        let zoneFile = blacklist.map(x => ejs.render(format.template, {host: x})).join('\n')

        if (format.header) {
          // zoneFile = format.header + '\n\n' + zoneFile
          zoneFile = ejs.render(format.header, {serial: this.zonefileSerial()}) + '\n\n' + zoneFile
        }
        if (format.footer) {
          zoneFile = zoneFile + format.footer
        }

        // Create Directory 
        let outDir = path.join(__dirname, `pub/${variant}/${format.type}`)
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true }) 
          console.log(`Directory ${outDir} created successfully!`); 
        }

        let sha256 = crypto.createHash('sha256').update(zoneFile).digest('hex')
        let dest_rel = `pub/${variant}/${format.type}/${format.filename}`
        let dest = path.resolve(__dirname, dest_rel )

        fs.writeFileSync(`${dest}.checksum`, sha256)
        console.log(`${variant}, ${format.type}: ${format.filename} checksum is ${sha256}`)

        fs.writeFileSync(`${dest}`, zoneFile)
        console.log(`${variant}, ${format.type}: ${blacklist.length} Zones saved to ${dest_rel}`)

        let sortOrder = `${format.type}-${format.filename}`
        let urlZoneFile = `${this.pubURL}/${variant}/${format.type}/${format.filename}`
        let server = format.type.charAt(0).toUpperCase() + format.type.slice(1)

        this.pubDataAll.push( 
          { 'variant': variant,
            'sortBy': sortOrder,
            'filename': format.filename,
            'server': server,
            'url': urlZoneFile,
            'checksum': urlZoneFile + '.checksum',
            'hosts': this.readmeDataJSON[variant].entries.toLocaleString(),
            'zones': blacklist.length.toLocaleString(),
            'response': format.response
          }
        )
      })
      resolve()
      .catch(error  => reject(error))
    })
  }
  update_readme() {
    let readmeTemplatePub = fs.readFileSync(path.resolve(__dirname, 'pub/README.template.md'), 'utf8')
    let readmePub = ejs.render(readmeTemplatePub, {
      variants: this.pubDataAll.sort(function(a, b) {
        var variantA = a.variant.toUpperCase(); 
        var variantB = b.variant.toUpperCase(); 
        var sortByA = a.sortBy.toUpperCase()
        var sortByB = b.sortBy.toUpperCase()
        //first sort by variant
        if (variantA < variantB) {
            return -1;
        }
        if (variantA > variantB) {
            return 1;
        }
        // variant is equal
        if (sortByA < sortByB) {
            return -1;
        }
        if (sortByA > sortByB) {
            return 1;
        }

        // all must be equal
        return 0;
      })
    })
    fs.writeFileSync(path.resolve(__dirname, 'pub/README.md'), readmePub)
    console.log(`\n./pub/README.md updated.`)
  }

  async start() {
    const custom_variants = './custom.variants.json'
    this.build_variants = []

    this.readmeDataJSON = await fetch(this.readmeDataURL)
        .then(res => res.json())

    try {
      let variants = new Map()
      let enabled_variants = []
      let variant_data = Object.create(null)
      
      if (!fs.existsSync(custom_variants)) {
        const available_variants = Object.keys(this.readmeDataJSON)
        enabled_variants = available_variants
        
      } else {
        const file = fs.readFileSync(custom_variants, 'utf8')
        enabled_variants = JSON.parse(file).chosen
      }
      const enVarString = () => {
        let s = ''
        if (enabled_variants.length > 1) {
          for (const variant of enabled_variants) {
            if (variant === enabled_variants.slice(-1)[0]) {
              s = (s + ` and ${variant}`)
            } else if (variant === enabled_variants.slice(-2, -1)[0]) {
              s = (s + ` ${variant}`)
            } else {
              s = (s + ` ${variant},`)
            }
          }
        } else {
          s = ` ${enabled_variants}`
        }
        return s
      }
      console.log(`Enabled variants:` + enVarString() + `.`)

      for (const variant of enabled_variants) {
        const url = await this.get_url(variant)
        // fetch raw hostsfile from StevenBlack
        if (variant === enabled_variants.slice(-1)[0]) {
          console.log(`Download ${url}.\n`)
        } else {
          console.log(`Download ${url}.`)
        }
        const hosts = await fetch(url).then(res => res.text())
        variant_data = 
            {
              'hosts': hosts,
              'blacklist': this.custom_blacklist,
              'whitelist': this.whitelist
            }
        variants.set(
          variant, variant_data
        )
      }

      let workerList = [] // becomes array of promises
      const script = './build'
      // main build loop, outsourced to worker_threads
      for (const [variant, data] of variants) {
        let w = worker(script, variant, data)
        workerList.push(w)
        w
      }

      let pubDataAll = {}
      const doneWork = new Promise( async (resolve) => {
        // await every single worker promise, then write zone files (formats)
        for (let i of workerList) {
          await i
          .then( async (res) => {
            await this.write_zonefiles(res.variant, res.data)
              // .then( pubData => {
              //   for (const [key, value] of pubData) {
              //     Object.defineProperty(pubDataAll, key, value)
              //   }
              // })
          })
        }
        (resolve())
      })

      await doneWork
        .then( () => {
          this.update_readme()
        })
        // .then(this.update_readme())
        .then( () => {
          const hrend = process.hrtime(hrstart)
          const minutes = Math.floor(hrend[0] / 60)
          const seconds = hrend[0] - minutes * 60
          console.info(`\nBuild Time: ${minutes}m, ${seconds}s, ${hrend[1]}ns`)
        })
    }
    catch (err) {
      console.error(err)
    }
  }

}
const hrstart = process.hrtime()

const blacklist = new Blacklist()
blacklist.start()
