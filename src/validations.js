/* eslint-disable import/extensions */
import { getActualDate, organizeDate } from './utilities.js';

function validateRateDate(dateValue) { // eslint-disable-line no-unused-vars
  const errors = {
    error: '',
  };

  if (dateValue === '') {
    errors.error = 'Date empty';
    return errors;
  }
  const actualDate = getActualDate();
  const dateOrganized = organizeDate(dateValue);

  if (dateOrganized.year > actualDate.year) {
    errors.error = 'Entered year is greater than the actual';
    return errors;
  } if (dateOrganized.year === actualDate.year && dateOrganized.month > actualDate.month) {
    errors.error = 'Entered month is greater than the actual';
    return errors;
  } if (dateOrganized.month === actualDate.month && dateOrganized.day > actualDate.day) {
    errors.error = 'Entered day is greater than the actual';
    return errors;
  }

  return errors;
}

function validateSymbol(symbolValue) { // eslint-disable-line no-unused-vars
  const errors = {
    error: '',
  };

  if (symbolValue === null) {
    errors.error = 'Select a symbol';
    return errors;
  }

  return errors;
}

function validateAmount(amount) {
  const errors = {
    error: '',
  };

  if (amount === 0) {
    errors.error = 'Select amount';
    return errors;
  }
  return errors;
}

export {
  validateRateDate, validateSymbol, validateAmount,
};
