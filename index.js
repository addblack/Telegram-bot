const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
// replace the value below with the Telegram token you receive from @BotFather
const token = '767428576:AAHsG7RqdfnoIMJFm3yvYYih5kKD5qp5Auo';
 
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/curse/, (msg, match) => {
 
  const chatId = msg.chat.id;
 
  bot.sendMessage(chatId, 'Танюша, какая валюта вас интересует?' , {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "€ - EUR",
            callback_data: 'EUR'
          },
          {
            text: "$ - USD",
            callback_data: 'USD'
          },
          {
            text: "₽ - RUR",
            callback_data: 'RUR'
          },
          {
            text: "₿ - BTC",
            callback_data: 'BTC'
          },
        ]
      ]
    }
  });
});

bot.on('callback_query', query => {
  /* All here -  console.log(query); */
  const id = query.message.chat.id;

  request('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11', function(error, response, 
  body) {
    const data = JSON.parse(body);
    const result = data.filter(item => item.ccy === query.data)[0];
    const flag = {
      'EUR': '🇪🇺',
      'USD': '🇺🇸', 
      'RUR': '🇷🇺',
      'UAH': '🇺🇦',
      'BTC': '💰'
    }
    let md = `
      Курси для Тані
      * ${flag[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${flag[result.base_ccy]}*
      Buy: _${result.buy}_
      Sell: _${result.sale}_
    `;
    bot.sendMessage(id, md, {parse_node: "Markdown"});   
  })
});


 /*
 This is for default message 
// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
 
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Привіт, Танюша');
});
*/