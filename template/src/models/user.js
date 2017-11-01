import db from 'db'
import UserSchema from 'schemas/user'
const UserModel = db.model('User', UserSchema)
UserModel.findByName = function (name) {
  return UserModel.find({
    name: name
  }).exec()
}
export default UserModel