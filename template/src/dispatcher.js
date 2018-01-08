/**
 * Created by Webstorm.
 * @author taoqili
 * @date 2017/10/31
 * @desc 页面路由分发
 */
import fs from 'fs'
import path from 'path'

export default (options) => {
  let opt = Object.assign({
    apiPrefix: '/api',
    apiRoot: path.join(__dirname, 'controllers/'),
    viewRoot: path.join(__dirname, 'pages/'),
    viewExt: 'html'
  }, options || {})
  return async (ctx, next) => {
    try {
      let reqPath = ctx.request.path
      let reqType = reqPath.indexOf(opt.apiPrefix) === 0 ? 'api': 'page'
      if (reqType === 'api') {
        reqPath = reqPath.replace(new RegExp(`^${opt.apiPrefix}`), '')
        let apiPath = path.join(opt.apiRoot, reqPath)
        let exist = false
        if (/\/$/.test(apiPath)) {
          apiPath += 'index.js'
        } else {
          let tmpFile = apiPath + '.js'
          exist = fs.existsSync(tmpFile)
          if (exist) {
            apiPath = tmpFile
          } else {
            apiPath += '/index.js'
          }
        }
        exist = fs.existsSync(apiPath)
        if (exist) {
          let action = require(apiPath)
          action.default && await action.default(ctx, next)
          delete require.cache[apiPath]
        } else {
          ctx.status = 404
          await ctx.render('404')
        }
      } else {
        let viewPath = path.join(opt.viewRoot, reqPath)
        let exist = false
        if (/\/$/.test(viewPath)) {
          viewPath += `index.${opt.viewExt}`
        } else {
          let tmpFile = viewPath + `.${opt.viewExt}`
          exist = fs.existsSync(tmpFile)
          if (exist) {
            viewPath = tmpFile
          } else {
            viewPath += `/index.${opt.viewExt}`
          }
        }
        exist = fs.existsSync(viewPath)
        if (exist) {
          await ctx.render(reqPath.substr(1), ctx.request.query)
        } else {
          ctx.status = 404
          await ctx.render('404')
        }
      }
    } catch (e) {
      await ctx.body = '系统异常'
      console.log('系统异常')
    }
  }
}