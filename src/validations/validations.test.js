// eslint-disable-next-line import/extensions
import { validateRateDate, validateSymbol, validateAmount } from './validations.js';
// eslint-disable-next-line import/extensions
import { getActualDate } from '../utilities/utilities.js';

test('If the value of symbol is null', () => {
  const validationOfSymbol = validateSymbol(null);
  expect(validationOfSymbol).toStrictEqual({
    error: 'Select a symbol',
  });
});

test('If the value of symbol is correct', () => {
  const validationOfSymbol = validateSymbol('USD');
  expect(validationOfSymbol).toStrictEqual({
    error: '',
  });
});

test('If amount is 0', () => {
  const validationOfAmount = validateAmount(0);
  expect(validationOfAmount).toStrictEqual({
    error: 'Select amount',
  });
});

test('If amount is correct', () => {
  const validationOfAmount = validateAmount(2000);
  expect(validationOfAmount).toStrictEqual({
    error: '',
  });
});

test('If the date is empty', () => {
  const validationOfDateValue = validateRateDate('');
  expect(validationOfDateValue).toStrictEqual({
    error: 'Date empty',
  });
});

test('If the year of the date is greater than the actual', () => {
  const actualDate = getActualDate();

  // YY MM DD
  const validationOfDateValue = validateRateDate(`${actualDate.year + 1}-04-10`);

  expect(validationOfDateValue).toStrictEqual({
    error: 'Entered year is greater than the actual',
  });
});

test('If the month of the date is greater than the actual', () => {
  const actualDate = getActualDate();
  let futureMonth = actualDate.month + 1;

  if (futureMonth < 10) {
    futureMonth = `0${futureMonth}`;
  }

  // YY MM DD
  const validationOfDateValue = validateRateDate(`${actualDate.year}-${futureMonth}-04`);

  expect(validationOfDateValue).toStrictEqual({
    error: 'Entered month is greater than the actual',
  });
});

test('If the day of the date is greater than the actual', () => {
  const actualDate = getActualDate();
  let futureDay = actualDate.day + 1;

  if (futureDay < 10) {
    futureDay = `0${futureDay}`;
  }

  // YY MM DD
  const validationOfDateValue = validateRateDate(`${actualDate.year}-${actualDate.month}-${futureDay}`);

  expect(validationOfDateValue).toStrictEqual({
    error: 'Entered day is greater than the actual',
  });
});

test('If the date is correct', () => {
  // YY MM DD
  const validationOfDateValue = validateRateDate('2020-04-21');

  expect(validationOfDateValue).toStrictEqual({
    error: '',
  });
});
