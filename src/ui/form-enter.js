/* global  $ */
/* eslint-disable import/extensions */

import { getRates, getSymbols } from '../api/exchange.js';
import { validateRateDate, validateSymbol } from '../validations/validations.js';

async function getAndRenderSymbolsInSelect() {
  const $symbols = $('.form-enter__base-symbols');
  const symbols = await getSymbols();

  symbols.forEach((symbolAndDescription) => {
    const { symbol } = symbolAndDescription;
    const { description } = symbolAndDescription;
    $symbols.append(
      `<option value='${symbol}'>${symbol} (${description})</option>`,
    );
  });
}

function listenClickForChangeDateTextColor() {
  const $rateDate = $('.form-enter__rate-date');
  $rateDate.on('click', () => {
    $rateDate.addClass('text-white');
    $rateDate.off();
  });
}

function renderAndRemoveSymbolErrorEntered(validationOfSymbol) {
  if (validationOfSymbol.error) {
    $('.form-enter__base-symbols')
      .addClass('is-invalid')
      .removeClass('border')
      .removeClass('border-secondary');

    // eslint-disable-next-line no-unused-expressions
    $('.form-enter__base-symbols').hasClass('is-valid')
      ? $('.form-enter__base-symbols').removeClass('is-valid')
      : '';

    $('.form-enter__symbol-error').text(validationOfSymbol.error);
  } else {
    $('.form-enter__base-symbols')
      .addClass('is-valid')
      .removeClass('border')
      .removeClass('border-secondary');

    // eslint-disable-next-line no-unused-expressions
    $('.form-enter__base-symbols').hasClass('is-invalid')
      ? $('.form-enter__base-symbols').removeClass('is-invalid')
      : '';

    // eslint-disable-next-line no-unused-expressions
    $('.form-enter__symbol-error').text() !== ''
      ? $('.form-enter__symbol-error').text('')
      : '';
  }
}

function renderAndRemoveDateErrorEntered(validationOfDate) {
  if (validationOfDate.error) {
    $('.form-enter__rate-date')
      .addClass('is-invalid')
      .removeClass('border')
      .removeClass('border-secondary');

    // eslint-disable-next-line no-unused-expressions
    $('.form-enter__rate-date').hasClass('is-valid') ? $('.form-enter__rate-date').removeClass('is-valid') : '';

    $('.form-enter__date-error').text(validationOfDate.error);
  } else {
    $('.form-enter__rate-date').addClass('is-valid').removeClass('border').removeClass('border-secondary');
    // eslint-disable-next-line no-unused-expressions
    $('.form-enter__rate-date').hasClass('is-invalid') ? $('.form-enter__rate-date').removeClass('is-invalid') : '';
    // eslint-disable-next-line no-unused-expressions
    $('.form-enter__date-error').text() !== '' ? $('.form-enter__date-error').text('') : '';
  }
}

function removeErrorOfDateInvalid() {
  if ($('.form-enter__error').text() !== '') {
    $('.form-enter__error').remove();
    $('.form-enter__container-errors').removeClass('mt-4');
  }
}

function renderErrorOfDateInvalid(dataRatesError) {
  $('.form-enter__container-errors').addClass('mt-4');
  $('.form-enter__container-errors').append(
    `<p class='form-enter__error text-center m-0 text-danger'>${dataRatesError}</p>`,
  );
}

function removeSymbols() {
  if ($('.container-rates__symbol').length !== 0) {
    $('.container-rates__symbol').each((index, $symbol) => {
      $symbol.remove();
    });
  }
}

function removeRates() {
  if ($('.container-rates__rate').length !== 0) {
    $('.container-rates__rate').each((index, $rate) => {
      $rate.remove();
    });
  }
}

function renderColumnsOfRatesAndSymbols(symbol, rate, positionOfColumn) {
  $('.container-rates__column-rates')
    .eq(positionOfColumn)
    .children('.container-rates__container-symbols')
    .append(
      `<div class='container-rates__symbol text-center mb-2'>${symbol}</div>`,
    );
  $('.container-rates__column-rates')
    .eq(positionOfColumn)
    .children('.container-rates__container-currency')
    .append(
      `<div class='container-rates__rate text-center mb-2'>${Number(
        rate,
      ).toFixed(2)}</div>`,
    );
}

function getBaseSymbol() {
  const baseSymbol = $('.form-enter__base-symbols').val();
  return baseSymbol;
}

function getRateDate() {
  const rateDate = $('.form-enter__rate-date').val();
  return rateDate;
}

function scrollingToContainerRates() {
  $([document.documentElement, document.body]).animate({
    scrollTop: $('.container-rates').offset().top,
  });
}

async function getAndRenderRates(baseSymbol, dateOfRate) {
  const dataRates = await getRates(baseSymbol, dateOfRate);

  if (dataRates.rates) {
    $('.container-rates').removeClass('visually-hidden');

    removeSymbols();
    removeRates();

    const { rates } = dataRates;
    const symbols = Object.keys(rates);
    const quantityOfRows = $('.container-rates__column-rates').length;
    const ratesToRenderPerRow = Math.round(symbols.length / quantityOfRows) + 1;

    symbols.forEach((symbol, index) => {
      const rate = rates[symbol];

      if (index < ratesToRenderPerRow) {
        renderColumnsOfRatesAndSymbols(symbol, rate, 0);
      } else if (index < ratesToRenderPerRow * 2) {
        renderColumnsOfRatesAndSymbols(symbol, rate, 1);
      } else if (index < ratesToRenderPerRow * 3) {
        renderColumnsOfRatesAndSymbols(symbol, rate, 2);
      }
    });
    scrollingToContainerRates();
  } else {
    renderErrorOfDateInvalid(dataRates.error);
  }
}

function listenSubmitForm() {
  const $form = $('.form-enter');

  $form.on('submit', (event) => {
    event.preventDefault();

    const baseSymbol = getBaseSymbol();
    const dateOfRate = getRateDate();
    const validationOfDate = validateRateDate(dateOfRate);
    const validationOfSymbol = validateSymbol(baseSymbol);

    renderAndRemoveSymbolErrorEntered(validationOfSymbol);
    renderAndRemoveDateErrorEntered(validationOfDate);

    if (validationOfSymbol.error === '' && validationOfDate.error === '') {
      removeErrorOfDateInvalid();
      getAndRenderRates(baseSymbol, dateOfRate);
    }
  });
}

export {
  getAndRenderSymbolsInSelect,
  listenSubmitForm,
  listenClickForChangeDateTextColor,
};
