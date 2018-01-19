import jwt from 'jwt-simple'
import config from 'config'
import md5 from 'blueimp-md5'
import User from 'models/user'
export default async (ctx, next) => {
  try {
    let { name, password }  = ctx.request.body
    if (!name || !password) {
      ctx.body = '未输入用户名或者密码'
      return
    }
    password = md5(password)
    let userInfo = await User.findByName(name)
    if (!userInfo) {
      ctx.body = '不存在的用户'
      return
    }
    if (userInfo.password !== password) {
      ctx.body = '密码错误'
      return
    }
    ctx.body = {
      ret: 'success',
      code: 0,
      msg: '登录成功',
      data: {
        name: userInfo.name,
        accessToken: jwt.encode({
          id: userInfo._id,
          name: userInfo.name,
          expires: config.sessionDuration + Date.now()
        }, config.tokenSecret)
        // other: something else, such as permissions
      }
    }
  } catch (e) {
    console.log(e)
  }
}