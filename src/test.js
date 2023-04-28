function testValidateSymbol() {
  console.assert(validateSymbol("USD").error === "", "validate symbol failed when to inserted a valid symbol");
  console.assert(validateSymbol(null).error === "Debe seleccionar un símbolo", "validate symbol failed to validate: 'null'");
}


function testValidateRateDate() {
  // January 31 days     / February 29 days / March 31 days  / April 30 days 
  // May 31 days        / June 30 days     / July 31 days    / August 31 days  
  // September 30 days / Octuber 31 days  / November 30 days / December 31 days.

 // 31 days = 1 3 5 7 8 10 12
 // 30 days = 4 6 9 11
 // 28 days = 2
 
 const actualDate = getActualDate();

 const endOfYear = 12;
 let endOfMonth = 0;

 if (
   actualDate.month === 1 || actualDate.month === 3 || actualDate.month === 5 || actualDate.month === 7 ||
   actualDate.month === 8 || actualDate.month === 10 || actualDate.month === 12
 ) {
   endOfMonth = 31;
 } else if (actualDate.month === 2) {
   endOfMonth = 28;
 } else {
   endOfMonth = 30;
 }

 console.assert(validateRateDate("").error === "La fecha no puede estar vacía","validate date failed when to inserted an empty date");
 console.assert(validateRateDate(`${actualDate.year + 1}-04-23`).error ==="El año ingresado es mayor al actual","validate date failed when to inserted an year greater than the actual year");

 if (actualDate.month !== endOfYear) {
   console.assert(validateRateDate(actualDate.year + `-${actualDate.month + 1}-24`).error === "El mes ingresado es mayor al actual","validate date failed when to inserted a month greater than the actual month");
 }

 if (actualDate.day !== endOfMonth) {
   console.assert(validateRateDate(actualDate.year + `-${actualDate.month}-${actualDate.day + 1}`).error === "El día ingresado es mayor al actual","validate date failed when to inserted a day greater than the actual day");
 }

}

testValidateRateDate();
testValidateSymbol();
