import cors from './cors'

export const Cors = cors

export const RequestLog = async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url}  --  ${ms}ms`)
  console.log(`${JSON.stringify(ctx.response.body).replace(/\\/g, '')}`)
}
