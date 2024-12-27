import Animation from '../classes/Animation';

export default class Appear extends Animation {
  constructor({ element }) {
    super({ element, elements: {} });
  }

  animateIn() {
    this.element.classList.add('visible');

    super.animateIn();
  }

  animateOut() {
    super.animateOut();
  }
}
