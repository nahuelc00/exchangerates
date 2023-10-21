/* eslint no-console: ["error", { allow: ["error"] }] */

const BASE_URL = 'https://api.apilayer.com/exchangerates_data';
const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;
const HEADER_OPTIONS = {
  headers: {
    apikey: API_KEY,
  },
};

async function getSymbols() {
  const response = await fetch(`${BASE_URL}/symbols`, HEADER_OPTIONS);
  const jsonData = await response.json();
  const symbols = Object.keys(jsonData.symbols);
  const symbolsAndDescription = [];

  symbols.forEach((symbol) => {
    const description = jsonData.symbols[symbol];
    symbolsAndDescription.push(
      {
        symbol,
        description,
      },
    );
  });

  return symbolsAndDescription;
}

async function getRates(symbol, date) {
  const response = await fetch(`${BASE_URL}/${date}?base=${symbol}`, HEADER_OPTIONS);
  const responseInJson = await response.json();
  if (responseInJson.base === symbol) {
    const keyCache = `${symbol}/${date}`;

    if (localStorage.getItem(keyCache)) {
      return JSON.parse(localStorage.getItem(keyCache));
    }
    localStorage.setItem(keyCache, JSON.stringify({
      rates: responseInJson.rates,
    }));
    return { rates: responseInJson.rates };
  }
  return { error: 'Date entered is not valid' };
}

async function getCurrencyConvertion(base, baseToConvert, amount) {
  const response = await fetch(
    `${BASE_URL}/convert?from=${base}&to=${baseToConvert}&amount=${amount}`,
    HEADER_OPTIONS,
  );
  const responseInJson = await response.json();
  return {
    result: responseInJson.result,
  };
}

export { getSymbols, getRates, getCurrencyConvertion };
