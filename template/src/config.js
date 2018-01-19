// 控制台log颜色
import 'colors'
export default {
  port: 9090,
  needSocket: true,
  socketPort: 9999,
  staticPath: 'static',
  allowedOrigin: {
    'http://localhost:8080': true
  },
  tokenSecret: 'jc12345678',
  sessionDuration: 60 * 60 * 1000,
  mongodbUri: {
    development: 'mongodb://127.0.0.1/demo',
    test: 'mongodb://127.0.0.1/demo',
    pre: 'mongodb://127.0.0.1/demo',
    production: 'mongodb://127.0.0.1/demo',
  },
  redis: {
    development: {
      host: '127.0.0.1'
    },
    test: {
      host: '10.0.34.72',
      password: 'website#admin'
    },
    pre: {
      host: '10.0.34.72',
      password: 'website#admin'
    },
    production: {
      host: '10.0.34.72',
      password: 'website#admin'
    }
  }
}