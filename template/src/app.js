import 'module-alias/register'
import 'babel-polyfill'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaStatic from 'koa-static'
import koaBody from 'koa-body'
import koaViews from 'koa-views'
import path from 'path'
import socket from './socket'
import * as routes from './controllers/routes'
import * as middleWares from './middlewares'
import dispatcher from './dispatcher'
import config from './config'
import './mongodb'

const app = new Koa()
app.use(koaStatic(path.join(__dirname, config.staticPath)))
app.use(koaBody({multipart: true}))
Object.values(middleWares).forEach(middleWare => {
  middleWare = typeof middleWare === 'function' ? middleWare : middleWare.default
  app.use(middleWare)
})
app.use(koaViews(path.join(__dirname, './pages'), {
  extension: 'html',
  map: {
    html: 'ejs'
  }
}))
const router = new KoaRouter()
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