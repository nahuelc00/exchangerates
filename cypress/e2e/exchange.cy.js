/// <reference types="cypress" />
/* global cy describe it context */

const URL = 'http://127.0.0.1:8080/';
const BASE_URL_API = 'https://api.exchangerate.host/';

function fetchSymbols() {
  return cy.request(`${BASE_URL_API}symbols`).then((response) => response.body);
}

function fetchRates(symbol, date) {
  return cy.request(`${BASE_URL_API}${date}?base=${symbol}`).then((response) => response.body);
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

context('Exchange', () => {
  it('verifies that the symbols are fetched from the API correctly and displayed correctly on the input select', () => {
    cy.visit(URL);
    fetchSymbols().then((data) => {
      const symbols = Object.keys(data.symbols);
      const symbolsAndDescriptions = [];

      symbols.forEach((symbol) => {
        symbolsAndDescriptions.push({
          symbol: data.symbols[symbol].code,
          description: data.symbols[symbol].description,
        });
      });

      cy.get('select option:disabled').first().should('have.attr', 'selected');
      cy.get('select option:disabled').first().should('have.attr', 'disabled');
      cy.get('select option:disabled').first().should('have.value', '');

      cy.get('select option:enabled').each(($option, index) => {
        const { symbol } = symbolsAndDescriptions[index];
        const { description } = symbolsAndDescriptions[index];
        cy.get($option).should('have.text', `${symbol} (${description})`);
      });
    });
  });

  it('verifies that when selecting a base symbol the text is correct and turns white', () => {
    cy.visit(URL);
    cy.get('select').select('USD').should('have.value', 'USD').contains('USD (United States Dollar)');
    cy.get('select').should('have.class', 'base-symbol-white');
  });

  describe('form errors', () => {
    it('verifies the errors at not enter data in the base and the date', () => {
      cy.visit(URL);

      cy.get('.form-enter__button-enter').click();

      cy.get('.form-enter__rate-date').should('have.class', 'is-invalid');
      cy.get('.form-enter__date-error').should('have.text', 'La fecha no puede estar vacía');

      cy.get('.form-enter__symbol-error').should('have.text', 'Debe seleccionar un símbolo');
      cy.get('.form-enter__base-symbols').should('have.class', 'is-invalid');
    });

    it('verifies the errors when enter incorrect data in the date', () => {
      // January 31 days     / February 29 days / March 31 days  / April 30 days
      // May 31 days        / June 30 days     / July 31 days    / August 31 days
      // September 30 days / Octuber 31 days  / November 30 days / December 31 days.

      // 31 days = 1 3 5 7 8 10 12
      // 30 days = 4 6 9 11
      // 28 days = 2

      const actualDate = getActualDate();
      const endOfYear = 12;
      let endOfMonth = 0;

      if (actualDate.month === 1 || actualDate.month === 3
        || actualDate.month === 5 || actualDate.month === 7
        || actualDate.month === 8 || actualDate.month === 10 || actualDate.month === 12
      ) {
        endOfMonth = 31;
      } else if (actualDate.month === 2) {
        endOfMonth = 28;
      } else {
        endOfMonth = 30;
      }

      cy.visit(URL);

      cy.get('.form-enter__rate-date').type(`${actualDate.year + 1}-12-24`);
      cy.get('.form-enter__button-enter').click();
      cy.get('.form-enter__date-error').should('have.text', 'El año ingresado es mayor al actual');
      cy.get('.form-enter__rate-date').should('have.class', 'is-invalid');

      if (actualDate.month !== endOfYear) {
        const futureMonth = actualDate.month + 1;

        if (futureMonth < 10) {
          const futureMonthToString = `0${futureMonth}`;

          cy.get('.form-enter__rate-date').type(`${actualDate.year}-${futureMonthToString}-24`);
          cy.get('.form-enter__button-enter').click();
          cy.get('.form-enter__date-error').should('have.text', 'El mes ingresado es mayor al actual');
          cy.get('.form-enter__rate-date').should('have.class', 'is-invalid');
        } else {
          cy.get('.form-enter__rate-date').type(`${actualDate.year}-${futureMonth}-24`);
          cy.get('.form-enter__button-enter').click();
          cy.get('.form-enter__date-error').should('have.text', 'El mes ingresado es mayor al actual');
          cy.get('.form-enter__rate-date').should('have.class', 'is-invalid');
        }
      }

      if (actualDate.day !== endOfMonth) {
        const futureDay = actualDate.day + 1;
        let actualMonthToString = '';

        if (actualDate.month < 10) {
          actualMonthToString = `0${actualDate.month}`;
        } else {
          actualMonthToString = actualDate.month.toString();
        }

        if (futureDay < 10) {
          const futureDayToString = `0${futureDay}`;
          cy.get('.form-enter__rate-date').type(`${actualDate.year}-${actualMonthToString}-${futureDayToString}`);
          cy.get('.form-enter__button-enter').click();
          cy.get('.form-enter__date-error').should('have.text', 'El día ingresado es mayor al actual');
          cy.get('.form-enter__rate-date').should('have.class', 'is-invalid');
        } else {
          cy.get('.form-enter__rate-date').type(`${actualDate.year}-${actualMonthToString}-${futureDay}`);
          cy.get('.form-enter__button-enter').click();
          cy.get('.form-enter__date-error').should('have.text', 'El día ingresado es mayor al actual');
          cy.get('.form-enter__rate-date').should('have.class', 'is-invalid');
        }
      }
    });

    it('verifies the error when enter a date correct (not valid) and a correct symbol', () => {
      cy.visit(URL);

      cy.get('.form-enter__rate-date').type('1994-03-22');
      cy.get('select').select('BTC');

      cy.get('.form-enter__button-enter').click();

      cy.get('.form-enter__base-symbols').should('have.class', 'is-valid');
      cy.get('.form-enter__rate-date').should('have.class', 'is-valid');
      cy.get('.form-enter__error').should('have.text', 'La fecha ingresada no es válida');
    });
  });

  describe('resolve app', () => {
    it('verifies that the form is valid and that rates container is visible', () => {
      cy.visit(URL);

      cy.get('select').select('USD');

      cy.get('.form-enter__rate-date').type('2012-03-22');

      cy.get('.form-enter__button-enter').click();

      cy.get('.form-enter__error').should('not.exist');

      cy.get('.form-enter__rate-date').should('have.class', 'is-valid');
      cy.get('.form-enter__date-error').should('have.text', '');

      cy.get('.form-enter__base-symbols').should('have.class', 'is-valid');
      cy.get('.form-enter__symbol-error').should('have.text', '');

      cy.get('.container-rates').should('not.have.class', 'visually-hidden');
    });

    it('verifies that the rates and symbols fetched from the api are displayed on the screen', () => {
      cy.visit(URL);

      cy.get('select').select('USD');

      cy.get('.form-enter__rate-date').type('2012-03-22');

      cy.get('.form-enter__button-enter').click();

      fetchRates('USD', '2012-03-22').then((data) => {
        const { rates } = data;
        const symbols = Object.keys(rates);

        symbols.forEach((symbol, index) => {
          const rate = rates[symbol];
          cy.get('.container-rates__symbol').eq(index).should('have.text', symbol);
          cy.get('.container-rates__rate').eq(index).should('have.text', rate.toFixed(2));
        });
      });
    });
  });
});
