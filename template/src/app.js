import 'module-alias/register'
import 'babel-polyfill'
import Koa from 'koa'
import koaStatic from 'koa-static'
import koaBody from 'koa-body'
import koaViews from 'koa-views'
import path from 'path'
import socket from './socket'
import * as middleWares from './middlewares'
import initRouter from './initRouter'
import config from './config'
import './mongo'

// redis demo
// import {setCache, getCache} from 'cache'
// setCache('AppName', 'Koa2-Starter')
//
// setTimeout(async () => {
//   let name = await getCache('AppName')
//   console.log(name)
// }, 2000)

const app = new Koa()
app.use(koaStatic(path.join(__dirname, config.staticPath)))
app.use(koaViews(path.join(__dirname, './pages'), {
  extension: 'html',
  map: {
    html: 'ejs'
  }
}))
app.use(koaBody({multipart: true}))
Object.values(middleWares).forEach(middleWare => {
  middleWare = typeof middleWare === 'function' ? middleWare : middleWare.default
  app.use(middleWare)
})
initRouter(app, {
  apiPrefix: '/api',
  apiRoot: path.join(__dirname, 'controllers/'),
  viewRoot: path.join(__dirname, 'pages/'),
  viewExt: 'html'
})
app.listen(config.port || 9090, () => {
  console.log('HTTP服务启动成功，请访问: '.green, 'http://localhost:' + (config.port || 9090))
})
if (config.needSocket) {
  socket.listen(config.socketPort || 9999, () => {
    console.log('SOCKET服务启动成功，请访问: '.green, 'http://localhost:' + (config.port || 9090) + '/chat-room')
  })
}