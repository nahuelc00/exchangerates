/* eslint no-console: ["error", { allow: ["assert"] }] */
import { validateSymbol, validateRateDate, getActualDate } from './validations';

function testValidateSymbol() {
  console.assert(validateSymbol('USD').error === '', 'validate symbol failed when to inserted a valid symbol');
  console.assert(validateSymbol(null).error === 'Debe seleccionar un símbolo', "validate symbol failed to validate: 'null'");
}

function testValidateRateDate() {
  const actualDate = getActualDate();

  console.assert(validateRateDate('').error === 'La fecha no puede estar vacía', 'validate date failed when to inserted an empty date');

  console.assert(validateRateDate(`${actualDate.year + 1}-04-23`).error === 'El año ingresado es mayor al actual', 'validate date failed when to inserted an year greater than the actual year');

  console.assert(validateRateDate(`${actualDate.year}-${actualDate.month + 1}-24`).error === 'El mes ingresado es mayor al actual', 'validate date failed when to inserted a month greater than the actual month');

  console.assert(validateRateDate(`${actualDate.year}-${actualDate.month}-${actualDate.day + 1}`).error === 'El día ingresado es mayor al actual', 'validate date failed when to inserted a day greater than the actual day');
}

testValidateRateDate();
testValidateSymbol();
