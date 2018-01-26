import fs from 'fs'
import path from 'path'
import KoaRouter from 'koa-router'
import config from 'config'
export default (app, options) => {
  let opt = Object.assign({
    apiPrefix: config.apiPrefix,
    apiRoot: path.join(__dirname, 'controllers/'),
    viewRoot: path.join(__dirname, 'pages/'),
    viewExt: 'html'
  }, options || {})
  let pagePrefix = config.pagePrefix
  let koaRouter = new KoaRouter()
  const emptyAction = async (ctx, next) => {
    await next()
  }
  // 处理页面路由
  koaRouter.get(pagePrefix + '*', async (ctx, next) => {
    let reqPath = ctx.request.path
    if(reqPath === pagePrefix || reqPath === pagePrefix + '/') {
      reqPath = pagePrefix + '/index'
    }
    let query = ctx.request.query
    let pagePath = reqPath.substr(pagePrefix.length + 1)
    if (!fs.existsSync(path.join(opt.viewRoot, `${pagePath}.${opt.viewExt}`))) {
      return next()
    }
    await ctx.render(pagePath, query)
  })

  koaRouter['all'](config.apiPrefix, async (ctx) => {
    ctx.body = 'API List'
  })
  // 注册所有API路由
  registerApiRouter(opt.apiRoot)

  // 处理404
  koaRouter['all']('*', async (ctx) => {
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

  function registerApiRouter(apiDir) {
    let apiList = fs.readdirSync(apiDir)
    apiList.forEach(function (api) {
      let apiFileName = path.join(apiDir, api)
      let stat = fs.statSync(apiFileName)
      if (stat.isFile()) {
        if (/index\.js$/.test(apiFileName)) {
          let routes = require(apiFileName)
          Object.keys(routes).forEach(routeName => {
            let routePath = formatPath(apiFileName)
            let routeInfo = routes[routeName]
            if (typeof routeInfo === 'function') {
              routePath = fixRoutePath(routePath, routeName)
              koaRouter.all(routePath, routeInfo)
            } else if (typeof routeInfo === 'object') {
              routePath = `${opt.apiPrefix}${routeInfo.route}` || fixRoutePath(routePath, routeName)
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