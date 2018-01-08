export default async (ctx, next) => {
  try {
    ctx.body = '产品列表'
  } catch (e) {
    console.log(e)
  }
}