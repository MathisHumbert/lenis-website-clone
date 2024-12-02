import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import Arm from './Arm';

export default class Home {
  constructor({ scene, screen }) {
    this.scene = scene;
    this.screen = screen;

    this.createLights();
    this.createArm();

    this.show();
  }

  createArm() {
    const loader = new GLTFLoader();

    loader.load('/models/arm.glb', (gltf) => {
      const { scene: arm1 } = gltf;
      this.arm = new Arm({ scene: this.scene, screen: this.screen, arm: arm1 });
    });
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight('#ff98a2');
    this.scene.add(ambientLight);

    const lightOneGroup = new THREE.Group();
    const lightOne = new THREE.DirectionalLight(
      new THREE.Color('#ff98a2'),
      0.35
    );
    lightOneGroup.add(lightOne);
    lightOneGroup.position.set(-200, 150, 50);
    this.scene.add(lightOneGroup);

    const lightTwoGroup = new THREE.Group();
    const lightTwo = new THREE.DirectionalLight(
      new THREE.Color('#ff98a2'),
      0.15
    );
    lightTwoGroup.add(lightTwo);
    lightTwoGroup.position.set(300, -100, 150);
    this.scene.add(lightTwoGroup);
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
  }

  onWheel(scroll) {
    if (this.arm && this.arm.onWheel) {
      this.arm.onWheel(scroll);
    }
  }

  /**
   * Loop.
   */
  update(scroll) {}

  /**
   * Destroy.
   */
  destroy() {}
}
