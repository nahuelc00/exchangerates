/* eslint-disable import/extensions */
import { Symbols } from '../entities/symbols.js';

function mapSymbols(dataApi) {
  const symbols = dataApi.map((symbol) => symbol.symbol);
  const descriptions = dataApi.map((symbol) => symbol.description);

  const symbolsAndDescription = new Symbols(symbols, descriptions);
  return symbolsAndDescription;
}

export { mapSymbols };
