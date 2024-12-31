import Component from '../classes/Component';

export default class ScrollBar extends Component {
  constructor() {
    super({
      element: '.scrollbar',
      elements: { inner: '.scrollbar__inner' },
    });
  }

  onWheel({ scroll, limit }) {
    const progress = Number((scroll / limit).toFixed(4));
    this.elements.inner.style.setProperty('--scaleX', progress);
  }
}
