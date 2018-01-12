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

let clients = []
const dispatch = (msg) => {
  clients.forEach(client => {
    try {
      client.ctx.websocket.send(msg)
    } catch (err) {
    }
  })
}
socketRouter.get('/websocket', (ctx) => {
  clients.push({
    ctx: ctx,
    createTime: Date.now(),
    updateTime: Date.now()
  })
  let rand = Math.floor(Math.random() * 100)
  rand = rand < 10 ? '0' + rand : rand
  let ip = address.ip()
  dispatch(`<span style="color: #333">来自[${address.ip()}]的<span style="color: green">用户_${rand}</span>加入了聊天室！</span>`)
  ctx.websocket.on('message', (message) => {
    message = JSON.parse(message || '{}')
    dispatch(`<span style="color: green">用户_${rand}: </span> <span style="color: red">${message.content}</span>`)
  })
  ctx.websocket.on('close', () => {
    clients = clients.filter(client => {
      return ctx !== client.ctx
    })
    dispatch(`<span style="color: green">[${ip}] 离开了聊天室！</span>`)
  })
})
app.ws.use(socketRouter.routes())
export default app
