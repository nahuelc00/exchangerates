/* global  $ */
/* eslint no-console: ["error", { allow: ["error"] }] */
const BASE_URL = 'https://api.exchangerate.host';

function getSymbols() {
  return fetch(`${BASE_URL}/symbols`)
    .catch(() => console.error('Failed to fetch symbols'))
    .then((response) => response.json())
    .then((data) => {
      const symbols = Object.keys(data.symbols);
      const symbolsAndDescriptions = [];

      symbols.forEach((symbol) => {
        symbolsAndDescriptions.push({
          symbol: data.symbols[symbol].code,
          description: data.symbols[symbol].description,
        });
      });

      return symbolsAndDescriptions;
    });
}

function renderSymbolsInSelect() {
  const $symbols = $('.form-enter__base-symbols');
  getSymbols().then((data) => {
    data.forEach((symbolAndDescription) => {
      const { symbol } = symbolAndDescription;
      const { description } = symbolAndDescription;
      $symbols.append(
        `<option class='text-white' value='${symbol}'>${symbol} (${description})</option>`,
      );
    });
  });
}

function listenClickForChangeBaseSymbolColor($baseSymbol) {
  $baseSymbol.on('click', () => {
    $baseSymbol.addClass('base-symbol-white');
    $baseSymbol.off();
  });
}

function listenClickForChangeDateTextColor($rateDate) {
  $rateDate.on('click', () => {
    $rateDate.addClass('text-white');
    $rateDate.off();
  });
}

function getBaseSymbol() {
  const baseSymbol = $('.form-enter__base-symbols').val();
  return baseSymbol;
}

function getRateDate() {
  const rateDate = $('.form-enter__rate-date').val();
  return rateDate;
}

function getRates(symbol, date) {
  return fetch(`${BASE_URL}/${date}?base=${symbol}`)
    .catch(() => console.error('Failed to fetch rates'))
    .then((response) => response.json())
    .then((data) => {
      if (data.base === symbol) {
        return { rates: data.rates };
      }
      return 'La fecha ingresada no es válida';
    });
}

function renderAndRemoveErrors(validationOfDate, validationOfSymbol) {
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

function main() {
  const $form = $('.form-enter');

  const $baseSymbol = $('.form-enter__base-symbols');
  const $rateDate = $('.form-enter__rate-date');

  listenClickForChangeBaseSymbolColor($baseSymbol);
  listenClickForChangeDateTextColor($rateDate);

  renderSymbolsInSelect();

  $form.on('submit', (event) => {
    event.preventDefault();

    const baseSymbol = getBaseSymbol();
    const dateOfRate = getRateDate();
    /* global validateRateDate validateSymbol */
    const validationOfDate = validateRateDate(dateOfRate);
    const validationOfSymbol = validateSymbol(baseSymbol);

    renderAndRemoveErrors(validationOfDate, validationOfSymbol);

    if (validationOfSymbol.error === '' && validationOfDate.error === '') {
      if ($('.form-enter__error').text() !== '') {
        $('.form-enter__error').remove();
        $('.form-enter__container-errors').removeClass('mt-4');
      }

      // eslint-disable-next-line no-shadow
      getRates(baseSymbol, dateOfRate).then((data) => {
        if (data.rates) {
          $('.container-rates').removeClass('visually-hidden');

          if ($('.container-rates__symbol').length !== 0) {
            $('.container-rates__symbol').each((index, $symbol) => {
              $symbol.remove();
            });
          }

          if ($('.container-rates__rate').length !== 0) {
            $('.container-rates__rate').each((index, $rate) => {
              $rate.remove();
            });
          }

          const { rates } = data;
          const symbols = Object.keys(rates);
          const quantityOfRows = $('.container-rates__column-rates').length;
          const ratesToRenderPerRow = Math.round(symbols.length / quantityOfRows) + 1;

          symbols.forEach((symbol, index) => {
            const rate = rates[symbol];

            if (index < ratesToRenderPerRow) {
              $('.container-rates__column-rates')
                .eq(0)
                .children('.container-rates__container-symbols')
                .append(
                  `<div class='container-rates__symbol text-center mb-2'>${symbol}</div>`,
                );
              $('.container-rates__column-rates')
                .eq(0)
                .children('.container-rates__container-currency')
                .append(
                  `<div class='container-rates__rate text-center mb-2'>${Number(
                    rate,
                  ).toFixed(2)}</div>`,
                );
            } else if (index < ratesToRenderPerRow * 2) {
              $('.container-rates__column-rates')
                .eq(1)
                .children('.container-rates__container-symbols')
                .append(
                  `<div class='container-rates__symbol text-center mb-2'>${symbol}</div>`,
                );
              $('.container-rates__column-rates')
                .eq(1)
                .children('.container-rates__container-currency')
                .append(
                  `<div class='container-rates__rate text-center mb-2'>${Number(
                    rate,
                  ).toFixed(2)}</div>`,
                );
            } else if (index < ratesToRenderPerRow * 3) {
              $('.container-rates__column-rates')
                .eq(2)
                .children('.container-rates__container-symbols')
                .append(
                  `<div class='container-rates__symbol text-center mb-2'>${symbol}</div>`,
                );
              $('.container-rates__column-rates')
                .eq(2)
                .children('.container-rates__container-currency')
                .append(
                  `<div class='container-rates__rate text-center mb-2'>${Number(rate).toFixed(2)}</div>`,
                );
            }
          });
        } else {
          // eslint-disable-next-line no-unused-expressions
          $('.error').text() !== '' ? $('.error').remove() : '';

          $('.form-enter__container-errors').addClass('mt-4');
          $('.form-enter__container-errors').append(
            `<p class='form-enter__error text-center m-0 text-danger'>${data}</p>`,
          );
        }
      });
    }
  });
}
main();
