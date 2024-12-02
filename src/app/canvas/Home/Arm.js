import * as THREE from 'three';

import { map } from '../../utils/math';

const steps = [
  {
    position: [-0.1, -1.75, 0],
    scale: 0.045,
    rotation: [0, Math.PI * 0.5, 0],
    type: 1,
  },
  {
    position: [0.15, -0.4, 0],
    scale: 0.02,
    rotation: [
      THREE.MathUtils.degToRad(-45),
      THREE.MathUtils.degToRad(-135),
      THREE.MathUtils.degToRad(-45),
    ],
    type: 1,
  },
  {
    position: [0.15, -0.4, 0],
    scale: 0.02,
    rotation: [
      THREE.MathUtils.degToRad(45),
      THREE.MathUtils.degToRad(-315),
      THREE.MathUtils.degToRad(-45),
    ],
    type: 1,
  },
  {
    position: [-0.2, -0.35, 0],
    scale: 0.02,
    rotation: [
      THREE.MathUtils.degToRad(-90),
      THREE.MathUtils.degToRad(-405),
      THREE.MathUtils.degToRad(-45),
    ],
    type: 1,
  },
  {
    position: [-1.2, -0.6, 0],
    scale: 0.05,
    rotation: [
      THREE.MathUtils.degToRad(-90),
      THREE.MathUtils.degToRad(-405),
      THREE.MathUtils.degToRad(-45),
    ],
    type: 1,
  },
  {
    position: [-1.6, -0.6, 0],
    scale: 0.05,
    rotation: [
      THREE.MathUtils.degToRad(-90),
      THREE.MathUtils.degToRad(-405),
      THREE.MathUtils.degToRad(-45),
    ],
    type: 1,
  },
  {
    position: [0.16, -1.38, 0],
    scale: 0.05,
    rotation: [
      THREE.MathUtils.degToRad(0),
      THREE.MathUtils.degToRad(200),
      THREE.MathUtils.degToRad(-16),
    ],
    type: 2,
  },
  {
    position: [0, -0.68, 0],
    scale: 0.04,
    rotation: [
      THREE.MathUtils.degToRad(0),
      THREE.MathUtils.degToRad(-14),
      THREE.MathUtils.degToRad(-16),
    ],
    type: 2,
  },
  {
    position: [-0.22, -0.61, 0],
    scale: 0.03,
    rotation: [
      THREE.MathUtils.degToRad(0),
      THREE.MathUtils.degToRad(-(157 + 360)),
      THREE.MathUtils.degToRad(-16),
    ],
    type: 2,
  },
  {
    position: [0.2, -0.46, 0],
    scale: 0.03,
    rotation: [
      THREE.MathUtils.degToRad(0),
      THREE.MathUtils.degToRad(-(340 + 360)),
      THREE.MathUtils.degToRad(-16),
    ],
    type: 2,
  },
];

export default class Arm {
  constructor({ scene, screen, arm }) {
    this.scene = scene;
    this.screen = screen;
    this.arm = arm;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createArm();
  }

  createArm() {
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#b0b0b0'),
      metalness: 1,
      roughness: 0.25,
      side: THREE.DoubleSide,
    });

    this.arm.traverse((node) => {
      if (node.material) {
        node.material = material;
      }
    });

    this.group.add(this.arm);

    this.onWheel(0);
  }

  /**
   * Events.
   */
  onResize({ screen }) {
    this.screen = screen;
  }

  onWheel(scroll) {
    if (!window.threshold.length) return;

    let current = window.threshold.findIndex(({ value }) => scroll < value) - 1;

    if (current === -2) {
      current = window.threshold.length - 2;
    }

    const start = window.threshold[current].value;
    const end = window.threshold[current + 1].value;

    const progress = map(scroll, start, end, 0, 1);

    const from = steps[current];
    const to = steps[current + 1];

    const scale =
      map(progress, 0, 1, from.scale, to.scale) * this.screen.height;
    const position = new THREE.Vector3(
      this.screen.width * map(progress, 0, 1, from.position[0], to.position[0]),
      this.screen.height *
        map(progress, 0, 1, from.position[1], to.position[1]),
      0
    );
    const rotation = new THREE.Euler().fromArray(
      new Array(3)
        .fill(0)
        .map((_, i) => map(progress, 0, 1, from.rotation[i], to.rotation[i]))
    );

    this.group.scale.set(scale, scale, scale);
    this.group.position.copy(position);
    this.group.rotation.copy(rotation);
  }
}
