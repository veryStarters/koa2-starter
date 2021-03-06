import 'babel-polyfill'
import 'module-alias/register'
import Koa from 'koa'
import koaStatic from 'koa-static'
import koaBody from 'koa-body'
import koaViews from 'koa-views'
import path from 'path'
import * as middleWares from './middlewares'
import dispatcher from './dispatcher'
import config from 'config'
import socket from 'utils/socket'
import mongoConnect from 'utils/mongo'
import getLogger from 'utils/getLogger'
const logger = getLogger('app')
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
dispatcher(app, {
  apiPrefix: config.apiPrefix,
  apiRoot: path.join(__dirname, 'controllers/'),
  viewRoot: path.join(__dirname, 'pages/'),
  viewExt: 'html'
})
app.listen(config.port || 9090, () => {
  logger.info('HTTP服务启动成功, 请访问: ', 'http://localhost:' + (config.port || 9090))
})
if (config.needSocket) {
  socket.listen(config.socketPort || 9999, () => {
    logger.info('SOCKET服务启动成功, 请访问: ', 'http://localhost:' + (config.port || 9090) + '/chat-room')
  })
}
// 连接数据库
config.needMongodb && mongoConnect()
