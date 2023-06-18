class Symbols {
  constructor(symbolsData) {
    this.symbols = symbolsData.map((symbol) => symbol.symbol);
    this.descriptions = symbolsData.map((symbol) => symbol.description);
  }
}

export { Symbols };
