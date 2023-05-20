/* eslint-disable import/extensions */
import * as formEnter from './ui/form-enter.js';
import * as formConvertion from './ui/form-convert.js';
// import { ejecuteTests } from './test.js';

function listenSubmitFormEnter() {
  formEnter.getAndRenderSymbolsInSelect().then(() => {
    formEnter.listenClickForChangeDateTextColor();
    formEnter.listenSubmitForm();
  });
}

function listenSubmitFormConvert() {
  formConvertion.getAndRenderSymbolsInSelect().then(() => {
    formConvertion.listenSubmitFormConvert();
  });
}

function main() {
  listenSubmitFormEnter();
  listenSubmitFormConvert();
  // ejecuteTests();
}
main();
