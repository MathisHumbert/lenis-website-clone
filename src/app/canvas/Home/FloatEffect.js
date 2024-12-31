import * as THREE from 'three';

export default class FloatEffect {
  constructor(group, options = {}) {
    this.group = group;
    this.enabled = options.enabled ?? true;
    this.speed = options.speed ?? 1;
    this.rotationIntensity = options.rotationIntensity ?? 1;
    this.floatIntensity = options.floatIntensity ?? 1;
    this.floatingRange = options.floatingRange ?? [-0.1, 0.1];
    this.offset = Math.random() * 10000;

    this.floatingGroup = new THREE.Group();
    this.floatingGroup.matrixAutoUpdate = false;

    this.floatingGroup.add(this.group);

    this.initialY = this.group.position.y;
  }

  update(elapsedTime) {
    if (!this.enabled || this.speed === 0) return;

    const t = this.offset + elapsedTime;

    this.floatingGroup.rotation.x =
      (Math.cos((t / 4) * this.speed) / 8) * this.rotationIntensity;
    this.floatingGroup.rotation.y =
      (Math.sin((t / 4) * this.speed) / 8) * this.rotationIntensity;
    this.floatingGroup.rotation.z =
      (Math.sin((t / 4) * this.speed) / 20) * this.rotationIntensity;

    let yPosition = Math.sin((t / 4) * this.speed) / 10;
    yPosition = THREE.MathUtils.mapLinear(
      yPosition,
      -0.1,
      0.1,
      this.floatingRange[0],
      this.floatingRange[1]
    );
    this.floatingGroup.position.y =
      yPosition * this.floatIntensity + this.initialY;

    this.floatingGroup.updateMatrix();
  }

  getGroup() {
    return this.floatingGroup;
  }
}
