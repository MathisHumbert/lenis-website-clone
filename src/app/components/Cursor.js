import gsap from 'gsap';

import Component from '../classes/Component';
import { each } from '../utils/dom';

export default class Cursor extends Component {
  constructor() {
    super({
      element: '.cursor',
      elements: {
        container: '.cursor__container',
        inner: '.cursor__inner',
        pointer: document.querySelectorAll(
          "button,a,input,label,[data-cursor='pointer']"
        ),
      },
    });

    this.xTo = gsap.quickTo(this.elements.container, 'x', {
      duration: 0.6,
      ease: 'expo.out',
    });
    this.yTo = gsap.quickTo(this.elements.container, 'y', {
      duration: 0.6,
      ease: 'expo.out',
    });
  }

  /**
   * Events.
   */
  onTouchMove(event) {
    this.xTo(event.clientX);
    this.yTo(event.clientY);
  }

  addEventListeners() {
    each(this.elements.pointer, (element) => {
      element.addEventListener('mouseenter', () =>
        this.elements.inner.classList.add('pointer')
      );
    });

    each(this.elements.pointer, (element) => {
      element.addEventListener('mouseleave', () =>
        this.elements.inner.classList.remove('pointer')
      );
    });
  }
}
