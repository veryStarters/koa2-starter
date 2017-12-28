/**
 * 本文件为接口定义文件，需export一个普通方法或者一个async方法，ctx参数为接口上下文环境，从中可以获取到本次请求的相关参数
 * 设置ctx.body即可向客户端response数据
 */
import User from 'models/user'
export default async ctx => {
  try {
    let name = ctx.request.query.name
    if (!name) {
      ctx.body = {
        errMsg: '缺少必要的参数'
      }
      return
    }
    let user = await User.findByName(name)
    if (user) {
      ctx.body = user
    } else {
      ctx.body = {
        errMsg: '无此用户信息'
      }
    }
  } catch (e) {
    console.log(e)
  }
}