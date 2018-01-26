import schedule from 'node-schedule'
export default {
  init(rule, callback) {
    if (!rule || !callback || (typeof callback !== 'function')) {
      return
    }
    let type = typeof rule
    if (type === 'string') {
      return schedule.scheduleJob(rule, callback)
    }
    if (type === 'object' ) {
      let ruleStr = []
      ruleStr.push(rule.second || '*')
      ruleStr.push(rule.minute || '*')
      ruleStr.push(rule.hour || '*')
      ruleStr.push(rule.dayOfMonth || '*')
      ruleStr.push(rule.month || '*')
      ruleStr.push(rule.dayOfWeek || '*')
      return schedule.scheduleJob(ruleStr.join(' '), callback)
    }
  }
}