import * as THREE from 'three';

import Arm from './Arm';
import Particles from './Particles';

export default class Home {
  constructor({ scene, screen }) {
    this.scene = scene;
    this.screen = screen;

    this.createLights();
    this.createArm();
    this.createParticles();

    this.show();
  }

  createLights() {
    this.ambientLight = new THREE.AmbientLight('#ff98a2');
    this.scene.add(this.ambientLight);

    const lightOneGroup = new THREE.Group();
    this.lightOne = new THREE.DirectionalLight(
      new THREE.Color('#ff98a2'),
      0.35
    );
    lightOneGroup.add(this.lightOne);
    lightOneGroup.position.set(-200, 150, 50);
    this.scene.add(lightOneGroup);

    const lightTwoGroup = new THREE.Group();
    this.lightTwo = new THREE.DirectionalLight(
      new THREE.Color('#ff98a2'),
      0.15
    );
    lightTwoGroup.add(this.lightTwo);
    lightTwoGroup.position.set(300, -100, 150);
    this.scene.add(lightTwoGroup);
  }

  createArm() {
    this.arm = new Arm({
      scene: this.scene,
      screen: this.screen,
      arm1: window.MODELS.arm1,
      arm2: window.MODELS.arm2,
    });

    this.arm.on('onTypeChange', (type) => this.onTypeChange(type));
  }

  createParticles() {
    this.particles = new Particles({
      scene: this.scene,
      width: this.screen.width,
      height: this.screen.height,
      depth: 500,
      count: 100,
      scale: 500,
      size: 150,
    });
  }

  /**
   * Animations.
   */
  show() {}

  hide() {
    let promise = new Promise((res) => res());

    return promise;
  }

  /**
   * Events.
   */
  onResize({ screen }) {
    if (this.arm && this.arm.onResize) {
      this.arm.onResize({ screen });
    }

    if (this.particles && this.particles.onResize) {
      this.particles.onResize({ screen });
    }
  }

  onWheel(scroll) {
    if (this.arm && this.arm.onWheel) {
      this.arm.onWheel(scroll);
    }

    if (this.particles && this.particles.onWheel) {
      this.particles.onWheel(scroll);
    }
  }

  onTypeChange(type) {
    if (type === 1) {
      this.ambientLight.color.set(new THREE.Color('#ff98a2'));

      this.lightOne.color.set(new THREE.Color('#ff98a2'));
      this.lightOne.intensity = 0.35;

      this.lightTwo.color.set(new THREE.Color('#ff98a2'));
      this.lightTwo.intensity = 0.15;
    } else {
      this.ambientLight.color.set(new THREE.Color('#b0b0b0'));

      this.lightOne.color.set(new THREE.Color('#efefef'));
      this.lightOne.intensity = 1;

      this.lightTwo.color.set(new THREE.Color('#efefef'));
      this.lightTwo.intensity = 1;
    }
  }

  /**
   * Loop.
   */
  update(elapsedTime) {
    if (this.arm && this.arm.update) {
      this.arm.update(elapsedTime);
    }

    if (this.particles && this.particles.update) {
      this.particles.update(elapsedTime);
    }
  }

  /**
   * Destroy.
   */
  destroy() {}
}
