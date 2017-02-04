const Bot = require('node-line-messaging-api')
const metadelta = require('metadelta')

const SECRET = '8de21774bc46215db590f044549df3c6' // Line@ APP SECRET

const TOKEN = 'k8x3ixavhusSLf6wJZ84L/Fy/wzoymqk7a2+KqVp0bJCZwho053vltVE5WX1jpAe82463ktsz0SxCtGS+se2En/cS71H1WlGDrjx0jSz+COj/FHCAU/H98UUOWuNR2cLdVO3SxPkXiUADd8MHGmobgdB04t89/1O/w1cDnyilFU=' // Line@ issued TOKEN

const PORT = process.env.PORT || 3002

// console.log(new Bot.default())
let bot = new Bot.default(SECRET, TOKEN, {port: PORT})
//
// // bot webhook succesfully started
bot.on('webhook', w => console.log(`bot listens on port ${w}.`))
//
// // on ANY events
bot.on('events', e => console.dir(e))
//
let msgs = new Messages()

msgs.addText('HELLO WORLD!').addText({text: 'harambe4lyf'})
// // on Message event
bot.on('message', m => {
  console.log(`incoming message: ${m.message}`)
  console.log(m.source[`${m.source.type}Id`])
  return bot.replyMessage(m.source[`${m.source.type}Id`], msgs.commit())
})


let msgs = new Messages()

msgs.addText('HELLO WORLD!').addText({text: 'harambe4lyf'})
