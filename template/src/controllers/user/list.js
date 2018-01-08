/**
 * 本文件为接口定义文件，需export一个普通方法或者一个async方法，ctx参数为接口上下文环境，从中可以获取到本次请求的相关参数
 * 设置ctx.body即可向客户端response数据
 */
import User from '../../models/user'
export default async ctx => {
  try {
    let users = await User.findUsers()
    ctx.body = 'hello, ' + JSON.stringify(users)
  } catch (e) {
    ctx.body = '121312'
    console.log(e)
  }
}