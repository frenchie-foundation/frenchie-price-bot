const getBEP20Info = require('../utils/bep20');
const getPriceFromPancake = require('./getPriceFromPancake');

async function getTokenInfo() {
  const bep20Info = await getBEP20Info();
  const price = await getPriceFromPancake();

  const marketcap = bep20Info.supply
    .multipliedBy(price.usdPrice)
    .toNumber()
    .toLocaleString();

  return {
    supply: bep20Info.supply.toNumber().toLocaleString(),
    decimals: bep20Info.decimals,
    price: price.usdPrice,
    marketcap,
  };
}

module.exports = getTokenInfo;
