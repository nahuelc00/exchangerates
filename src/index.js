function getBaseSymbol() {
  const baseSymbol = $(".base-symbol").val();
  return baseSymbol;
}

function getRateDate() {
  const rateDate = $(".rate-date").val();
  return rateDate;
}

function fetchSymbols() {
  return fetch("https://api.exchangerate.host/symbols") 
  .catch(()=> console.error("Error al traer los símbolos"))
    .then((response) => response.json())
    .then((data) => {
      const symbols = Object.keys(data.symbols);
      return { symbols };
    });
}

function fetchRates(symbol, date) {
   return fetch(`https://api.exchangerate.host/${date}?base=${symbol}`) 
   .catch(()=> console.error("Error al traer los rates"))
   .then((response) => response.json())
   .then((data) => {
      if (data.base === symbol) {
        return { rates: data.rates };
      } else {
        return "La base ingresada no se encuentra disponible"
      }
   })
}

(function main() {
  const $form = $(".form-enter");

  $form.on("submit", (event) => {
    event.preventDefault();
    const baseSymbol = getBaseSymbol().toUpperCase();
    const dateOfRate = getRateDate();

    const validationOfSymbol = validateSymbol(baseSymbol);
    const validationOfDate = validateRateDate(dateOfRate);

    if (validationOfSymbol.error === "" && validationOfDate.error === "") {

       fetchSymbols().then((data) => {
          const symbols = data.symbols;
          const searchedSymbol = symbols.find((symbol) => symbol === baseSymbol);

          if (searchedSymbol !== undefined) {
            return { searchedSymbol };
          } else {
            console.log("No encontró el símbolo");
          }

        }).then((data) => {
          const symbol = data.searchedSymbol;
          
          fetchRates(symbol,dateOfRate).then((data)=>{
            if (data.rates) {
              const rates = data.rates;
              const keys = Object.keys(rates);

              keys.forEach((key)=>{
                const value = rates[key];
                const rate = key + " " + value;
                console.log(rate);
              })
            } else {
              console.log(data);
            }
          });
        });
    } else {
      console.log(validationOfSymbol.error);
      console.log(validationOfDate.error);
    }
    
  });
})();