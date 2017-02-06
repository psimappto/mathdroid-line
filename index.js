const Bot = require('node-line-messaging-api')
const metadelta = require('metadelta')
const FuzzySet = require('fuzzyset.js')
const Messages = Bot.Messages

const keys = FuzzySet([].concat(Object.keys(metadelta)))
const SECRET = '8de21774bc46215db590f044549df3c6' // Line@ APP SECRET

const TOKEN = 'k8x3ixavhusSLf6wJZ84L/Fy/wzoymqk7a2+KqVp0bJCZwho053vltVE5WX1jpAe82463ktsz0SxCtGS+se2En/cS71H1WlGDrjx0jSz+COj/FHCAU/H98UUOWuNR2cLdVO3SxPkXiUADd8MHGmobgdB04t89/1O/w1cDnyilFU=' // Line@ issued TOKEN

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
    return bot.replyMessage(m.replyToken, noStatement.addText(`Queries must follow this structure: [COMMAND] [STATEMENT] ;)\n\nCannot process command ${command}.`).commit())
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
    result = `Result: ${computed}`
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
