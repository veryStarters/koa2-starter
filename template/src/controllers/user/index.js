import User from 'models/user'

// // redis test case
// import {setCache, getCache, removeCache} from 'cache'
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

// user模块私有的middlewares
export const middlewares = [
  async (ctx, next) => {
    console.log('s1')
    await next()
    console.log('s2')
  },
  async (ctx, next) => {
    console.log('s3')
    await next()
    console.log('s4')
  }
]

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
        return
      }
      let user = await User.findByName(name)
      if (!user) {
        ctx.body = '找不到该用户'
        return
      }
      ctx.body = `你好，${user.name}`
    } catch (e) {
      console.log(e)
    }
  }
}

export const remove = {
  route: '/user/remove/:name?',
  method: 'get',
  action: async (ctx) => {
    console.log(ctx.params.name)
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

/**
 * 创建用户
 * @param ctx
 * @returns {Promise.<void>}
 */
export const add = async (ctx) => {
  try {
    let query = ctx.request.query
    let user = new User({
      name: query.name || '游客',
      age: query.age || 18
    })
    let ret = await user.save()
    ctx.body = ret && ret.name ? (ret.name + '创建成功') : (query.name + '创建失败')
  } catch (e) {
    console.log(e)
  }
}

