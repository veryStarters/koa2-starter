export const cors = require('./cors')
export const requestLog = async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} ${ctx.status} ${ms}ms`.green)
}
