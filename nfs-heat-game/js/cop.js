// Cop AI System
class CopAI {
    constructor(scene, physicsEngine) {
        this.scene = scene;
        this.physics = physicsEngine;
        this.cops = [];
        this.detectionRange = 300;
        this.currentHeatLevel = 0;
        this.maxHeatLevel = 5;
        this.playerCaught = false;
    }

    spawnCops(playerPosition, count = 1) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const distance = this.detectionRange * 0.8;
            const position = {
                x: playerPosition.x + Math.cos(angle) * distance,
                y: 10,
                z: playerPosition.z + Math.sin(angle) * distance
            };

            const cop = {
                physicsBody: this.physics.createVehicle({
                    mass: 1200,
                    position: position,
                    maxSpeed: 180,
                    acceleration: 140,
                    friction: 0.5
                }),
                mesh: this.createCopMesh(position),
                targetPosition: playerPosition,
                state: 'pursuing', // pursuing, patrolling, searching
                speedModifier: 1.2,
                directionChangeTimer: 0,
                directionChangeInterval: 60,
                alertTimer: 0,
                maxAlertTime: 300,
                input: { acceleration: 0, steering: 0, braking: 0 }
            };

            this.cops.push(cop);
        }
    }

    createCopMesh(position) {
        const copMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2, 1.5, 4.5),
            new THREE.MeshStandardMaterial({
                color: 0x0066ff,
                roughness: 0.4,
                metalness: 0.8
            })
        );

        // Police lights
        const topLight1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.3),
            new THREE.MeshStandardMaterial({
                color: 0xff0000,
                emissive: 0xff0000,
                emissiveIntensity: 1
            })
        );
        topLight1.position.set(-0.3, 1.2, 0);
        copMesh.add(topLight1);

        const topLight2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.3),
            new THREE.MeshStandardMaterial({
                color: 0x0000ff,
                emissive: 0x0000ff,
                emissiveIntensity: 1
            })
        );
        topLight2.position.set(0.3, 1.2, 0);
        copMesh.add(topLight2);

        // Police numbers on side
        const numberText = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 0.5),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        numberText.position.set(1.1, 0, 0);
        copMesh.add(numberText);

        copMesh.castShadow = true;
        copMesh.receiveShadow = true;
        this.scene.add(copMesh);

        return copMesh;
    }

    update(playerCar, deltaTime) {
        const playerPos = playerCar.getPosition();
        const playerSpeed = playerCar.getSpeed();

        // Update heat level based on player speed
        if (playerSpeed > 100) {
            this.currentHeatLevel = Math.min(
                this.currentHeatLevel + deltaTime * 0.05,
                this.maxHeatLevel
            );
        } else {
            this.currentHeatLevel = Math.max(
                this.currentHeatLevel - deltaTime * 0.02,
                0
            );
        }

        // Spawn cops based on heat level
        if (this.cops.length === 0 && this.currentHeatLevel > 1) {
            this.spawnCops(playerPos, Math.min(Math.floor(this.currentHeatLevel), 3));
        }

        // Update each cop
        this.cops = this.cops.filter(cop => {
            return this.updateCop(cop, playerPos, playerCar, deltaTime);
        });

        return this.currentHeatLevel;
    }

    updateCop(cop, playerPos, playerCar, deltaTime) {
        const copPos = cop.physicsBody.body.position;
        const distToPlayer = Math.hypot(
            playerPos.x - copPos.x,
            playerPos.z - copPos.z
        );

        // Check if cop can see player
        if (distToPlayer < this.detectionRange) {
            cop.state = 'pursuing';
            cop.targetPosition = playerPos;
            cop.alertTimer = cop.maxAlertTime;
        } else {
            cop.alertTimer -= deltaTime;
            if (cop.alertTimer <= 0) {
                return false; // Remove cop
            }
        }

        // AI movement logic
        if (cop.state === 'pursuing') {
            const dx = playerPos.x - copPos.x;
            const dz = playerPos.z - copPos.z;
            const distance = Math.hypot(dx, dz);

            // Steering
            const angle = Math.atan2(dz, dx);
            const currentForward = new CANNON.Vec3(0, 0, -1);
            cop.physicsBody.body.quaternion.vmult(currentForward, currentForward);
            const currentAngle = Math.atan2(currentForward.x, -currentForward.z);
            
            let angleDiff = angle - currentAngle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            cop.input.steering = Math.max(-1, Math.min(1, angleDiff / 0.5));

            // Acceleration
            if (distance > 20) {
                cop.input.acceleration = 1;
            } else {
                cop.input.acceleration = 0.3;
            }

            // Collision detection with player
            if (distance < 5) {
                this.playerCaught = true;
                return true;
            }
        }

        // Update physics
        this.physics.updateVehicle(cop.physicsBody, cop.input);

        // Sync mesh
        cop.mesh.position.copy(cop.physicsBody.body.position);
        cop.mesh.quaternion.copy(cop.physicsBody.body.quaternion);

        return true; // Keep cop
    }

    getHeatLevel() {
        return this.currentHeatLevel;
    }

    getCopCount() {
        return this.cops.length;
    }

    clearAllCops() {
        this.cops.forEach(cop => {
            this.scene.remove(cop.mesh);
            this.physics.world.removeBody(cop.physicsBody.body);
            cop.physicsBody.wheels.forEach(wheel => {
                this.physics.world.removeBody(wheel.body);
            });
        });
        this.cops = [];
        this.currentHeatLevel = 0;
        this.playerCaught = false;
    }

    evadeCops(seconds) {
        // Reduce heat for evading cops for a duration
        if (seconds > 0) {
            this.currentHeatLevel = Math.max(0, this.currentHeatLevel - 0.1);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CopAI;
}
