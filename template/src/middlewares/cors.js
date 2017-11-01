import config from '../config'
const allowedOrigin = config.allowedOrigin
export default async (ctx, next) => {
  let origin = ctx.get('Origin') || '*'
  if (!allowedOrigin || !allowedOrigin[origin]) {
    return await next()
  }
  ctx.set('Access-Control-Allow-Origin', origin)
  if (ctx.method === 'OPTIONS') {
    if (!ctx.get('Access-Control-Request-Method')) {
      return await next()
    }
    ctx.set('Access-Control-Allow-Credentials', 'true')
    ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'))
    ctx.status = 204  // No Content
  } else {
    if (origin === '*') {
      // `credentials` can't be true when the `origin` is set to `*`
      ctx.remove('Access-Control-Allow-Credentials')
    } else {
      ctx.set('Access-Control-Allow-Credentials', 'true')
    }
    try {
      await next()
    } catch (err) {
      throw err
    }
  }
}