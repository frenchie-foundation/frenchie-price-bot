const BigNumber = require('bignumber.js');
const Web3 = require('web3');

const ERC20 = require('../assets/contracts/ERC20.json');
const constants = require('./constants');

const web3 = new Web3('https://bsc-dataseed.binance.org');

async function getBEP20Info() {
  const erc20 = new web3.eth.Contract(ERC20, constants.FREN_ADDRESS);

  const supply = await erc20.methods.totalSupply().call();
  const decimals = await erc20.methods.decimals().call();

  return {
    supply: new BigNumber(supply).multipliedBy(10 ** -decimals),
    decimals,
  };
}

module.exports = getBEP20Info;
