/**
 * 本文件为接口定义文件，需export一个普通方法或者一个async方法，ctx参数为接口上下文环境，从中可以获取到本次请求的相关参数
 * 设置ctx.body即可向客户端response数据
 */
import UserModel from '../../models/user'
export default async ctx => {
  let users = await UserModel.findUsers('taoqili')
  console.log('user: ' + JSON.stringify(users))
  ctx.body= 'hello, ' + users[0].name
}