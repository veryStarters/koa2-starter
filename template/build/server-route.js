var fs = require('fs')
var path = require('path')
var routeFile = path.join(__dirname, '../src/controllers/router.js')
var dir = path.join(__dirname, '../src/controllers/')
fs.writeFile(routeFile, '', function () {
  walk(dir)
})
function walk(fileDir) {
  var fileList = fs.readdirSync(fileDir);
  fileList.forEach(function (file) {
    var fileName = path.join(fileDir, file)
    if (fs.statSync(fileName).isFile()) {
      if (/\.js$/.test(fileName)) {
        if (/router\.js$/.test(fileName)) {
          return
        }
        var routePath = formatPath(fileName);
        var routeName = path2name(routePath);
        fs.appendFile(
          routeFile,
          `export const ${routeName} = require('../controllers/${routePath}')\n`,
          function (err) {
            if (err) throw err;
          }
        );
      }
    } else if (fs.statSync(fileName).isDirectory()) {
      walk(fileName)
    }
  });
}

function formatPath(fileName) {
  return fileName.replace(/.*\/controllers\//, '').replace(/\.js$/, '');
}
function path2name(path) {
  return path.replace(/\/(.{1})/g, function (a, b) {
    return b.toUpperCase();
  })
}