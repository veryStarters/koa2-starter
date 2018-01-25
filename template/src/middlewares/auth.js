// import User from 'models/user'
import config from 'config'
import getTokenInfo from 'utils/getTokenInfo'

// 无需权限校验的api
const needNotCheckAuthPath = {
  '/api/user/login': true
}
export default async (ctx, next) => {
  if (!config.needAuth) {
    await next()
    return
  }
  let { path, body, query } = ctx.request
  if (path in needNotCheckAuthPath || (path.indexOf('/api') !== 0 )) {
    await next()
    return
  }
  let token = body && body.accessToken || query && query.accessToken || ctx.request.headers['AccessToken']
  let tokenInfo = getTokenInfo(token)
  switch (tokenInfo) {
    case -1001:
      ctx.body = {
        code: -1001,
        msg: '当前用户未登录'
      }
      return
    case -2001:
      ctx.body = {
        code: -2001,
        msg: '登录超时'
      }
      return
    case -3001:
      ctx.body = {
        code: -3001,
        msg: '校验不通过'
      }
      return
    default:
      // let na me = tokenInfo.name
      // let userInfo = await User.findByName(name)
      // 此处可以更加细化权限判断，本demo直接通过
      await next()
  }
}