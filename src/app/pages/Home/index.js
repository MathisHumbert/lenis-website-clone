import Parallax from '../../animations/Parallax';
import Page from '../../classes/Page';
import { each, getOffset, map } from '../../utils/dom';
import { clamp, map as mapRange } from '../../utils/math';
import HorizontalSlider from './HorizontalSlider';

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      classes: {},
      element: '.home',
      elements: {
        why: '.why',
        rethinkCardsWrapper: '.rethink__cards__wrapper',
        rethinkCardsOverflow: '.rethink__cards__overflow',
        solution: '.solution',
        animationsParallax: '[data-animation="parallax"]',
      },
    });

    window.threshold = [];
  }

  create() {
    super.create();

    this.animationsParallax = map(
      this.elements.animationsParallax,
      (element) => new Parallax({ element })
    );

    this.horizontalSlider = new HorizontalSlider({
      wrapperElement: this.elements.rethinkCardsWrapper,
      element: this.elements.rethinkCardsOverflow,
    });
  }

  /**
   * Animations.
   */
  async show() {
    return super.show();
  }

  async hide() {
    return super.hide();
  }

  /**
   * Events.
   */
  onResize(size, fontSize) {
    super.onResize(size, fontSize);

    each(this.animationsParallax, (animation) => {
      if (animation && animation.onResize) {
        animation.onResize(size.width);
      }
    });

    if (this.horizontalSlider && this.horizontalSlider.onResize) {
      this.horizontalSlider.onResize(size);
    }

    this.solutionOffset = getOffset(this.elements.solution, this.scroll);

    window.threshold = [];

    window.threshold.push({ id: 'top', value: 0 });

    const whyRect = getOffset(this.elements.why, this.lenis.scroll);
    const whyRectTop = whyRect.top - size.height / 2;
    window.threshold.push({
      id: 'why-start',
      value: whyRectTop,
    });
    window.threshold.push({
      id: 'why-end',
      value: whyRectTop + whyRect.height,
    });
    window.threshold.push({ id: 'end', value: this.lenis.limit });
  }

  onWheel(event) {
    super.onWheel(event);

    const scroll = event.scroll;

    if (this.horizontalSlider && this.horizontalSlider.onWheel) {
      this.horizontalSlider.onWheel(scroll);
    }

    const start = this.solutionOffset.top + this.size.height * 0.5;
    const end =
      this.solutionOffset.top + this.solutionOffset.height - this.size.height;

    const center = 0.6;

    const progress = clamp(0, 1, mapRange(scroll, start, end, 0, 1));
    const progress1 = clamp(0, 1, mapRange(progress, 0, center, 0, 1));
    const progress2 = clamp(0, 1, mapRange(progress, center - 0.055, 1, 0, 1));

    this.elements.solution.style.setProperty('--progress1', progress1);
    this.elements.solution.style.setProperty('--progress2', progress2);
  }
}
