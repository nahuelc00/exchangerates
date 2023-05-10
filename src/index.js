/* eslint-disable import/extensions */
import {
  listenSubmitForm, renderSymbolsInSelect,
  listenClickForChangeBaseSymbolColor,
  listenClickForChangeDateTextColor,
} from './ui.js';

function main() {
  renderSymbolsInSelect().then(() => {
    listenClickForChangeBaseSymbolColor();
    listenClickForChangeDateTextColor();

    listenSubmitForm();
  });
}
main();
