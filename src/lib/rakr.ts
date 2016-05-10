import {Widget} from './widget';

/**
 * Bootstapper.
 */
(function () {
  setTimeout(() => {
    try {
      new Widget()

    } catch (e) {
      alert(e.message);
    }
  }, 100);
})();
