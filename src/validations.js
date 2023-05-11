function organizeDate(dateValue) {
  const dateSeparated = dateValue.split('-');
  const year = Number(dateSeparated[0]);
  const month = Number(dateSeparated[1]);
  const day = Number(dateSeparated[2]);
  return {
    year,
    month,
    day,
  };
}

function getActualDate() {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = Number(currentDate.toString().split(' ')[2]);

  return {
    year: currentYear,
    month: currentMonth,
    day: currentDay,
  };
}

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

export { validateRateDate, validateSymbol, getActualDate };
