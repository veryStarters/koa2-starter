import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  id: Number,
  name: String,
  age: Number,
  gender: {
    type: String,
    default: '男'
  },
  createTime: Number,
  upDateTime: Number
})

UserSchema.pre("save",function(next){
  if(this.isNew) {
    this.createTime = this.upDateTime = Date.now()
  } else {
    this.upDateTime = Date.now()
  }
  next()
})

UserSchema.method({
  getName: function () {
    console.log(this.name)
  }
})

UserSchema.statics = {
  findByName: function (name) {
    return this.findOne({name: name})
  },
  findUsers: function () {
    return this.find()
  },
  removeByName: function (name) {
    return this.remove({name: name})
  }
}

export default mongoose.model('User', UserSchema)
