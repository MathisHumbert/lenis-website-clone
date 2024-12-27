import SplitType from 'split-type';

import Animation from '../classes/Animation';
import { wrapLines } from '../utils/text';

export default class Text extends Animation {
  constructor({ element }) {
    super({ element, elements: {} });

    this.elements.spans = new SplitType(this.element, {
      types: 'lines',
      tagName: 'span',
      lineClass: '',
    });
    wrapLines(this.elements.spans.lines, 'span');
  }

  animateIn() {
    this.element.classList.add('visible');

    super.animateIn();
  }

  animateOut() {
    super.animateOut();
  }
}
