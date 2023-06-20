/* eslint-disable import/extensions */
import { Rates } from '../entities/rates.js';

function mapRates(dataApi) {
  const rates = Object.values(dataApi.rates);
  const symbols = Object.keys(dataApi.rates);

  const ratesAndSymbols = new Rates(rates, symbols);
  return ratesAndSymbols;
}

export { mapRates };
