import gsap from 'gsap';
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
        featuring: '.featuring__section',
        featuringItems: '.featuring__cards__item',
        animationsParallax: '[data-animation="parallax"]',
      },
    });

    window.threshold = [];
    this.theme = 'dark';

    this.featuring = {
      start: 0,
      end: 0,
    };
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

    const featuringOffset = getOffset(this.elements.featuring, this.scroll);

    this.featuring.start = featuringOffset.top - this.size.height * 2;
    this.featuring.end =
      featuringOffset.top + featuringOffset.height - this.size.height;

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

    this.onSolutionWheel(scroll);

    this.onFeaturingWheel(scroll);
  }

  onSolutionWheel(scroll) {
    const start = this.solutionOffset.top + this.size.height * 0.5;
    const end =
      this.solutionOffset.top + this.solutionOffset.height - this.size.height;

    const center = 0.6;

    const progress = clamp(0, 1, mapRange(scroll, start, end, 0, 1));
    const progress1 = clamp(0, 1, mapRange(progress, 0, center, 0, 1));
    const progress2 = clamp(0, 1, mapRange(progress, center - 0.055, 1, 0, 1));

    this.elements.solution.style.setProperty('--progress1', progress1);
    this.elements.solution.style.setProperty('--progress2', progress2);

    if (progress2 === 1 && this.theme === 'dark') {
      this.theme = 'light';
      gsap.set(document.documentElement, {
        background: 'rgb(239, 239, 239)',
        color: 'rgb(0, 0, 0)',
      });
    }

    if (progress !== 1 && this.theme === 'light') {
      this.theme = 'dark';
      gsap.set(document.documentElement, {
        background: 'rgb(0, 0, 0)',
        color: 'rgb(239, 239, 239)',
      });
    }
  }

  onFeaturingWheel(scroll) {
    const progress = clamp(
      0,
      1,
      mapRange(scroll, this.featuring.start, this.featuring.end, 0, 1)
    );

    const step = Math.floor(progress * 10);

    each(this.elements.featuringItems, (element, index) => {
      if (index <= step - 1) {
        element.classList.add('current');
      } else {
        element.classList.remove('current');
      }
    });
  }
}
