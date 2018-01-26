import config from 'config'
import getLogger from 'utils/getLogger'
/**
 * 导出外部中间件
 */
export const cors = require('./cors')

export const auth = require('./auth')

/**
 * 导出本地定义中间件
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
export const requestLog = async (ctx, next) => {
  let start = new Date()
  await next()
  let ms = new Date() - start
  let logger = getLogger('request ')
  let resLogger = getLogger('response')
  let {method, url, query} = ctx.request
  logger.info(`${method} ${decodeURIComponent(url)} ${ctx.status} ${ms}ms ${JSON.stringify(query || {})}`)  // ${ctx.request.headers['user-agent']}
  if (url.indexOf(config.apiPrefix) === 0) {
    resLogger.info(`${typeof ctx.body === 'object' ? JSON.stringify(ctx.body) : ctx.body }`)
  }
}

export const errorLog = async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    let logger = getLogger('runtime')
    logger.error(e)
    ctx.body = '系统异常, 请稍候再试!'
  }
}
