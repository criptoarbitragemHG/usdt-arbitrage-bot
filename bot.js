
// 📦 Dependências: instale com
// npm install axios node-telegram-bot-api

const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Token do Bot e ID do Usuário
const TELEGRAM_TOKEN = 'SEU_TOKEN_AQUI';
const TELEGRAM_USER_ID = 'SEU_ID_AQUI';

const bot = new TelegramBot(TELEGRAM_TOKEN);

const THRESHOLD_PERCENT = 0.5;

async function getPriceBinance() {
  const res = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=USDTUSDT');
  return parseFloat(res.data.price);
}

async function getPriceKucoin() {
  const res = await axios.get('https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=USDT-USDT');
  return parseFloat(res.data.data.price);
}

async function getPriceMexc() {
  const res = await axios.get('https://api.mexc.com/api/v3/ticker/price?symbol=USDTUSDT');
  return parseFloat(res.data.price);
}

async function getPriceBitget() {
  const res = await axios.get('https://api.bitget.com/api/spot/v1/market/ticker?symbol=USDTUSDT');
  return parseFloat(res.data.data.close);
}

async function checkArbitrage() {
  try {
    const prices = await Promise.all([
      getPriceBinance(),
      getPriceKucoin(),
      getPriceMexc(),
      getPriceBitget()
    ]);

    const exchanges = ['Binance', 'KuCoin', 'Mexc', 'Bitget'];

    let opportunities = [];

    for (let i = 0; i < prices.length; i++) {
      for (let j = i + 1; j < prices.length; j++) {
        const diff = Math.abs(prices[i] - prices[j]);
        const percent = (diff / Math.min(prices[i], prices[j])) * 100;

        if (percent >= THRESHOLD_PERCENT) {
          opportunities.push(`💰 Arbitragem detectada entre ${exchanges[i]} e ${exchanges[j]}!
Preço ${exchanges[i]}: $${prices[i]}
Preço ${exchanges[j]}: $${prices[j]}
Diferença: ${percent.toFixed(2)}%`);
        }
      }
    }

    for (const msg of opportunities) {
      await bot.sendMessage(TELEGRAM_USER_ID, msg);
    }

    console.log('Verificado:', new Date().toLocaleTimeString());
  } catch (err) {
    console.error('Erro ao verificar arbitragem:', err.message);
  }
}

setInterval(checkArbitrage, 30000);
checkArbitrage();
const TELEGRAM_TOKEN = '7876107067:AAH_GN1FwdUAwF1nuOmxzF17fyiUZpcGHao';
const TELEGRAM_USER_ID = ' 996968304';
