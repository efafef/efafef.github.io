import * as THREE from 'https://cdn.skypack.dev/three@0.140.0';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

class Plane {
	constructor() {
		this.velocity = new Vector(0, 0, 0);
		this.xangle = 0;
		this.yangle = 0;
	}

	addToScene(scene) {
		const edgesGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
		const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
		this.edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
		scene.add(this.edges);
	}

	move() {
		this.xangle = 3*Math.PI/2; // Set the xangle to 180 degrees to move away on the x-axis
		this.yangle = 0; // Set the yangle to 0 degrees to move straight on the y-axis

		let thrust = 0.02;
		let thrustVector = new Vector(thrust, 0, 0);
		thrustVector.rotate(this.xangle, this.yangle);

		let aoa = Math.acos(thrustVector.dot(this.velocity) / (thrustVector.magnitude() * this.velocity.magnitude()));

		let weight = 0.001;
		let weightVector = new Vector(0, -weight, 0);

		//drag = 0.5 * air density * v ^ 2 * drag coefficient * cross sectional area
		let velocityMagnitude = this.velocity.magnitude();
		let dragMagnitude = 0.5 * 1 * velocityMagnitude * velocityMagnitude * 0.04 * (1 - Math.cos(2 * aoa));
		let dragVector = new Vector(0, 0, 0);
		if (velocityMagnitude !== 0) {
			dragVector = new Vector(-this.velocity.x, -this.velocity.y, -this.velocity.z);
			dragVector.scale(dragMagnitude / velocityMagnitude);
		}

		//lift of wings = 0.5 * lift coefficient * v ^ 2 * wing area
		let leftWingLift = 0.5*getLiftCoefficient(aoa)*1*velocityMagnitude*velocityMagnitude*13;
		let rightWingLift = 0.5*getLiftCoefficient(aoa)*1*velocityMagnitude*velocityMagnitude*13;
		let elevator = 0.5*getLiftCoefficient(aoa)*1*velocityMagnitude*velocityMagnitude*5;
		
		let perpendicularVector1 = new Vector(-this.velocity.y, this.velocity.x, 0);
		let perpendicularVector2 = new Vector(-this.velocity.y, this.velocity.x, 0);
		let perpendicularVector3 = new Vector(-this.velocity.y, this.velocity.x, 0);

		let totalMoment = new Vector(0, 0, 0);

		if (perpendicularVector1.magnitude() === 0) {
			perpendicularVector1 = new Vector(0, 0, 0);
			perpendicularVector2 = new Vector(0, 0, 0);
			perpendicularVector3 = new Vector(0, 0, 0);
		} else {
			perpendicularVector1.scale(leftWingLift / perpendicularVector1.magnitude());
			perpendicularVector2.scale(rightWingLift / perpendicularVector2.magnitude());
			perpendicularVector3.scale(elevator / perpendicularVector3.magnitude());

			let leftWingCenter = new Vector(10, 0, 0);
			let rightWingCenter = new Vector(-10, 0, 0);
			let elevatorCenter = new Vector(0, 0, 30);
			
			console.log(perpendicularVector1);

			totalMoment = leftWingCenter.cross(perpendicularVector1).add(rightWingCenter.cross(perpendicularVector2).add(elevatorCenter.cross(perpendicularVector3))).scale(1/30);
		}

		

		this.velocity.add(thrustVector);
		this.velocity.add(weightVector);
		this.velocity.add(dragVector);
		this.velocity.add(totalMoment);

		//change pos
		this.edges.position.x += this.velocity.x;
		this.edges.position.y += this.velocity.y;
		this.edges.position.z += this.velocity.z;
	}

}

class Vector {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	magnitude() {
		return Math.hypot(this.x, this.y, this.z);
	}

	rotate(xangle, yangle) {
		let mag = this.magnitude()
		this.x = mag * Math.cos(yangle) * Math.cos(xangle);
		this.y = mag * Math.sin(yangle);
		this.z = mag * Math.cos(yangle) * Math.sin(xangle);
	}

	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
	}

	scale(num) {
		this.x *= num;
		this.y *= num;
		this.z *= num;
	}

	dot(vector) {
		return this.x * vector.x + this.y * vector.y + this.z * vector.z;
	}

	cross(vector) {
		return new Vector(
			this.y * vector.z - this.z * vector.y,
			this.z * vector.x - this.x * vector.z,
			this.x * vector.y - this.y * vector.x
		);
}
}

function linearInterpolation(x, x0, y0, x1, y1) {
    if ((x1 - x0) == 0) {
        return (y0 + y1) / 2;
    }
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
}

let data = [
    [0.0000, 0.0000],
    [1.0000, 0.0830],
    [2.0000, 0.1531],
    [3.0000, 0.2009],
    [4.0000, 0.2003],
    [5.0000, 0.0328],
    [6.0000, -0.1413],
    [7.0000, -0.1142],
    [8.0000, -0.0703],
    [9.0000, -0.0215],
    [10.0000, 0.0311],
    [11.0000, 0.0848],
    [12.0000, 0.1387],
    [13.0000, 0.1928],
    [14.0000, 0.2468],
    [15.0000, 0.3008],
    [16.0000, 0.3548],
    [17.0000, 0.4079],
    [18.0000, 0.4606],
    [19.0000, 0.5121],
    [20.0000, 0.5838],
    [21.0000, 0.6161],
    [22.0000, 0.6687],
    [23.0000, 0.7216],
    [24.0000, 0.7744],
    [25.0000, 0.8276],
    [26.0000, 0.8810],
    [27.0000, 0.9350],
    [30.0000, 0.9150],
    [35.0000, 1.0200],
    [40.0000, 1.0750],
    [45.0000, 1.0850],
    [50.0000, 1.0400],
    [55.0000, 0.9650],
    [60.0000, 0.8750],
    [65.0000, 0.7650],
    [70.0000, 0.6500],
    [75.0000, 0.5150],
    [80.0000, 0.3700],
    [85.0000, 0.2200],
    [90.0000, 0.0700],
    [95.0000, -0.0700],
    [100.0000, -0.2200],
    [105.0000, -0.3700],
    [110.0000, -0.5100],
    [115.0000, -0.6250],
    [120.0000, -0.7350],
    [125.0000, -0.8400],
    [130.0000, -0.9100],
    [135.0000, -0.9450],
    [140.0000, -0.9450],
    [145.0000, -0.9100],
    [150.0000, -0.8500],
    [155.0000, -0.7400],
    [160.0000, -0.6600],
    [165.0000, -0.6750],
    [170.0000, -0.8500],
    [175.0000, -0.6900],
    [180.0000, 0.0000]
];

function getLiftCoefficient(x) {
    for(let i = 0; i < data.length - 1; i++) {
        if(x >= data[i][0] && x <= data[i+1][0]) {
            return linearInterpolation(x, data[i][0], data[i][1], data[i+1][0], data[i+1][1]);
        }
    }
    return null;
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
// const controls = new PointerLockControls( camera, document.body );

// controls.addEventListener( 'lock', function () {

// 	menu.style.display = 'none';

// } );

// controls.addEventListener( 'unlock', function () {

// 	menu.style.display = 'block';

// } );

// Ground
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('ground_texture.png');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(1000, 1000); // Adjust these values for tiling
const groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });
const groundGeometry = new THREE.PlaneGeometry(10000, 10000); // Extends far enough to appear infinite
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to lie flat
ground.position.y = -1.5; // Set position to y = -1.5
scene.add(ground);

//plane
let plane = new Plane();
plane.addToScene(scene);

camera.position.z = 5;

function animate() {

	plane.move();

	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
