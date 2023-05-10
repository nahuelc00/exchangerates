/* eslint-disable import/extensions */
import { listenSubmitForm, renderSymbolsInSelect } from './ui.js';

function main() {
  renderSymbolsInSelect().then(() => {
    listenSubmitForm();
  });
}
main();
