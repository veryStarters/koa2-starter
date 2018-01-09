import ListAction from './list'

// user模块私有的middlewares
export const middlewares = [
  async (ctx, next) => {
    console.log(1)
    await next()
    console.log(2)
  },
  async (ctx, next) => {
    console.log(3)
    await next()
    console.log(4)
  }
]

export default async (ctx, next) => {
  try {
    ctx.body = 'User Index'
  } catch (e) {
    console.log(e)
  }
}

export const info = {
  route: '/user/info/:id',
  method: 'get',
  action: async (ctx, next) => {
    try {
      ctx.body = 'User Info'
    } catch (e) {
      console.log(e)
    }
  }
}

export const list = ListAction