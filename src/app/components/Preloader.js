import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import imagesLoaded from 'imagesloaded';

import Component from '../classes/Component';
import { delay } from '../utils/math';

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
    });

    this.loadedTextureUrl = [];
    window.TEXTURES = {};
    window.MODELS = {};

    this.textureLoader = new THREE.TextureLoader();
    this.gltfLoader = new GLTFLoader();
  }

  preload(content) {
    this.loadedTextureUrl.push(window.location.pathname);

    const images = content.querySelectorAll('data-src');

    const preloadImages = new Promise((resolve) => {
      imagesLoaded(content, { background: true }, resolve);
    });

    const preloadTextures = Promise.all(
      [...images, 'texture.jpeg'].map(
        (image) =>
          new Promise((resolve) => {
            this.textureLoader.load(image, (texture) => {
              texture.generateMipmaps = false;
              texture.minFilter = THREE.LinearFilter;
              texture.needsUpdate = true;

              window.TEXTURES[image] = texture;
              resolve();
            });
          })
      )
    );

    const assetsToLoad = [
      { url: '/models/arm.glb', name: 'arm1' },
      { url: '/models/arm2.glb', name: 'arm2' },
    ];

    const preloadModels = Promise.all(
      assetsToLoad.map(
        (asset) =>
          new Promise((res) => {
            this.gltfLoader.load(asset.url, (gltf) => {
              window.MODELS[asset.name] = gltf.scene;
              res();
            });
          })
      )
    );

    // const preloaderAnimation = new Promise(async (res) => {
    //   this.element.classList.add('show');

    //   await delay(1500);

    //   res();
    // });

    Promise.all([
      preloadImages,
      preloadTextures,
      preloadModels,
      // preloaderAnimation,
    ]).then(() => {
      // this.element.classList.add('out');
      this.emit('preloaded');
    });
  }

  async load(content) {
    const images = content.querySelectorAll('data-src');

    if (!this.loadedTextureUrl.includes(window.location.pathname)) {
      this.loadedTextureUrl.push(window.location.pathname);

      const loadImages = new Promise((resolve) => {
        imagesLoaded(content, { background: true }, resolve);
      });

      const loadTextures = Promise.all(
        [...images, 'texture.jpeg'].map(
          (image) =>
            new Promise((resolve) => {
              this.textureLoader.load(image, (texture) => {
                texture.generateMipmaps = false;
                texture.minFilter = THREE.LinearFilter;
                texture.needsUpdate = true;

                window.TEXTURES[image] = texture;
                resolve();
              });
            })
        )
      );

      return new Promise((res) => {
        Promise.all([loadImages, loadTextures]).then(() => {
          res();
        });
      });
    } else {
      const loadImages = new Promise((resolve) => {
        imagesLoaded(content, { background: true }, resolve);
      });

      return new Promise((res) => {
        loadImages.then(() => {
          res();
        });
      });
    }
  }
}
