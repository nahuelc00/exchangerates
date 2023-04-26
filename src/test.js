function testValidateSymbol() {
  console.assert(validateSymbol("USD").error === "", "validate symbol failed when to inserted a valid symbol");
  console.assert(validateSymbol(null).error === "Debe seleccionar un símbolo", "validate symbol failed to validate: 'null'");
}

function testValidateRateDate() {
    const futureDate = getActualDate();
    futureDate.year = futureDate.year + 1;
    futureDate.month = futureDate.month + 1;
    futureDate.day = futureDate.day + 1;

  console.assert(validateRateDate("").error === "La fecha no puede estar vacía", "validate date failed when to inserted an empty date");
  console.assert(validateRateDate(`${futureDate.year}-04-23`).error === "El año ingresado es mayor al actual", "validate date failed when to inserted an year greater than the actual year");
  console.assert(validateRateDate(`2023-${futureDate.month}-24`).error === "El mes ingresado es mayor al actual", "validate date failed when to inserted a month greater than the actual month");
  console.assert(validateRateDate(`2023-${getActualDate().month}-${futureDate.day}`).error === "El día ingresado es mayor al actual", "validate date failed when to inserted a day greater than the actual day");

}

testValidateRateDate();
testValidateSymbol();
