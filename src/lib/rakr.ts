import {Widget} from './widget';
import {Prompter} from './prompter';

try {
  new Widget();

} catch (e) {
  Prompter.prompt(e.message);
}
