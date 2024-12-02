import gsap from 'gsap';
import { map } from '../utils/math';

export default class Parallax {
  constructor({ element }) {
    this.element = element;

    this.triggerElement = document.createElement('div');
    this.targetElement = document.createElement('div');

    this.element.parentNode.insertBefore(this.triggerElement, this.element);
    this.triggerElement.appendChild(this.targetElement);
    this.targetElement.appendChild(this.element);

    this.speed = this.element.dataset.speed;
    this.position = this.element.dataset.position;

    this.width = window.innerWidth;

    this.createParallax();
  }

  createParallax() {
    if (this.timeline) this.timeline.kill();

    const y = this.width * this.speed * 0.1;

    const setY = gsap.quickSetter(this.targetElement, 'y', 'px');
    const set3D = gsap.quickSetter(this.targetElement, 'force3D');

    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.triggerElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (e) => {
          if (this.position === 'top') {
            setY(e.progress * y);
          } else {
            setY(-map(e.progress, 0, 1, -y, y));
          }

          set3D(e.progress > 0 && e.progress < 1);
        },
      },
    });
  }

  onResize(width) {
    this.width = width;

    this.createParallax();
  }
}
