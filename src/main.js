import * as THREE from 'https://cdn.skypack.dev/three@0.140.0';
import Plane, { Vector } from "./physics.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// Ground
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('ground_texture.png');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(1000, 1000);
const groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });
const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.5;
scene.add(ground);

//plane
let plane = new Plane();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {

	plane.torque(new Vector(0, 0, -0.01), new Vector(1, 0, 0));
	plane.move();

	cube.position.x = plane.position.x;
	cube.position.y = plane.position.y;
	cube.position.z = plane.position.z;
	cube.rotation.x = plane.xangle;
	cube.rotation.y = plane.yangle;
	cube.rotation.z = plane.zangle;

	camera.position.x = cube.position.x;
	camera.position.y = cube.position.y;
	camera.position.z = cube.position.z + 5;

	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
