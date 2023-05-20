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

export { organizeDate, getActualDate };
