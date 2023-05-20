import { organizeDate, getActualDate } from './utilities';

test('Organize date that is obtained from input', () => {
  const date = '2022-11-26';
  const dateOrganized = organizeDate(date);
  expect(dateOrganized).toStrictEqual({
    year: 2022,
    month: 11,
    day: 26,
  });
});

test('Get the actual date', () => {
  const actualDate = getActualDate();

  // YY MM DD
  const today = new Date().toISOString().slice(0, 10);

  const dateActualOrganized = organizeDate(today);

  expect(actualDate).toStrictEqual({
    year: dateActualOrganized.year,
    month: dateActualOrganized.month,
    day: dateActualOrganized.day,
  });
});
