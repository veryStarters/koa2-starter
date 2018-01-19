import jwt from 'jwt-simple'
import config from 'config'

export default token => {
  try {
    if (token) {
      let tokenInfo = jwt.decode(token, config.tokenSecret)
      if (!tokenInfo || (tokenInfo.expires < Date.now())) {
        return
      }
      return tokenInfo
    }
  } catch (e) {
  }
}