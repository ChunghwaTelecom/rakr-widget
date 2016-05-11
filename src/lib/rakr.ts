import {Widget} from './widget';
import {Prompter} from './prompter';

/**
 * Bootstapper.
 */
(function () {
  setTimeout(() => {
    try {
      new Widget()

    } catch (e) {
      Prompter.prompt(e.message);
    }
  }, 100);
})();
