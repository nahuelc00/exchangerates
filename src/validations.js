function organizeDate(dateValue) {
  const dateSeparated = dateValue.split("-");
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
  const currentDay = Number(currentDate.toString().split(" ")[2]);

  return {
    year: currentYear,
    month: currentMonth,
    day: currentDay,
  };
}

function validateDateRate(dateValue) {
  const errors = {
    error: "",
  };

  if (dateValue === "") {
    errors.error = "La fecha no puede estar vacía";
    return errors;
  } else {
    const actualDate = getActualDate();
    const dateOrganized = organizeDate(dateValue);

    if (dateOrganized.year > actualDate.year) {
      errors.error = "El año ingresado es mayor al actual";
      return errors;
    } else if (dateOrganized.year === actualDate.year && dateOrganized.month > actualDate.month) {
      errors.error = "El mes ingresado es mayor al actual";
      return errors;
    } else if (dateOrganized.month === actualDate.month && dateOrganized.day > actualDate.day) {
      errors.error = "El día ingresado es mayor al actual";
      return errors;
    }
  }
  return errors;
}

function validateSymbol(symbolValue) {
  const hasNumbers = /([0-9])/.test(symbolValue);
  const hasOnlyLetters = /^[a-zA-Z0-9]+$/.test(symbolValue);
  const errors = {
    error: "",
  };

  if (symbolValue === "") {
    errors.error = "El símbolo no puede estar vacío";
    return errors;
  }
  if (symbolValue.length > 3) {
    errors.error = "El símbolo no puede tener más de tres caracteres";
    return errors;
  }
  if (hasOnlyLetters && !hasNumbers) {
    return errors;
  } else {
    errors.error = "El símbolo no puede tener caracteres especiales ni números";
    return errors;
  }
}
