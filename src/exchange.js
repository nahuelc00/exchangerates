/* eslint no-console: ["error", { allow: ["error"] }] */

const BASE_URL = 'https://api.exchangerate.host';

async function getSymbols() {
  const response = await fetch(`${BASE_URL}/symbols`);
  const jsonData = await response.json();
  const symbols = Object.keys(jsonData.symbols);
  const symbolsAndDescription = [];

  symbols.forEach((symbol) => {
    const descriptionAndSymbol = jsonData.symbols[symbol];
    symbolsAndDescription.push(
      {
        symbol: descriptionAndSymbol.code,
        description: descriptionAndSymbol.description,
      },
    );
  });

  return symbolsAndDescription;
}

async function getRates(symbol, date) {
  const response = await fetch(`${BASE_URL}/${date}?base=${symbol}`);
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
  return { error: 'La fecha ingresada no es válida' };
}

export { getSymbols, getRates };
