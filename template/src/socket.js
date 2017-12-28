/**
 * WebSocket 服务器
 */
import 'module-alias/register'
import Koa from 'koa'
import Router from 'koa-router'
import WebSocket from 'koa-websocket'
import address from 'address'
const app = WebSocket(new Koa())
const socketRouter = new Router()

let ctxes = []
const dispatch = (msg) => {
  ctxes.forEach(client => {
    try {
      client.websocket.send(msg)
    } catch (err) {
    }
  })
}
socketRouter.get('/websocket', (ctx) => {
  ctxes.push(ctx)
  dispatch('<span style="color: green">[' + address.ip() + '] 加入了聊天室！</span>')
  ctx.websocket.on('message', (message) => {
    message = JSON.parse(message || '{}')
    dispatch('<span style="color: green">[' + address.ip() + '] :</span> <span style="color: red">' + message.content + '</span>')
  })
  ctx.websocket.on('close', () => {
    ctxes = ctxes.filter(client => {
      return ctx !== client
    })
    dispatch('<span style="color: green">[' + address.ip() + '] 离开了聊天室！</span>')
  })
})
app.ws.use(socketRouter.routes())
export default app
