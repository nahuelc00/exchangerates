/* eslint-disable import/extensions */
/* eslint no-console: ["error", { allow: ["assert"] }] */
import { validateSymbol, validateRateDate } from './validations.js';
import { getActualDate } from './utilities.js';

function testValidateSymbol() {
  console.assert(validateSymbol('USD').error === '', 'validate symbol failed when to inserted a valid symbol');
  console.assert(validateSymbol(null).error === 'Select a symbol', "validate symbol failed to validate: 'null'");
}

function testValidateRateDate() {
  const actualDate = getActualDate();

  console.assert(validateRateDate('').error === 'Date empty', 'validate date failed when to inserted an empty date');

  console.assert(validateRateDate(`${actualDate.year + 1}-04-23`).error === 'Entered year is greater than the actual', 'validate date failed when to inserted an year greater than the actual year');

  console.assert(validateRateDate(`${actualDate.year}-${actualDate.month + 1}-24`).error === 'Entered month is greater than the actual', 'validate date failed when to inserted a month greater than the actual month');

  console.assert(validateRateDate(`${actualDate.year}-${actualDate.month}-${actualDate.day + 1}`).error === 'Entered day is greater than the actual', 'validate date failed when to inserted a day greater than the actual day');
}

export function ejecuteTests() {
  testValidateRateDate();
  testValidateSymbol();
}
