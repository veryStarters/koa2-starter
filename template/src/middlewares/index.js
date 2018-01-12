/**
 * 导出外部中间件
 */
export const cors = require('./cors')

/**
 * 导出本地定义中间件
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
export const requestLog = async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} ${ctx.status} ${ms}ms`.green)
}
