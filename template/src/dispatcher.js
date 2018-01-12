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
  let koaRouter = new KoaRouter()
  const emptyAction = async (ctx, next) => {
    await next()
  }
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
      return ret
    }
  })()
  // 处理页面路由
  koaRouter.get('/*', async (ctx, next) => {
    let reqPath = ctx.request.path
    if(reqPath === '/') {
      reqPath = '/index'
    }
    let query = ctx.request.query
    if (reqPath.indexOf(opt.apiPrefix) === 0) {
      return next()
    }
    if (!fs.existsSync(path.join(opt.viewRoot, `${reqPath}.${opt.viewExt}`))) {
      return next()
    }
    await ctx.render(reqPath.substr(1), query)
  })
  koaRouter.all('/api', async (ctx, next) => {
    ctx.body = 'API List'
  })
  // 注册所有API路由
  registerApiRouter(opt.apiRoot)

  // 处理404
  koaRouter.all('*', async (ctx) => {
    ctx.status = 404
    await ctx.render('404')
  })
  app.use(koaRouter.routes())
  app.use(koaRouter.allowedMethods())

  function formatPath (fileName) {
    return fileName.replace(/.*\/controllers\//, '').replace(/\/index\.js$/, '');
  }

  function fixRoutePath(routePath, routeName) {
    if (routeName === 'index' || routeName === 'default') {
      return `${opt.apiPrefix}/${routePath}`
    } else {
      return `${opt.apiPrefix}/${routePath}/${routeName}`
    }
  }

  function setMiddleWare(middlewares, routePath) {
    if (middlewares.length) {
      if (!hasUsedMiddleWares(routePath)) {
        koaRouter.use(routePath, middlewares)
      }
    }
  }

  function registerApiRouter(apiDir) {
    let apiList = fs.readdirSync(apiDir)
    apiList.forEach(function (api) {
      let apiFileName = path.join(apiDir, api)
      let stat = fs.statSync(apiFileName)
      if (stat.isFile()) {
        if (/index\.js$/.test(apiFileName)) {
          let routes = require(apiFileName)
          let middlewares = routes['middlewares'] || []
          Object.keys(routes).forEach(routeName => {
            let routePath = formatPath(apiFileName)
            if (routeName === 'middlewares') {
              return
            }
            let routeInfo = routes[routeName]
            if (typeof routeInfo === 'function') {
              routePath = fixRoutePath(routePath, routeName)
              setMiddleWare(middlewares, routePath)
              koaRouter.all(routePath, routeInfo)
            } else if (typeof routeInfo === 'object') {
              routePath = `${opt.apiPrefix}${routeInfo.route}` || fixRoutePath(routePath, routeName)
              setMiddleWare(middlewares, routePath)
              koaRouter[routeInfo.method ? routeInfo.method : 'post'](routePath, routeInfo.action || emptyAction)
            }
          })
        }
      } else if (stat.isDirectory()) {
        registerApiRouter(apiFileName)
      }
    })
  }
}