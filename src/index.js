function getSymbol() {
  const symbolRate = $(".symbol-rate").val();
  return symbolRate;
}

function getDateRate() {
  const dateRate = $(".date-rate").val();
  return dateRate;
}

function fetchSymbols() {
  return fetch("https://api.exchangerate.host/symbols")
    .then((response) => response.json())
    .then((data) => {
      const symbols = Object.keys(data.symbols);
      return { symbols };
    });
}

(function main() {
  const $form = $(".form-enter");

  $form.on("submit", (event) => {
    event.preventDefault();

    const symbolEntered = getSymbol();
    const dateEntered = getDateRate();

    const validationOfSymbol = validateSymbol(symbolEntered);
    const validationOfDate = validateDateRate(dateEntered);

    if (validationOfSymbol.error === "" && validationOfDate.error === "") {
  
    } else {
    }
    
  });
})();



