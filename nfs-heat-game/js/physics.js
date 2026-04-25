// Physics System using Cannon.js
class PhysicsEngine {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.defaultContactMaterial.friction = 0.3;
        this.world.defaultContactMaterial.restitution = 0.3;
        
        // Ground material
        this.groundMaterial = new CANNON.Material('ground');
        this.wheelMaterial = new CANNON.Material('wheel');
        
        const wheelGroundContact = new CANNON.ContactMaterial(this.wheelMaterial, this.groundMaterial, {
            friction: 0.8,
            restitution: 0.3,
            frictionEquationStiffness: 1000,
            frictionEquationRelaxation: 3
        });
        this.world.addContactMaterial(wheelGroundContact);

        this.bodies = [];
        this.constraints = [];
        this.vehicles = [];
    }

    createGround(size = 5000) {
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({
            mass: 0,
            shape: groundShape,
            material: this.groundMaterial
        });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(groundBody);
        return groundBody;
    }

    createWall(position, size) {
        const wallShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
        const wallBody = new CANNON.Body({
            mass: 0,
            shape: wallShape,
            position: new CANNON.Vec3(position.x, position.y, position.z)
        });
        this.world.addBody(wallBody);
        this.bodies.push(wallBody);
        return wallBody;
    }

    createVehicle(options = {}) {
        // Create car body
        const mass = options.mass || 1000;
        const carShape = new CANNON.Box(new CANNON.Vec3(1, 1, 2));
        
        const carBody = new CANNON.Body({
            mass: mass,
            shape: carShape,
            linearDamping: 0.01,
            angularDamping: 0.3
        });
        
        carBody.position.set(options.position?.x || 0, options.position?.y || 1, options.position?.z || 0);
        this.world.addBody(carBody);
        this.bodies.push(carBody);

        // Create vehicle using constraints
        const vehicle = {
            body: carBody,
            wheels: [],
            engineForce: 0,
            brakeForce: 0,
            steeringValue: 0,
            maxSpeed: options.maxSpeed || 200,
            acceleration: options.acceleration || 150,
            friction: options.friction || 0.5
        };

        // Add 4 wheels
        const wheelRadius = 0.7;
        const wheelPositions = [
            { x: -1, z: 1.2 },
            { x: 1, z: 1.2 },
            { x: -1, z: -1.2 },
            { x: 1, z: -1.2 }
        ];

        wheelPositions.forEach((pos, index) => {
            const wheelBody = new CANNON.Body({
                mass: 50,
                shape: new CANNON.Sphere(wheelRadius),
                linearDamping: 0.3,
                material: this.wheelMaterial
            });

            wheelBody.position.set(
                carBody.position.x + pos.x,
                carBody.position.y - 0.8,
                carBody.position.z + pos.z
            );

            this.world.addBody(wheelBody);
            this.bodies.push(wheelBody);

            vehicle.wheels.push({
                body: wheelBody,
                isRear: index >= 2,
                isSteerable: index < 2
            });
        });

        this.vehicles.push(vehicle);
        return vehicle;
    }

    updateVehicle(vehicle, input) {
        // Update steering
        vehicle.steeringValue = input.steering * 0.3;

        // Calculate forward vector
        const forward = new CANNON.Vec3(0, 0, -1);
        forward.vadd(vehicle.body.position, forward);
        
        const right = new CANNON.Vec3(1, 0, 0);

        // Apply forces to wheels
        vehicle.wheels.forEach((wheel, index) => {
            const isRear = wheel.isRear;
            const forceMultiplier = isRear ? 1 : 0.7;

            // Apply engine force
            if (Math.abs(input.acceleration) > 0.1) {
                const force = input.acceleration * vehicle.acceleration * forceMultiplier;
                const forceDir = new CANNON.Vec3(0, 0, input.acceleration > 0 ? -1 : 1);
                vehicle.body.quaternion.vmult(forceDir, forceDir);
                forceDir.normalize();
                const wheelForce = forceDir.scale(force);
                wheel.body.applyForce(wheelForce, wheel.body.position);
            }

            // Apply braking
            if (input.braking > 0.1) {
                wheel.body.linearVelocity.scale(1 - input.braking * 0.05, wheel.body.linearVelocity);
            }

            // Apply steering (for front wheels)
            if (wheel.isSteerable) {
                const steerForce = vehicle.steeringValue * 30;
                const steerDir = new CANNON.Vec3(steerForce, 0, 0);
                vehicle.body.quaternion.vmult(steerDir, steerDir);
                wheel.body.applyForce(steerDir, wheel.body.position);
            }
        });

        // Apply drag and friction
        const speed = vehicle.body.velocity.length();
        if (speed > vehicle.maxSpeed) {
            vehicle.body.velocity.scale(vehicle.maxSpeed / speed, vehicle.body.velocity);
        }

        // Air resistance
        vehicle.body.velocity.scale(0.99, vehicle.body.velocity);
    }

    update(deltaTime) {
        this.world.step(1 / 60, deltaTime, 3);
    }
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicsEngine;
}
