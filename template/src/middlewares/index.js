import colors from 'colors'
import cors from './cors'
export const Cors = cors
export const RequestLog = async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(colors.green(`${ctx.method} ${ctx.url} ${ctx.status} ${ms}ms`))
  console.log(colors.blue(`${JSON.stringify(ctx.response.body).replace(/\\/g, '')}`))
}
