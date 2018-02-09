const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const chokidar = require('chokidar')
const controllerDir = path.join(__dirname, '../src/controllers')
const modelDir = path.join(__dirname, '../src/models')
const controllerWatcher = chokidar.watch(controllerDir, {})
const modelWatcher = chokidar.watch(modelDir, {})
const modelTpl = require('./templates/model')
controllerWatcher.on('add', function (file) {
  if (/index\.js$/.test(file)) {
    let stat = fs.statSync(file)
    if (!stat.size) {
      shell.exec('git add ' + file)
      shell.exec('cat ' + path.join(__dirname, 'templates/controller.js') + ' >> ' + file)
    }
  }
})
modelWatcher.on('add', function (file) {
  let match = file.match(/\/(\w+)\.js$/)
  if (match && match[1]) {
    let stat = fs.statSync(file)
    if (!stat.size) {
      shell.exec('git add ' + file)
      fs.open(file, 'w+', function (err, fd) {
        if (err) {
          return
        }
        let name = match[1].replace(/^[a-z]/, function (s) {
          return s.toUpperCase()
        })
        fs.write(fd,
          modelTpl.replace(/__modelName__/g, name),
          function (err) {
            if (err) throw err
            fs.closeSync(fd)
          })
      })
    }
  }
})