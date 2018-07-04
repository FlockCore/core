var flockPresets = require('@flockcore/presets')
var revelation = require('@flockcore/revelation')
var xtend = require('xtend')

module.exports = FlockCore

function FlockCore (vault, opts) {
  if (!(this instanceof FlockCore)) return new FlockCore(vault, opts)
  if (!opts) opts = {}

  var self = this
  this.vault = vault
  this.uploading = !(opts.upload === false)
  this.downloading = !(opts.download === false)
  this.live = !(opts.live === false)

  // Revelation Flock Options
  opts = xtend({
    port: 6620,
    id: vault.id,
    hash: false,
    stream: function (peer) {
      return vault.replicate({
        live: self.live,
        upload: self.uploading,
        download: self.downloading
      })
    }
  }, opts)

  this.flock = revelation(flockPresets(opts))
  this.flock.once('error', function () {
    self.flock.listen(0)
  })
  this.flock.listen(opts.port)
  this.flock.join(this.vault.revelationKey)
  return this.flock
}
