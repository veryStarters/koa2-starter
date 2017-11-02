// 控制台log颜色
import 'colors'
export default {
  port: 9090,
  db: 'mongodb://127.0.0.1/demo',
  allowedOrigin: {
    'http://localhost:8080': true
  },
  needSocket: true,
  socketPort: 9999
}