// Player Car Controller
class PlayerCar {
    constructor(scene, physicsEngine, startPosition) {
        this.scene = scene;
        this.physics = physicsEngine;
        this.rep = 0;
        this.money = 5000;
        this.currentCar = 'street-racer';
        this.isHandbraking = false;
        this.engineSound = null;
        this.nitroFuel = 100;
        this.maxNitroFuel = 100;
        
        // Car definitions
        this.carTypes = {
            'street-racer': {
                name: 'Street Racer',
                color: 0xff0000,
                maxSpeed: 200,
                acceleration: 150,
                handling: 0.8,
                price: 0
            },
            'muscle-car': {
                name: 'Muscle Car',
                color: 0xffaa00,
                maxSpeed: 190,
                acceleration: 180,
                handling: 0.6,
                price: 8000
            },
            'supercar': {
                name: 'Supercar',
                color: 0x00ff00,
                maxSpeed: 220,
                acceleration: 200,
                handling: 0.9,
                price: 50000
            },
            'sports-car': {
                name: 'Sports Car',
                color: 0x0066ff,
                maxSpeed: 210,
                acceleration: 170,
                handling: 0.85,
                price: 25000
            }
        };

        this.initialize(startPosition);
    }

    initialize(startPosition) {
        const carSpec = this.carTypes[this.currentCar];
        
        // Create physics body
        this.physicsBody = this.physics.createVehicle({
            mass: 1000,
            position: startPosition || { x: 0, y: 10, z: 0 },
            maxSpeed: carSpec.maxSpeed,
            acceleration: carSpec.acceleration,
            friction: 1 - carSpec.handling
        });

        // Create visual mesh
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(2, 1.5, 4.5),
            new THREE.MeshStandardMaterial({
                color: carSpec.color,
                roughness: 0.4,
                metalness: 0.8
            })
        );
        
        // Add car details
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // Add windows
        const windshield = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 0.8, 0.3),
            new THREE.MeshStandardMaterial({
                color: 0x0088ff,
                transparent: true,
                opacity: 0.4
            })
        );
        windshield.position.z = -0.5;
        windshield.position.y = 0.2;
        this.mesh.add(windshield);

        // Add headlights
        const leftLight = new THREE.PointLight(0xffff00, 50, 100);
        leftLight.position.set(-0.7, 0.5, -2.2);
        this.mesh.add(leftLight);

        const rightLight = new THREE.PointLight(0xffff00, 50, 100);
        rightLight.position.set(0.7, 0.5, -2.2);
        this.mesh.add(rightLight);

        this.scene.add(this.mesh);

        // Nitro particles
        this.createNitroSystem();

        // Input state
        this.input = {
            acceleration: 0,
            steering: 0,
            braking: 0
        };
    }

    createNitroSystem() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2;
            positions[i + 1] = (Math.random() - 0.5) * 2;
            positions[i + 2] = Math.random() * 5;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ff00,
            size: 0.2,
            transparent: true,
            opacity: 0.6
        });
        
        this.nitroParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.nitroParticles.position.z = 2.5;
        this.mesh.add(this.nitroParticles);
    }

    useNitro() {
        if (this.nitroFuel > 10) {
            this.nitroFuel -= 1;
            // Boost acceleration
            const currentSpeed = this.physicsBody.body.velocity.length();
            if (currentSpeed < this.physicsBody.maxSpeed) {
                const boostDir = new CANNON.Vec3(0, 0, -1);
                this.physicsBody.body.quaternion.vmult(boostDir, boostDir);
                this.physicsBody.body.applyForce(
                    boostDir.scale(300),
                    this.physicsBody.body.position
                );
            }
            
            // Regenerate nitro slowly
            this.nitroFuel = Math.min(this.nitroFuel + 0.5, this.maxNitroFuel);
        }
    }

    rechargeNitro(amount = 1) {
        this.nitroFuel = Math.min(this.nitroFuel + amount, this.maxNitroFuel);
    }

    addRep(amount) {
        this.rep += amount;
    }

    getStats() {
        const carSpec = this.carTypes[this.currentCar];
        return {
            name: carSpec.name,
            maxSpeed: carSpec.maxSpeed,
            acceleration: carSpec.acceleration,
            handling: carSpec.handling,
            price: carSpec.price
        };
    }

    switchCar(carType) {
        if (this.carTypes[carType]) {
            // Store old position
            const oldPosition = {
                x: this.physicsBody.body.position.x,
                y: this.physicsBody.body.position.y,
                z: this.physicsBody.body.position.z
            };

            // Remove old physics bodies
            this.physics.bodies = this.physics.bodies.filter(body => body !== this.physicsBody.body);
            this.physicsBody.wheels.forEach(wheel => {
                this.physics.bodies = this.physics.bodies.filter(body => body !== wheel.body);
                this.physics.world.removeBody(wheel.body);
            });
            this.physics.world.removeBody(this.physicsBody.body);

            // Remove old mesh
            this.scene.remove(this.mesh);

            // Switch car type
            this.currentCar = carType;
            this.initialize(oldPosition);
        }
    }

    update(deltaTime) {
        // Update physics
        this.physics.updateVehicle(this.physicsBody, this.input);

        // Sync mesh with physics body
        this.mesh.position.copy(this.physicsBody.body.position);
        this.mesh.quaternion.copy(this.physicsBody.body.quaternion);

        // Rotate wheels
        this.physicsBody.wheels.forEach((wheel, index) => {
            // Visual rotation of wheels would go here
        });

        // Update nitro particles visibility
        if (this.input.acceleration > 0.5 && this.physicsBody.body.velocity.length() > 50) {
            this.nitroParticles.visible = true;
        } else {
            this.nitroParticles.visible = false;
        }
    }

    getSpeed() {
        return this.physicsBody.body.velocity.length();
    }

    getPosition() {
        return {
            x: this.physicsBody.body.position.x,
            y: this.physicsBody.body.position.y,
            z: this.physicsBody.body.position.z
        };
    }

    setInput(input) {
        this.input = input;
    }

    reset(position) {
        this.physicsBody.body.position.set(position.x, position.y, position.z);
        this.physicsBody.body.velocity.set(0, 0, 0);
        this.physicsBody.body.angularVelocity.set(0, 0, 0);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlayerCar;
}
