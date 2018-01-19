import User from 'models/user'
export default async (ctx) => {
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