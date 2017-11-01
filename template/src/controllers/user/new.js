/**
 * 本文件为接口定义文件，需export一个普通方法或者一个async方法，ctx参数为接口上下文环境，从中可以获取到本次请求的相关参数
 * 设置ctx.body即可向客户端response数据
 */
export default ctx => {
  ctx.body= 'hello, userNew! '
}