import mongoose from 'mongoose'

/**
 * 定义模型数据骨架
 */
const AnimalTigerSchema = new mongoose.Schema({

})

/**
 * 定义存储拦截器
 */
AnimalTigerSchema.pre("save", (next) => {
  next()
})

/**
 * 定义模型实例方法
 */
AnimalTigerSchema.method({
  log() {
    console.log('Hello, World!')
  }
})

/**
 * 定义模型静态方法
 */
AnimalTigerSchema.statics = {
  findById(id) {
    return this.findOne({_id: id})
  }
}

export default mongoose.model('AnimalTiger', AnimalTigerSchema)

