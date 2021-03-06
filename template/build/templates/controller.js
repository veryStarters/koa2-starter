module.exports = `/**
 * 本文件为controller模板文件, 由脚手架自动生成，内置增、删、查、改等几个常用action。
 * 如不需要其中的某些接口action，直接删除即可
 * 默认情况下，路由规则为目录名称加action名，且action为async包裹的方法。
 * 如controllers/user/index.js文件中的info这个action，其访问路由为 /user/info
 * 若有restful风格路由或者其他路由需求时，可以修改action为一个对象，并通过设置route、method、action等属性来设置该路由，
 * 具体可参见如下的del这个action示例
 */

/**
 * 增
 * @param ctx
 * @returns {Promise}
 */
export const create = async (ctx) => {
  try {
    ctx.body = '增'
  } catch (e) {
    console.log(e)
  }
}

/**
 *
 * @param ctx
 * @returns {Promise}
 */
export const del = {
  route: '__delPrefixPath__/del/:id?',
  method: 'get',
  action: async (ctx) => {
    try {
      ctx.body = '删'
    } catch (e) {
      console.log(e)
    }
  }
}

/**
 * 查
 * @param ctx
 * @returns {Promise}
 */
export const info = async (ctx) => {
  try {
    ctx.body = '查'
  } catch (e) {
    console.log(e)
  }
}

/**
 * 改
 * @param ctx
 * @returns {Promise}
 */
export const update = async (ctx) => {
  try {
    ctx.body = '改'
  } catch (e) {
    console.log(e)
  }
}

/**
 * 默认，通常为list
 * @param ctx
 * @returns {Promise}
 */
export default async ctx => {
  try {
    ctx.body = 'hello, I am list!'
  } catch (e) {
    console.log(e)
  }
}

`