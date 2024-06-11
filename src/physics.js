class Plane {
	constructor() {
		this.velocity = new Vector(0, 0, 0);
        this.position = new Vector(0, 0, 0);
		this.xangle = 0;
		this.yangle = 0;
        this.zangle = 0;
        this.angleVelocity = new Vector(0, 0, 0);
        this.mass = 1000;
	}

	move() {

        // //thrust
		// let thrust = 10;
		// let thrustForce = new Vector(thrust, 0, 0);
		// thrustForce.rotate(this.xangle, this.yangle - 3*Math.PI/2, this.zangle);

        // //weight
		// let weight = 0;
		// let weightVector = new Vector(0, -weight, 0);

        // //aoa
		// let aoa = Math.acos(thrustForce.dot(this.velocity) / (thrustForce.magnitude() * this.velocity.magnitude()));

		// //drag = 0.5 * air density * v ^ 2 * drag coefficient * cross sectional area
		// let velocityMagnitude = this.velocity.magnitude();
		// let dragMagnitude = 0.5 * 1 * velocityMagnitude * velocityMagnitude * 0.04 * dragCoefficient(aoa);
		// let dragForce = new Vector(0, 0, 0);
		// if (velocityMagnitude !== 0) {
		// 	dragForce = new Vector(-this.velocity.x, -this.velocity.y, -this.velocity.z);
		// 	dragForce.scale(dragMagnitude / velocityMagnitude);
		// }

        // //lift = 0.5 * air density * v ^ 2 * lift coefficient * wing surface area

        // let v10 = new Vector(this.velocity.z, 0, -this.velocity.x).normalize();
        // let v11 = v10.cross(this.velocity).normalize();
        // let liftDirection = v10.scale(Math.cos(this.zangle)).add(v11.scale(Math.sin(this.zangle)));

        // // aelerons
        // let liftFactor = 0.5 * 1 * velocityMagnitude * velocityMagnitude * 13 * liftCoefficient(aoa);
        // let wingForce = new Vector(liftDirection.x, liftDirection.y, liftDirection.z).scale(liftFactor);
        // let rightWingVector = wingForce.scale(1/(this.mass*7));
        // let leftWingVector = wingForce.scale(-1/(this.mass*7));

        //change velocity
        // this.angleVelocity.add(rightWingVector);
        // this.angleVelocity.add(leftWingVector);

		// this.velocity.add(weightVector);
		// this.velocity.add(thrustForce.scale(1/this.mass));
		// this.velocity.add(dragForce.scale(1/this.mass));

		//change pos

        this.xangle += this.angleVelocity.x;
        this.yangle += this.angleVelocity.y;
        this.zangle += this.angleVelocity.z;
		this.position.add(this.velocity);
	}

    //TODO: fix, account for 0 rotation
    torque(force, location) {
        location.subtract(this.position);
        let parallelForce = location.scale(location.dot(force) / location.dot(location));
        let perpendicularForce = force;
        perpendicularForce.subtract(parallelForce);
        let angleAcceleration = parallelForce.divide(location.scale(this.mass));

        angleAcceleration.x = isNaN(angleAcceleration.x) ? 0 : angleAcceleration.x;
        angleAcceleration.y = isNaN(angleAcceleration.y) ? 0 : angleAcceleration.y;
        angleAcceleration.z = isNaN(angleAcceleration.z) ? 0 : angleAcceleration.z;

        this.angleVelocity.add(angleAcceleration);
        this.velocity.add(perpendicularForce);
    }
}

//TODO: make all vector function return a new vector and not change the old one
class Vector {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	magnitude() {
		return Math.hypot(this.x, this.y, this.z);
	}

    multiply(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        this.z *= vector.z;
        return this;
    }

    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
        this.z /= vector.z;
        return this;
    }

	rotate(xangle, yangle, zangle) {
        const cosX = Math.cos(xangle);
        const sinX = Math.sin(xangle);
        const cosY = Math.cos(yangle);
        const sinY = Math.sin(yangle);
        const cosZ = Math.cos(zangle);
        const sinZ = Math.sin(zangle);

        const rotationMatrixX = [
            [1, 0, 0],
            [0, cosX, -sinX],
            [0, sinX, cosX]
        ];

        const rotationMatrixY = [
            [cosY, 0, sinY],
            [0, 1, 0],
            [-sinY, 0, cosY]
        ];

        const rotationMatrixZ = [
            [cosZ, -sinZ, 0],
            [sinZ, cosZ, 0],
            [0, 0, 1]
        ];

        let newX = this.x * rotationMatrixZ[0][0] + this.y * rotationMatrixZ[0][1] + this.z * rotationMatrixZ[0][2];
        let newY = this.x * rotationMatrixZ[1][0] + this.y * rotationMatrixZ[1][1] + this.z * rotationMatrixZ[1][2];
        let newZ = this.x * rotationMatrixZ[2][0] + this.y * rotationMatrixZ[2][1] + this.z * rotationMatrixZ[2][2];

        let tmpX = newX;
        newX = tmpX * rotationMatrixY[0][0] + newZ * rotationMatrixY[0][2];
        newZ = tmpX * rotationMatrixY[2][0] + newZ * rotationMatrixY[2][2];

        let tmpY = newY;
        newY = tmpY * rotationMatrixX[1][1] + newZ * rotationMatrixX[1][2];
        newZ = tmpY * rotationMatrixX[2][1] + newZ * rotationMatrixX[2][2];

        this.x = newX;
        this.y = newY;
        this.z = newZ;

        return this;
    }

	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
        return this;
	}

    subtract(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		this.z -= vector.z;
        return this;
	}

	scale(num) {
		this.x *= num;
		this.y *= num;
		this.z *= num;
        return this;
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

    normalize() {
        let magnitude = this.magnitude();
        if (magnitude !== 0) {
            this.x /= magnitude;
            this.y /= magnitude;
            this.z /= magnitude;
        }
        return this;
    }
}

function liftCoefficient(x) {
    for(let i = 0; i < data.length - 1; i++) {
        if(x >= data[i][0] && x <= data[i+1][0]) {
            return linearInterpolation(x, data[i][0], data[i][1], data[i+1][0], data[i+1][1]);
        }
    }
    return null;
}

function dragCoefficient(x) {
    return 1 - Math.cos(2*x);
}

function linearInterpolation(x, x0, y0, x1, y1) {
    if ((x1 - x0) == 0) {
        return (y0 + y1) / 2;
    }
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
}

//NACA-0012
const data = [
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

export default Plane;
export { Vector };