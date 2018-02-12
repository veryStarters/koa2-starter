import User from 'src/models/user'
import config from 'config'

test('read config', () => {
  expect(config.needSocket).toBe(true)
})

test('create user', () => {
  let user = new User({
    name: 'taoqili'
  })
  expect(user.getName()).toBe('taoqili')
})
