import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#fff');

// Axis helper
const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matCapTexture = textureLoader.load('./textures/matcaps/7.png');
const matCapTextureText = textureLoader.load('./textures/matcaps/7.png');

/**
 * Fonts=
 */

const fontLoader = new THREE.FontLoader();
fontLoader.load('./fonts/helvetiker_bold.typeface.json', (font) => {
  const textGeometry = new THREE.TextGeometry('tasty donuts', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegmnents: 3,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
  });

  textGeometry.computeBoundingBox();
  //   console.log(textGeometry.boundingBox);
  // !! Center the geometry, not the mesh
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial();
  textMaterial.matcap = matCapTextureText;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  // !! Create outsiode of loop – only create mesh in loop
  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: matCapTexture,
  });

  const light = new THREE.AmbientLight(0x404040, 4.5); // soft white light
  scene.add(light);

  // Instantiate the draco loader for compressed files
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  // !! Import blender donut model
  const gltfLoader = new GLTFLoader();

  for (let i = 0; i < 200; i++) {
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load('models/low-poly0donut.gltf', (gltf) => {
      const children = [...gltf.scene.children];

      for (const child of children) {
        child.position.set(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
        );
        child.rotation.x = Math.random() * Math.PI;
        child.rotation.y = Math.random() * Math.PI;

        const randomScale = Math.random() * 3;
        child.scale.set(randomScale, randomScale, randomScale);

        scene.add(child);
      }
    });
  }

  // for (let i = 0; i < 250; i++) {
  //   const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  //   // Set ranndom position
  //   donut.position.set(
  //     (Math.random() - 0.5) * 10,
  //     (Math.random() - 0.5) * 10,
  //     (Math.random() - 0.5) * 10,
  //   );

  //   // Set ranndom rotation
  //   donut.rotation.x = Math.random() * Math.PI;
  //   donut.rotation.y = Math.random() * Math.PI;

  //   // Set ranndom scale
  //   const randomScale = Math.random();
  //   donut.scale.set(randomScale, randomScale, randomScale);

  //   scene.add(donut);
  // }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
