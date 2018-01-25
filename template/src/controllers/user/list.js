import User from 'models/user'
export default async (ctx) => {
  try {
    let users = await User.findUsers()
    if (users && users.length) {
      ctx.body = {
        code: 0,
        msg: '',
        data: users
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '不存在任何用户',
        data: []
      }
    }
  } catch(e) {
    console.log(e)
  }
}