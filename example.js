var ddrive = require('@ddrive/core')
var dwREM = require('@dwcore/rem')
var flockCore = require('.')
var Buffer = require('safe-buffer').Buffer

var key = process.argv[2] && new Buffer(process.argv[2], 'hex')
var vault = ddrive(dwREM, key)
vault.ready(function (err) {
  if (err) throw err
  console.log('key', vault.key.toString('hex'))
  var flock = flockCore(vault)
  flock.on('connection', function (peer, type) {
    console.log('got', peer, type) // type is '@flockcore/wrtc' or '@flockcore/revelation'
    console.log('connected to', flock.connections, 'peers')
    peer.on('close', function () {
      console.log('peer disconnected')
    })
  })
})
