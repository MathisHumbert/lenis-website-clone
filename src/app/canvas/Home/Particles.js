import * as THREE from 'three';

export default class Particles {
  constructor({ scene, width, height, depth, count, scale, size }) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.count = count;
    this.scale = scale;
    this.size = size;

    this.positions = new Float32Array(this.count * 3);

    for (let i = 0; i < this.positions.length; i += 3) {
      this.positions[i] = THREE.MathUtils.randFloatSpread(this.width);
      this.positions[i + 1] = THREE.MathUtils.randFloatSpread(this.height);
      this.positions[i + 2] = THREE.MathUtils.randFloatSpread(this.depth);
    }

    this.noise = new Float32Array(this.count * 3);
    this.sizes = new Float32Array(this.count);
    this.speeds = new Float32Array(this.count);
    this.scales = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      this.noise[i * 3] = Math.random() * 100;
      this.noise[i * 3 + 1] = Math.random() * 100;
      this.noise[i * 3 + 2] = Math.random() * 100;

      this.sizes[i] = Math.random() * this.size;
      this.speeds[i] = Math.random() * 0.2;
      this.scales[i] = Math.random() * 100;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    );
    this.geometry.setAttribute(
      'noise',
      new THREE.BufferAttribute(this.noise, 3)
    );
    this.geometry.setAttribute(
      'size',
      new THREE.BufferAttribute(this.sizes, 1)
    );
    this.geometry.setAttribute(
      'speed',
      new THREE.BufferAttribute(this.speeds, 1)
    );
    this.geometry.setAttribute(
      'scale',
      new THREE.BufferAttribute(this.scales, 1)
    );

    this.material = new THREE.ShaderMaterial({
      vertexShader: /*glsl*/ `
      // Simplex 2D noise
      //
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      attribute float size;
      attribute float speed;
      attribute vec3 noise;
      attribute float scale;

      uniform float uTime;
      uniform float uScroll;
      uniform vec2 uResolution;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);

        modelPosition.x += snoise(vec2(noise.x, uTime * speed)) * scale;
        modelPosition.y += snoise(vec2(noise.y, uTime * speed)) * scale;
        modelPosition.z += snoise(vec2(noise.z, uTime * speed)) * scale;

        float depth = (1.0 / - (viewMatrix * modelPosition).z);

        modelPosition.y += uScroll * depth * 100.;
        modelPosition.y = mod(modelPosition.y, uResolution.y) - uResolution.y/2.;

        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPostion = projectionMatrix * viewPosition;

        gl_Position = projectionPostion;
        gl_PointSize = size * 100.;
        gl_PointSize *= (1.0 / - viewPosition.z);
      }
    `,
      fragmentShader: /*glsl*/ `
        uniform float uTime;
        uniform vec3 uColor;

        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;

          gl_FragColor = vec4(uColor, strength);
        }
    `,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('rgb(255, 207, 206)') },
        uScroll: { value: 0 },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
      },
    });

    this.particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particles);
  }

  /**
   * Events.
   */
  onResize({ screen }) {
    this.width = screen.width;
    this.height = screen.height;

    this.material.uniforms.uResolution.value.set(this.width, this.height);

    this.positions = new Float32Array(this.count * 3);

    for (let i = 0; i < this.positions.length; i += 3) {
      this.positions[i] = THREE.MathUtils.randFloatSpread(this.width);
      this.positions[i + 1] = THREE.MathUtils.randFloatSpread(this.height);
      this.positions[i + 2] = THREE.MathUtils.randFloatSpread(this.depth);
    }

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    );
  }

  onWheel(scroll) {
    this.material.uniforms.uScroll.value = scroll;
  }

  /**
   * Loop.
   */
  update(elapsedTime) {
    this.material.uniforms.uTime.value = elapsedTime * 0.5;
  }
}
