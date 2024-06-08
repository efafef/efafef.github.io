import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const groundGeometry = new THREE.PlaneGeometry(10000, 10000); // Extends far enough to appear infinite
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to lie flat
ground.position.y = -1.5; // Set position to y = -5
scene.add(ground);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const edges = new THREE.EdgesGeometry(geometry);

const greenMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

// Original green cube
const cubeGreen = new THREE.LineSegments(edges, greenMaterial);
scene.add(cubeGreen);

camera.position.z = 5;

let greenCubeMass = 100;
let groundMomentum = 1;
let greenCubeVelocity = 0;
let gravitationalConstant = -0.001;
let greenCubedragCoefficient = 1.05;
let airDensity = 3;

function animate() {

    cubeGreen.position.y += greenCubeVelocity;
    greenCubeVelocity += gravitationalConstant;
    //greenCubeVelocity += 0.5*airDensity*greenCubeVelocity*greenCubeVelocity*greenCubedragCoefficient;


    if (cubeGreen.position.y - 0.5 < -1.5) {
        greenCubeVelocity *= -0.87;
    }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
