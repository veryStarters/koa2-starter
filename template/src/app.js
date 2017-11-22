import 'module-alias/register'
import Koa from 'koa'
import Router from 'koa-router'
import Static from 'koa-static'
import Body from 'koa-body'
import Views from 'koa-views'
import path from 'path'
import socket from './socket'
import * as routes from './controllers/router'
import * as middlewares from './middlewares'
import config from './config'

const app = new Koa()
app.use(Static(path.join(__dirname, config.staticPath)))
app.use(Body())
Object.values(middlewares).forEach(middleware => {
  app.use(middleware)
})
app.use(Views(path.join(__dirname, './pages'), {
  extension: 'ejs'
}))
const router = new Router()
const dispatcher = routes.dispatcher.default
router.get('/', dispatcher)
router.get('/pages*', dispatcher)
Object.keys(routes).forEach(routeName => {
  let routePath = '/api/' + routeName.replace(/([A-Z])/g, "/$1").toLowerCase()
  router.all(routePath, routes[routeName].default)
})
router.get('*', ctx => {
  ctx.body = '<p style="text-align: center; line-height: 2; font-size: 40px"> 4 0 4 <p>'
})
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(config.port || 9090, () => {
  console.log('HTTP服务启动成功，请访问: '.green + 'http://localhost:' + (config.port || 9090) + '/pages')
})
if (config.needSocket) {
  socket.listen(config.socketPort || 9999, () => {
    console.log('SOCKET服务启动成功，请访问: '.green + 'http://localhost:' + (config.port || 9090) + '/pages/chat-room')
  })
}