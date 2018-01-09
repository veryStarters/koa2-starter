export default async (ctx, next) => {
  try {
    ctx.body = 'User List'
  } catch(e) {
    console.log(e)
  }
}