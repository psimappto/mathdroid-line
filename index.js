const Bot = require('node-line-messaging-api')
const metadelta = require('metadelta')
const FuzzySet = require('fuzzyset.js')

const package = require('./package')
const Messages = Bot.Messages
const funcs = [].concat(Object.keys(metadelta))
const keys = FuzzySet(funcs)
const SECRET = '82c0056ca4312d125939533fb29e149f' // Line@ APP SECRET

const TOKEN = 'uvlk18Xh8Mb6XkyAiP3FKr820XKQRcv8BPFy1JZ01nu05+2l4iyfLihVMtPu+j9JDmw0DO+1d8NlhKUqdekRNEP9YzAOyN4zSvNZWnl8jQEhGKdtMuuTaSVzzvUuMSiB1Z+J8Qt7GJ12uiT2kQtCMwdB04t89/1O/w1cDnyilFU=' // Line@ issued TOKEN

const PORT = process.env.PORT || 3002

// console.log(new Bot.default())
let bot = new Bot(SECRET, TOKEN, { webhook: { port: PORT } })
//
// // bot webhook succesfully started
bot.on('webhook', w => console.log(`bot listens on port ${w}.`))
//
// // on ANY events
bot.on('events', (e, req) => console.dir(e, req))
//
// // on Message event
bot.on('text', m => {
  let msgs = new Messages()
  let query = m.message.text
  let [command, ...statement] = query.split(' ') || [query]
  if (statement.length < 1) {
    let noStatement = new Messages()
    return bot.replyMessage(m.replyToken, noStatement.addText(`Queries must follow this structure: [COMMAND] [EXPRESSION]\n\nCannot process command ${command}.`).commit())
  }
  let result = 'I currently cannot compute that.'
  // console.log(keys.get(command))
  let fuzzysearch = keys.get(command)
  let [confidence, method] = fuzzysearch && fuzzysearch[0] || []
  if (confidence > 0.5) {
    let computed
    if ('tangent' === method) {
      let [point] = statement.slice(-1)
      let func = statement.slice(0, -1)
      let tangent
      computed = metadelta[method](func.join(' '), point)
    } else if ('areaUnder' === method) {
      let [start, finish] = statement.slice(-2)
      let func = statement.slice(0, -2)
      computed = metadelta[method](func.join(' '), {start: start, finish: finish})
    } else {
      try {
        computed = metadelta[method](statement.join(' '))
      } catch(e) {
        console.log(e)
        if ('zeroes' === method) computed = `${statement.join(' ')} is not factorable :/`
      }
    }
    computed = computed || `No result for doing ${method} on ${statement.join(' ')}`
    result = `Operation: ${method}\nExpression: ${statement}\nResult: ${computed}`
  }
  msgs
    .addText(result)
  return bot.replyMessage(m.replyToken, msgs.commit()).then(resp => {
    console.log('success')
    console.log(resp)
  }).catch((err) => {
    console.log('fail')
    console.log(err)
  })
})
