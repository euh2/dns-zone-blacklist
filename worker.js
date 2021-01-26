const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

if (isMainThread) {
  module.exports = function workerAsync(script, variant, data) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: 
          {
            'script': script,
            'variant': variant,
            'data': data
          }
      });
      worker.once('message', (msg) => {
        const textDecoder = new TextDecoder();
        const dataString = textDecoder.decode(msg.data.buffer)
        const dataArray = dataString.split(',')
        const result = {'variant': msg.variant, 'data': dataArray}
       resolve(result)
      });
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const script = workerData.script
  const variant = workerData.variant
  const data = workerData.data
  // console.log(script, variant)
  const work = require(script)
    work(variant, data).then( res => {
      const textEncoder = new TextEncoder();
      const buffer = textEncoder.encode([res])
      const objData = 
      {
        'variant': variant,
        'data': buffer
      }
      parentPort.postMessage(objData, [objData.data.buffer])
    })
}
