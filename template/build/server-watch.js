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
  let match = file.match(/\/models\/(.*)\.js$/)
  if (match && match[1]) {
    let stat = fs.statSync(file)
    if (!stat.size) {
      shell.exec('git add ' + file)
      fs.open(file, 'w+', function (err, fd) {
        if (err) {
          return
        }
        let name = formatPathToName(match[1])
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

function formatPathToName(path) {
  // path = 'abc/def/jdk' > name = AbcDefJdk
  if (!path) return
  return path.replace(/(?:^[a-z])|(\/[a-z])/g, (s) => {
    return s.toUpperCase()
  }).replace(/\//g, '')
}