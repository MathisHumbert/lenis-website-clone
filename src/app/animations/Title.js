import Animation from '../classes/Animation';
import { wrapLine } from '../utils/text';

export default class Title extends Animation {
  constructor({ element }) {
    super({ element, elements: { span: null } });

    wrapLine(this.element, 'span');

    this.elements.span = element.querySelector('span');

    this.rotate = element.dataset.rotate;
  }

  animateIn() {
    this.element.classList.add('visible');

    super.animateIn();
  }

  animateOut() {
    super.animateOut();
  }
}
