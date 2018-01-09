import fs from 'fs'
import path from 'path'
import KoaRouter from 'koa-router'
export default (app, options) => {
  let opt = Object.assign({
    apiPrefix: '/api',
    apiRoot: path.join(__dirname, 'controllers/'),
    viewRoot: path.join(__dirname, 'pages/'),
    viewExt: 'html'
  }, options || {})
  let koaRouter = new KoaRouter({
    prefix: opt.apiPrefix
  })
  // 接口层次的私有middleWares只use到最顶层的路由即可
  const hasUsedMiddleWares = (() => {
    let routePaths = []
    return function (routePath) {
      let ret = false
      routePaths.forEach(item => {
        if (routePath.indexOf(item) === 0) {
          ret = true
        }
      })
      routePaths.push(routePath)
      console.log(JSON.stringify(routePaths))
      return ret
    }
  })()
  walk(opt.apiRoot)
  koaRouter.all('*', async (ctx) => {
    ctx.status = 404
    ctx.body = '404'
  })
  app.use(koaRouter.routes())
  app.use(koaRouter.allowedMethods())

  async function emptyAction (ctx, next) {
    await next()
  }
  function formatPath (fileName) {
    return fileName.replace(/.*\/controllers\//, '').replace(/\/index\.js$/, '');
  }

  function fixRoutePath(routePath, routeName) {
    if (routeName === 'index' || routeName === 'default') {
      return `/${routePath}`
    } else {
      return `/${routePath}/${routeName}`
    }
  }

  function setMiddleWare(middlewares, routePath) {
    if (middlewares.length) {
      if (!hasUsedMiddleWares(routePath)) {
        koaRouter.use(routePath, middlewares)
      }
    }
  }

  function walk(fileDir) {
    let fileList = fs.readdirSync(fileDir)
    fileList.forEach(function (file) {
      let fileName = path.join(fileDir, file)
      let stat = fs.statSync(fileName)
      if (stat.isFile()) {
        if (/index\.js$/.test(fileName)) {
          let routes = require(fileName)
          let middlewares = routes['middlewares'] || []
          Object.keys(routes).forEach(routeName => {
            let routePath = formatPath(fileName)
            if (routeName === 'middlewares') {
              return
            }
            let routeInfo = routes[routeName]
            if (typeof routeInfo === 'function') {
              routePath = fixRoutePath(routePath, routeName)
              setMiddleWare(middlewares, routePath)
              koaRouter.all(routePath, routeInfo)
            } else if (typeof routeInfo === 'object') {
              routePath = routeInfo.route || fixRoutePath(routePath, routeName)
              setMiddleWare(middlewares, routePath)
              koaRouter[routeInfo.method ? routeInfo.method : 'post'](routePath, routeInfo.action || emptyAction)
            }
          })
        }
      } else if (stat.isDirectory()) {
        walk(fileName)
      }
    })
  }
}