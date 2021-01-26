'use strict'

// this module is outsourced to worker_threads
// because it takes time and resources
module.exports = function build(variant, data) {
  return new Promise((resolve, reject) => {
    let blacklist = data['blacklist']
    const whitelist = data['whitelist']
    const hosts = data['hosts']
      console.log(`Build Zone Files for "${variant}" variant ...`)
      // Filter the original hosts file
      hosts
        .split('\n')
        .map(x => x.trim())
        .filter(x => !(x === '' || x.charAt(0) === '#'))
        .map(x => x.split(' ')[1])
        .filter(x => !whitelist.includes(x))
        .sort((a, b) => a.length - b.length)
        .map(host => {
          if (!blacklist.find(x => host.slice(-Math.abs(x.length + 1)) === '.' + x)) {
            blacklist.push(host)
        }
      })
      resolve(blacklist)
      })
}
