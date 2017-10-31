var fs = require('fs')
var path = require('path')
var readLine = require('readline')
var shell = require('shelljs')
var mkdirp = require('mkdirp')
var chokidar = require('chokidar')
var routeFile = path.join(__dirname, '../../server/controllers/router.js')
var controllerDir = path.join(__dirname, '../../server/controllers')
var template = require('./template/server-template.js')
var startTime = Date.now()
var blocks = {}
fs.writeFile(routeFile, '', function () {
})

var watcher = chokidar.watch(controllerDir, {
  ignored: /(^|[\/\\])\../
})

watcher.on('add', function (fileName) {
  if (/\.js$/.test(fileName)) {
    if (/router\.js$/.test(fileName)) {
      return
    }
    if (blocks[fileName]) {
      delete blocks[fileName]
      return;
    }
    var routePath = formatPath(fileName)
    var routeName = path2name(routePath)
    fs.appendFile(
      routeFile,
      `export const ${routeName} = require('../controllers/${routePath}')\n`,
      function (err) {
        if (err) throw err;
      }
    )
  }
})

watcher.on('unlink', function (fileName) {
  if (/\.js/.test(fileName)) {
    if (/router\.js$/.test(fileName)) {
      return
    }
    var path = formatPath(fileName)
    var name = path2name(path)
    var reg = new RegExp(`^export const ${name}.*$`, 'gi')
    shell.sed('-i', reg, '', routeFile);
  }
})

fs.watchFile(routeFile, {
  persistent: true,
  interval: 2
}, () => {
  var time = Date.now();
  if (time - startTime < 5000) {
    return;
  }
  var rd = readLine.createInterface({
    input: fs.createReadStream(routeFile),
    terminal: false
  });
  rd.on('line', function (line) {
    var matches = line.match(/require\('\.\/controllers\/(.*)'\)/)
    if (!matches || !matches[1]) return;
    var controllerPath = path.join(__dirname, '../../server/controllers', matches[1] )
    var controllerName = path2name(controllerPath.replace(/.*controllers\//, ''))
    var controllerFile = controllerPath + '.js'
    var controllerDir = controllerPath.substr(0, controllerPath.lastIndexOf('/') + 1)
    if (checkExitsAndEmpty(controllerDir)) {
      if (!checkExitsAndEmpty(controllerFile)) {
        blocks[controllerFile] = true;
        mkfile(controllerFile, controllerName)
      }
    } else {
      mkdirp(controllerDir, function (err) {
        if (!err) {
          blocks[controllerFile] = true;
          mkfile(controllerFile, controllerName, type)
        }
      })
    }
  })
});

function formatPath(fileName) {
  return fileName.replace(/.*\/controllers\//, '').replace(/\.js$/, '');
}
function path2name(path) {
  return path.replace(/\/(.{1})/g, function (a, b) {
    return b.toUpperCase();
  })
}
function mkfile(path, name) {
  fs.open(path, 'w+', function (err, fd) {
    if (err) {
      return;
    }
    shell.exec('git add ' + path)
    fs.write(fd,
      template['tpl'].replace(/<%name%>/gi, name),
      function (err) {
        if (err) throw err;
        fs.closeSync(fd);
      })
  })
}

function checkExitsAndEmpty(file) {
  var stat = null;
  try {
    stat = fs.statSync(file);
  } catch (e) {
    return false;
  }
  return stat.isFile() && stat.size || stat.isDirectory();
}