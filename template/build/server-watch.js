let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
let chokidar = require('chokidar')
let controllerDir = path.join(__dirname, '../src/controllers')
let watcher = chokidar.watch(controllerDir, {})
watcher.on('add', function (file) {
  if (/index\.js$/.test(file)) {
    let stat = fs.statSync(file)
    if (!stat.size) {
      shell.exec('git add ' + file)
      shell.exec('cat ' + path.join(__dirname, 'templates/controller.js') + ' >> ' + file )
    }
  }
})