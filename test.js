var tape = require('tape')
var ddatabase = require('@ddatabase/core')
var dwREM = require('@dwcore/rem')
var flock = require('.')

function getFlocks (opts, cb) {
  var ddb1 = ddatabase(dwREM)
  ddb1.once('ready', function () {
    var ddb2 = ddatabase(dwREM, ddb1.key)
    ddb2.once('ready', function () {
      var write = flock(ddb1, opts)
      var read = flock(ddb2, opts)
      var flocks = [write, read]
      cb(flocks)
    })
  })
}

tape('connect and close', function (t) {
  t.plan(6)
  getFlocks({}, function (flocks) {
    var write = flocks[0]
    var read = flocks[1]
    var missing = 2

    write.once('connection', function (peer, type) {
      t.ok(1, 'write connected')
      t.equals(write.connections.length, 1)
      done()
    })

    read.once('connection', function (peer, type) {
      t.ok(1, 'read connected')
      t.equals(read.connections.length, 1)
      done()
    })

    function done () {
      if (--missing) return
      write.close(function () {
        t.ok(1, 'write closed')
        read.close(function () {
          t.ok(1, 'read closed')
        })
      })
    }
  })
})

tape('connect without utp', function (t) {
  t.plan(6)
  getFlocks({utp: false}, function (flocks) {
    var write = flocks[0]
    var read = flocks[1]
    var missing = 2

    write.once('connection', function (peer, type) {
      t.ok(1, 'write connected')
      t.equals(write.connections.length, 1)
      done()
    })

    read.once('connection', function (peer, type) {
      t.ok(1, 'read connected')
      t.equals(read.connections.length, 1, 'connection length')
      done()
    })

    function done () {
      if (--missing) return
      write.close(function () {
        t.ok(1, 'write closed')
        read.close(function () {
          t.ok(1, 'read closed')
        })
      })
    }
  })
})
