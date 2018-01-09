export default async (ctx, next) => {
  try {
    ctx.body = 'Product Index'
  } catch(e) {
    console.log(e)
  }
}

export const list = async (ctx, next) => {
  try {
    ctx.body = 'Product List'
  } catch(e) {
    console.log(e)
  }
}

export const info = async (ctx, next) => {
  try {
    ctx.body = 'Product Info'
  } catch(e) {
    console.log(e)
  }
}
