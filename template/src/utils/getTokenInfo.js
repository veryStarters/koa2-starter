import jwt from 'jwt-simple'
import config from 'config'
export default token => {
  // -1001 未登录，-2001 登录超时，-3001 校验异常
  try {
    if (token) {
      let tokenInfo = jwt.decode(token, config.tokenSecret)
      if (!tokenInfo) {
        return -3001
      }
      if (tokenInfo.expires < Date.now()) {
        return -2001
      }
      return tokenInfo
    } else {
      return -1001
    }

  } catch (e) {
    return -3001
  }
}