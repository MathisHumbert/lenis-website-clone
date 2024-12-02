import * as THREE from 'three';

import Home from './Home';

export default class Canvas {
  constructor({ template, size }) {
    this.template = template;
    this.screen = size;

    this.createScene();
    this.createCamera();
    this.createRender();

    this.onResize(size);
  }

  /**
   * THREE.
   */
  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.OrthographicCamera(
      this.screen.width / -2,
      this.screen.width / 2,
      this.screen.height / 2,
      this.screen.height / -2,
      0.01,
      10000
    );
    this.camera.position.z = 1000;
  }

  createRender() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const canvasEl = document.querySelector('.canvas');

    canvasEl.appendChild(this.renderer.domElement);
  }

  /**
   * Home.
   */
  createHome() {
    this.home = new Home({
      scene: this.scene,
      screen: this.screen,
    });
  }

  destroyHome() {
    if (!this.home) return;

    this.home.destroy();
    this.home = null;
  }

  /**
   * Events.
   */
  onPreloaded() {
    this.onChangeEnd(this.template);
  }

  onLoaded(template) {
    this.onChangeEnd(template);
  }

  onChangeStart() {
    let promise;

    if (this.home) {
      promise = this.home.hide();
    }

    if (this.about) {
      promise = this.about.hide();
    }

    return promise;
  }

  onChangeEnd(template) {
    if (this.home) {
      this.destroyHome();
    }

    if (template === 'home') {
      this.createHome();
    }

    this.template = template;
  }

  onResize(size) {
    this.screen = size;

    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.left = this.screen.width / -2;
    this.camera.right = this.screen.width / 2;
    this.camera.top = this.screen.height / 2;
    this.camera.bottom = this.screen.height / -2;
    this.camera.updateProjectionMatrix();

    if (this.home && this.home.onResize) {
      this.home.onResize({ screen: this.screen });
    }
  }

  onTouchDown(event) {}

  onTouchMove(event) {}

  onTouchUp() {}

  onWheel({ scroll }) {
    if (this.home && this.home.onWheel) {
      this.home.onWheel(scroll);
    }
  }

  /**
   * Loop.
   */
  update(scroll, time) {
    if (this.home && this.home.update) {
      this.home.update(scroll);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
