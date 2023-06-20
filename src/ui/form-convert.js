/* global  $ */
/* eslint-disable import/extensions */

import { validateSymbol, validateAmount } from '../validations/validations.js';
import { getCurrencyConvertion, getSymbols } from '../api/exchange.js';
import { mapSymbols } from '../mappers/mapSymbols.js';

async function getAndRenderSymbolsInSelect() {
  const $symbolsToConvert = $('.form-convert__base-symbols');
  const dataSymbols = mapSymbols(await getSymbols());

  dataSymbols.symbols.forEach((symbol) => {
    $symbolsToConvert.append(
      `<option value='${symbol}'>${symbol}</option>`,
    );
  });
}

function getSymbolFrom() {
  const $baseSymbolFrom = $('.form-convert__base-symbol-from');
  return $baseSymbolFrom.val();
}

function getSymbolTo() {
  const $baseSymbolTo = $('.form-convert__base-symbol-to');
  return $baseSymbolTo.val();
}

function getAmount() {
  const $amount = $('.form-convert__input-amount');
  return Number($amount.val());
}

function renderConvertResult(amount, baseSymbolFrom, baseSymbolTo, amountConverted) {
  const $containerResultConvert = $('.form-convert__container-result-convert');
  $containerResultConvert.empty();
  $containerResultConvert.append(
    `<p class="text-white text-center fw-medium m-0">${amount} ${baseSymbolFrom} ---> <span class="amount-converted-color">${amountConverted.toFixed()}</span> ${baseSymbolTo}</p>
`,
  );
}

function renderAndRemoveErrorsInForm(validationSymbolFrom, validationSymbolTo, validationAmount) {
  const $baseSymbolFrom = $('.form-convert__base-symbol-from');
  const $baseSymbolTo = $('.form-convert__base-symbol-to');
  const $amount = $('.form-convert__input-amount');

  if (validationSymbolFrom.error !== '') {
    $baseSymbolFrom.removeClass('border-black').addClass('border-danger');
  } else {
    $baseSymbolFrom.removeClass('border-black').addClass('border-success');
    $baseSymbolFrom.removeClass('border-danger').addClass('border-success');
  }

  if (validationSymbolTo.error !== '') {
    $baseSymbolTo.removeClass('border-black').addClass('border-danger');
  } else {
    $baseSymbolTo.removeClass('border-black').addClass('border-success');
    $baseSymbolTo.removeClass('border-danger').addClass('border-success');
  }

  if (validationAmount.error !== '') {
    $amount.removeClass('border-black').addClass('border-danger');
  } else {
    $amount.removeClass('border-black').addClass('border-success');
    $amount.removeClass('border-danger').addClass('border-success');
  }
}

function listenSubmitFormConvert() {
  const $form = $('.form-convert');
  $form.on('submit', (event) => {
    event.preventDefault();

    const baseSymbolFrom = getSymbolFrom();
    const baseSymbolTo = getSymbolTo();
    const amount = getAmount();

    const validationSymbolFrom = validateSymbol(baseSymbolFrom);
    const validationSymbolTo = validateSymbol(baseSymbolTo);
    const validationAmount = validateAmount(amount);

    const isFormValid = validationSymbolFrom.error === '' && validationSymbolTo.error === ''
    && validationAmount.error === '';

    renderAndRemoveErrorsInForm(validationSymbolFrom, validationSymbolTo, validationAmount);

    if (isFormValid) {
      getCurrencyConvertion(baseSymbolFrom, baseSymbolTo, amount).then((data) => {
        renderConvertResult(amount, baseSymbolFrom, baseSymbolTo, data.result);
      });
    }
  });
}

export { listenSubmitFormConvert, getAndRenderSymbolsInSelect };
