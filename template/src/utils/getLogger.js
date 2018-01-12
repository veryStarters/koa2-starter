import path from 'path'
import mkdirp from 'mkdirp'
import log4 from 'koa-log4'

const logDir = path.join(__dirname, '../../', 'logs')  //配置目标路径 logs
try {
  mkdirp(logDir)
} catch (err) {
  console.error('Could not set up log directory, error was: ', err)
  process.exit(1)
}
log4.configure({
  appenders: {
    console: {
      type: 'console'
    },
    access: {
      type: 'DateFile',
      filename: path.join(logDir,'Log'),
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      category: 'access'
    }
  },
  categories: {
    default: {
      appenders: ['console', 'access'],
      level: 'info'
    }
  }
})
export const log4js = log4
export default (name) => {
  return log4.getLogger(name)
}