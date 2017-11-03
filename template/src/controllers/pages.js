/**
 * Created by Webstorm.
 * @author taoqili
 * @date 2017/10/31
 * @desc
 * 简单的页面路由分发
 */
export default ctx => {
  let req = ctx.request
  let path = req.path.replace('/pages/', '') || 'index'
  let query = req.query
  return ctx.render(path, query || {})
}