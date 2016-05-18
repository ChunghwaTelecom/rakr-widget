import {Widget} from './widget';
import {Prompter} from './utils/prompter';

try {
  new Widget();

} catch (e) {
  console.error(e);
  Prompter.prompt(e.message);
}
