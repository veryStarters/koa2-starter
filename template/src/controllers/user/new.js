/**
 * 本文件为接口定义文件，需export一个普通方法或者一个async方法，ctx参数为接口上下文环境，从中可以获取到本次请求的相关参数
 * 设置ctx.body即可向客户端response数据
 */
import User from 'models/user'
export default async ctx => {
  try {
    let name = ctx.request.query.name
    if (!name) {
      ctx.body = {errMsg: '缺少必要的参数'}
      return
    }
    let checkName = await User.findByName(name)
    if (checkName) {
      ctx.body = '用户' + checkName.name + '已经存在'
      return
    }
    let user = new User({
      name: name,
      age: Math.random()
    })
    let ret = await user.save()
    ctx.body = '用户' + ret.name + '创建成功'
  } catch (e) {
    console.log(e)
  }
}