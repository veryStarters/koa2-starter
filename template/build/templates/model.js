module.exports = `import mongoose from 'mongoose'

/**
 * 定义模型数据骨架
 */
const __modelName__Schema = new mongoose.Schema({

})

/**
 * 定义存储拦截器
 */
__modelName__Schema.pre("save",function(next) {
  next()
})

/**
 * 定义模型实例方法
 */
__modelName__Schema.method({
  log: function() {
    console.log('Hello, World!')
  }
})

/**
 * 定义模型静态方法
 */
__modelName__Schema.statics = {
  findById: function (id) {
    return this.findOne({_id: id})
  }
}

export default mongoose.model('__modelName__', __modelName__Schema)

`
