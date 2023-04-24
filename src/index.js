function renderSymbolsInSelect() {
  const $symbols = $(".base-symbols");
  fetchSymbols().then((data)=>{
    const symbols = data.symbols;
    symbols.forEach((symbol)=>{
      $symbols.append(`<option value="${symbol}">${symbol}</option>`)
    })
  })
}

function getBaseSymbol() {
  const baseSymbol = $(".base-symbols").val();
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
        return "La fecha ingresada no es válida";
      }
   })
}

function renderAndRemoveErrors(validationOfDate,validationOfSymbol) {

  if (validationOfSymbol.error) {
    $(".base-symbols").addClass("is-invalid").removeClass("border").removeClass("border-secondary");

    $(".base-symbols").hasClass("is-valid") ? $(".base-symbols")
    .removeClass("is-valid") : "";

    $(".symbol-error").text(validationOfSymbol.error);
  } else {
    $(".base-symbols").addClass("is-valid").removeClass("border").removeClass("border-secondary");;

    $(".base-symbols").hasClass("is-invalid") ? $(".base-symbols")
    .removeClass("is-invalid") : "";

    $(".symbol-error").text() !== "" ? $(".symbol-error").text("") : "";
  }

  if (validationOfDate.error) {
    $(".rate-date").addClass("is-invalid").removeClass("border").removeClass("border-secondary");

    $(".rate-date").hasClass("is-valid") ? $(".rate-date")
    .removeClass("is-valid") : "";

    $(".date-error").text(validationOfDate.error);
  } else {
    $(".rate-date").addClass("is-valid").removeClass("border").removeClass("border-secondary");

    $(".rate-date").hasClass("is-invalid") ? $(".rate-date")
    .removeClass("is-invalid") : "";

    $(".date-error").text() !== "" ? $(".date-error").text("") : "";
  }
}

(function main() {

  const $form = $(".form-enter");
   renderSymbolsInSelect();

  $form.on("submit", (event) => {
    event.preventDefault();

    const baseSymbol = getBaseSymbol();
    const dateOfRate = getRateDate();

    const validationOfDate = validateRateDate(dateOfRate);
    const validationOfSymbol = validateSymbol(baseSymbol);

    renderAndRemoveErrors(validationOfDate,validationOfSymbol);

    if (validationOfSymbol.error === "" && validationOfDate.error === "") {

       fetchSymbols().then((data) => {
         const symbols = data.symbols;
         const searchedSymbol = symbols.find((symbol) => symbol === baseSymbol);

         if (searchedSymbol !== undefined) {

           if ($(".error").text() !== "") {
             $(".error").remove();
             $(".container-errors").removeClass("mt-4");
           }

           fetchRates(searchedSymbol, dateOfRate).then((data) => {
             if (data.rates) {
              const rates = data.rates;
              const symbols = Object.keys(rates);
              const quantityOfRows = $(".row-rates").length;

              $(".container-rates").removeClass("invisible").addClass("visible");

              if ($(".symbol").length !== 0) {
                $(".symbol").each((index, $symbol) => {
                  $symbol.remove();
                });
              }

              if ($(".rate").length !== 0) {
                $(".rate").each((index, $rate) => {
                  $rate.remove();
                });
              }

               symbols.forEach((symbol, index) => {
                 const rate = rates[symbol];
                 if (index < Math.floor(symbols.length / quantityOfRows) + 1) {
                   $(".row-rates").eq(0).children(".container-symbols").append(`<div class="symbol text-center mb-2">${symbol}</div>`);
                   $(".row-rates").eq(0).children(".container-currency").append(`<div class="rate text-center mb-2">${Number(rate).toFixed(2)}</div>`);
                 } else if (index <(Math.floor(symbols.length / quantityOfRows) + 1) * 2) {
                   $(".row-rates").eq(1).children(".container-symbols").append(`<div class="symbol text-center mb-2">${symbol}</div>`);
                   $(".row-rates").eq(1).children(".container-currency").append(`<div class="rate text-center mb-2">${Number(rate).toFixed(2)}</div>`);
                 } else if (index <(Math.floor(symbols.length / quantityOfRows) + 1) * 3) {
                   $(".row-rates").eq(2).children(".container-symbols").append(`<div class="symbol text-center mb-2">${symbol}</div>`);
                   $(".row-rates").eq(2).children(".container-currency").append(`<div class="rate text-center mb-2">${Number(rate).toFixed(2)}</div>`);
                 }
               });
             } else {
               $(".error").text() !== "" ? $(".error").remove() : "";

               $(".container-errors").addClass("mt-4");
               $(".container-errors").append(
                 `<p class="error text-center m-0 text-danger">${data}</p>`
               );
             }
           });

         } else {

           $(".error").text() !== "" ? $(".error").remove() : "" 

           $(".container-errors").addClass("mt-4");
           $(".container-errors").append(`<p class="error text-center m-0 text-danger">No se encontró el símbolo</p>`);
         }
       });
    }     
  });
})();