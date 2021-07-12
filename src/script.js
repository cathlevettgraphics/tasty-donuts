// CSS
import './style.css';
// THREE
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

/*************************
 ******** CANVAS
 *************************/

const canvas = document.querySelector('canvas.webgl');

/*************************
 ******** SCENE
 *************************/

const scene = new THREE.Scene();
scene.background = new THREE.Color('#fff');

/*************************
 ******** LOADERS
 *************************/

const textureLoader = new THREE.TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();

/*************************
 ******** TEXTURES
 *************************/

const matCapTextureText = textureLoader.load('./textures/matcaps/7.png');

const bakedTexture = textureLoader.load('./models/baked-new.jpg');
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

/*************************
 ******** MATERIALS
 *************************/

// Text material
const textMaterial = new THREE.MeshMatcapMaterial({
  matcap: matCapTextureText,
});

// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

/*************************
 ******** FONTS
 *************************/

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
  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

/*************************
 ******** DONUT MODEL
 *************************/

for (let i = 0; i < 200; i++) {
  // Load donut
  gltfLoader.load('models/donut-2.glb', (gltf) => {
    const children = [...gltf.scene.children];

    for (const child of children) {
      // Set position
      child.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
      );

      // Set rotation
      child.rotation.x = Math.random() * Math.PI;
      child.rotation.y = Math.random() * Math.PI;

      // Set scale
      const randomScale = Math.random() * 3;
      child.scale.set(randomScale, randomScale, randomScale);
    }

    // TRaverse scene mesh and add material
    gltf.scene.traverse((child) => {
      child.material = bakedMaterial;
    });
    scene.add(gltf.scene);
  });
}

/*************************
 ******** SIZES
 *************************/

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

/*************************
 ******** CAMERA
 *************************/

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

/*************************
 ******** LIGHTS
 *************************/

// const ambientLight = new THREE.AmbientLight(0x404040);
// scene.add(light);

/*************************
 ******** CONTROLS
 *************************/

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/*************************
 ******** RENDERER
 *************************/

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
