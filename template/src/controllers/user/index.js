import md5 from 'blueimp-md5'
import User from 'models/user'
import List from './list'
import Login from './login'
import getLogger from 'utils/getLogger'
import config from 'config'
const logger = getLogger('user')
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

export const remove = {
  route: '/user/remove/:name?',
  method: 'get',
  /**
   * 删除用户
   * @param ctx
   * @returns {Promise.<void>}
   */
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

export const info = {
  route: '/user/info/:name?',
  method: 'get',
  /**
   * 查询用户信息
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
    }
  }
}

/**
 * 用户列表
 * @param ctx
 * @returns {Promise.<void>}
 */
export const list = List


export const login = Login

/**
 * 用户首页，自动转向到list
 * @param ctx
 * @returns {Promise.<void>}
 */
export default async (ctx) => {
  try {
    ctx.redirect(config.apiPrefix + '/user/list')
  } catch (e) {
    console.log(e)
  }
}

// redis test case
// import {setCache, getCache, removeCache} from 'utils/cache'
// setCache('AppName', 'Koa2-Starter', 1)
//
// setTimeout(async () => {
//   let name = await getCache('AppName')
//   console.log(name, 1)
//   setTimeout(async () => {
//     console.log(await getCache('AppName'), 2)
//   }, 1000)
//   removeCache('AppName').then(() => {
//     console.log('删除成功')
//   })
//   setTimeout(async () => {
//     console.log(await getCache('AppName'), 3)
//   })
// }, 500)
