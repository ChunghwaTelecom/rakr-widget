import {Widget} from './widget';
import {Prompter} from './utils/prompter';

try {
  new Widget();

} catch (e) {
  Prompter.prompt(e.message);
}
