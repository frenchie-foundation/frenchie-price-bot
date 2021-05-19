const { default: BigNumber } = require('bignumber.js');
const Web3 = require('web3');

const PancakeRouterABI = require('../assets/contracts/PancakeRouter.json');
const constants = require('../utils/constants');

const web3 = new Web3('https://bsc-dataseed.binance.org');

const pancakeRouter = new web3.eth.Contract(
  PancakeRouterABI,
  constants.PANCAKE_ROUTER_ADDRESS
);

BigNumber.config({ DECIMAL_PLACES: 99 });

async function getPriceFromPancake() {
  const amounts = await pancakeRouter.methods
    .getAmountsOut(new BigNumber(1e18).toString(), [
      constants.FREN_ADDRESS,
      constants.WBNB_ADDRESS,
      constants.USDT_ADDRESS,
    ])
    .call();

  const [, , usdtPrice] = amounts;

  const usdPrice = new BigNumber(usdtPrice).multipliedBy(1e-18).toString();

  return {
    usdPrice,
  };
}

module.exports = getPriceFromPancake;
