/// <reference types="cypress" />
/* global cy describe beforeEach expect it context */

const URL = 'http://127.0.0.1:8080/';
const BASE_URL_API = 'https://api.exchangerate.host/';

context('Exchange', () => {
  beforeEach(() => {
    cy.visit(URL);
  });

  describe('form-convertion', () => {
    it('verifies convertion', () => {
      cy.get('.form-convert__base-symbol-from').select('USD');
      cy.get('.form-convert__base-symbol-to').select('ARS');

      cy.get('.form-convert > button').click();

      cy.get('.form-convert__input-amount').should('have.class', 'border-danger');

      cy.get('.form-convert__input-amount').type('1000');

      cy.intercept(`${BASE_URL_API}convert?from=USD&to=ARS&amount=1000`)
        .as('getConvertion');

      cy.get('.form-convert > button').click();

      cy.wait('@getConvertion').then(({ response }) => {
        const amountConverted = response.body.result.toFixed(2);
        expect(response.statusCode).to.eq(200);
        cy.get('.form-convert__container-result-convert > p ')
          .should('have.text', `1000 USD ---> ${amountConverted} ARS`);
      });
    });
  });

  describe('form-rates', () => {
    it('verifies table of rates', () => {
      cy.get('.form-enter__base-symbols').select('USD');
      cy.get('.form-enter__button-enter').click();
      cy.get('.form-enter__rate-date').should('have.class', 'is-invalid');
      cy.get('.form-enter__rate-date').type('2012-03-22');

      cy.intercept(`${BASE_URL_API}2012-03-22?base=USD`).as('getRates');

      cy.get('.form-enter__button-enter').click();

      cy.get('.form-enter__rate-date').should('have.class', 'is-valid');
      cy.get('.container-rates').should('not.have.class', 'visually-hidden');

      cy.wait('@getRates').then(({ response }) => {
        const { rates } = response.body;
        const symbols = Object.keys(rates);

        symbols.forEach((symbol, index) => {
          const rate = rates[symbol].toFixed(2);
          cy.get('.container-rates__symbol').eq(index).should('have.text', symbol);
          cy.get('.container-rates__rate').eq(index).should('have.text', rate);
        });
      });
    });
  });
});
