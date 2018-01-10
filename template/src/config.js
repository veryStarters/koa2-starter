// 控制台log颜色
import 'colors'
export default {
  port: 9090,
  mongodbUri: {
    development: 'mongodb://127.0.0.1/demo',
    test: 'mongodb://127.0.0.1/demo',
  },
  redis: {
    development: {
      host: '127.0.0.1'
    },
    test: {
      host: '10.0.34.72',
      password: 'website#admin'
    }
  },
  allowedOrigin: {
    'http://localhost:8080': true
  },
  staticPath: 'static',
  needSocket: true,
  socketPort: 9999
}