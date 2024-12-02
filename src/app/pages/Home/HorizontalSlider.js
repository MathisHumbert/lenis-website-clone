import gsap from 'gsap';

import { getOffset } from '../../utils/dom';
import { clamp, map } from '../../utils/math';

export default class HorizontalSlider {
  constructor({ wrapperElement, element }) {
    this.wrapperElement = wrapperElement;
    this.element = element;
    this.items = element.children;

    this.size = { width: window.innerWidth, height: window.innerHeight };
    this.scroll = 0;
  }

  /**
   * Events.
   */
  onResize(size) {
    this.size = size;

    this.elementOffset = getOffset(this.element, this.scroll);
    this.wrapperElement.style.height = `${this.elementOffset.width}px`;

    this.wrapperOffset = getOffset(this.wrapperElement, this.scroll);
  }

  onWheel(scroll) {
    if (!this.wrapperOffset || !this.elementOffset) return;

    const start = this.wrapperOffset.top - this.size.height;

    const end =
      this.wrapperOffset.top + this.wrapperOffset.height - this.size.height;

    let progress = map(scroll, start, end, 0, 1);
    progress = clamp(0, 1, progress);

    const x = progress * (this.elementOffset.width - this.size.width);

    gsap.to(this.items, {
      x: -x,
      stagger: 0.033,
      ease: 'none',
      duration: 0,
    });

    this.scroll = scroll;
  }
}
