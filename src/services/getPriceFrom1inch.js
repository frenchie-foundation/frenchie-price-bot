const { default: axios } = require('axios');

async function getPriceFrom1inch() {
  try {
    const { data } = await axios.get(
      'https://api.1inch.exchange/v3.0/56/quote?toTokenAddress=0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d&fromTokenAddress=0x13958e1eb63dfb8540eaf6ed7dcbbc1a60fd52af&amount=10000000000000000'
    );
    const usdPrice = data.toTokenAmount / data.fromTokenAmount;

    return {
      usdPrice,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

module.exports = getPriceFrom1inch;
