import md5 from 'blueimp-md5'
import jwt from 'jwt-simple'
import config from 'config'
import User from 'models/user'
import getLogger from 'utils/getLogger'
import getTokenInfo from 'utils/getTokenInfo'
// // redis test case
// import {setCache, getCache, removeCache} from 'utils/cache'
// setCache('AppName', 'Koa2-Starter')
//
// setTimeout(async () => {
//   let name = await getCache('AppName')
//   console.log(name)
//   removeCache('AppName')
//   setTimeout(async () => {
//     console.log(await getCache('AppName'))
//   })
// }, 2000)

const needNotCheckAuthPath = {
  '/api/user/login': true
}

const logger = getLogger('user')
// user模块私有的middlewares
export const middlewares = [
  async (ctx, next) => {
    let { path, body, query } = ctx.request
    console.log(path)
    console.log(md5(path))
    if (path in needNotCheckAuthPath) {
      await next()
      return
    }
    let token = body && body.accessToken || query && query.accessToken || ctx.request.headers['AccessToken']
    let tokenInfo = getTokenInfo(token)
    if (!tokenInfo) {
      ctx.body = '没有权限'
    } else {
      // 此处可以更加细化权限判断，本demo直接通过
      await next()
    }
  }
]

/**
 * 创建用户
 * @param ctx
 * @returns {Promise.<void>}
 */
export const add = async (ctx) => {
  try {
    let { name, password} = ctx.request.query
    if (!name || !password) {
      logger.info('新增用户信息时缺少关键的name或者password参数')
      ctx.body = '缺少必要的参数'
      return
    }
    let exist = await User.findByName(name)
    if (exist) {
      logger.info('新增用户时存在同名用户')
      ctx.body = '已经存在的用户名：' + name
      return
    }
    let ret = await User.addUser({
      ...ctx.request.query,
      name: name,
      password: md5(password)
    })
    ctx.body = name + '创建' + (ret && ret.name ? '成功' : '失败')
  } catch (e) {
    console.log(e)
  }
}

export const info = {
  route: '/user/info/:name?',
  method: 'get',
  /**
   * 用户信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  action: async (ctx) => {
    try {
      let name = ctx.params.name
      if (!name) {
        ctx.body = '缺少必要的参数'
        logger.info('请求用户信息时缺少name参数')
        return
      }
      let user = await User.findByName(name)
      if (!user) {
        ctx.body = '找不到该用户'
        logger.info('请求用户信息时未找到对应用户')
        return
      }
      ctx.body = {
        code: 0,
        msg: '',
        data: `你好，${user.getName()}`
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}

export const remove = {
  route: '/user/remove/:name?',
  method: 'get',
  action: async (ctx) => {
    let name = ctx.params.name
    if (name) {
      let res = await User.removeByName(name)
      let ret = res.result
      if (ret.ok && ret.n) {
        ctx.body = '用户删除成功'
      } else {
        ctx.body = '用户删除失败'
      }
    }
  }
}
/**
 * 用户列表
 * @param ctx
 * @returns {Promise.<void>}
 */
export const list = async (ctx) => {
  try {
    let users = await User.findUsers()
    if (users && users.length) {
      ctx.body = (() => {
        let ret = []
        users.forEach(user => {
          ret.push(user.name)
        })
        return '<p>' + ret.join('</p></p>') + '</p>'
      })()
    } else {
      ctx.body = '不存在任何用户'
    }
  } catch(e) {
    console.log(e)
  }
}

export const login = async (ctx, next) => {
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

/**
 * 用户首页，自动转向到list
 * @param ctx
 * @returns {Promise.<void>}
 */
export default async (ctx) => {
  try {
    ctx.redirect('/api/user/list')
  } catch (e) {
    console.log(e)
  }
}

