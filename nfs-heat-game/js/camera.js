// Camera System
class GameCamera {
    constructor(camera, playerCar) {
        this.camera = camera;
        this.playerCar = playerCar;
        
        // Camera positioning for first-person
        this.cameraOffset = new THREE.Vector3(0, 0.8, -1.5);
        this.targetOffset = new THREE.Vector3(0, 0.8, -1.5);
        this.smoothingFactor = 0.15;
        
        // Speed-based FOV adjustment
        this.baseFOV = 75;
        this.maxFOV = 95;
    }

    update() {
        const carMesh = this.playerCar.mesh;
        const carSpeed = this.playerCar.getSpeed();

        // Calculate FOV based on speed
        const speedRatio = Math.min(carSpeed / this.playerCar.physicsBody.maxSpeed, 1);
        const targetFOV = this.baseFOV + (this.maxFOV - this.baseFOV) * speedRatio;
        this.camera.fov += (targetFOV - this.camera.fov) * 0.1;
        this.camera.updateProjectionMatrix();

        // Tilt camera slightly based on steering
        const tiltAngle = this.playerCar.input.steering * 0.15;

        // Position camera relative to car with smooth following
        this.targetOffset.z = -1.5 - (speedRatio * 0.5); // Camera moves back at high speed

        this.cameraOffset.x += (this.targetOffset.x - this.cameraOffset.x) * this.smoothingFactor;
        this.cameraOffset.y += (this.targetOffset.y - this.cameraOffset.y) * this.smoothingFactor;
        this.cameraOffset.z += (this.targetOffset.z - this.cameraOffset.z) * this.smoothingFactor;

        // Apply car's rotation to camera offset
        const worldOffset = this.cameraOffset.clone();
        worldOffset.applyQuaternion(carMesh.quaternion);

        // Set camera position
        this.camera.position.copy(carMesh.position).add(worldOffset);

        // Look at point ahead of car
        const lookAheadDistance = 10 + speedRatio * 20;
        const forwardDir = new THREE.Vector3(0, 0, -1);
        forwardDir.applyQuaternion(carMesh.quaternion);
        
        const lookAtPoint = carMesh.position.clone().add(
            forwardDir.multiplyScalar(lookAheadDistance)
        );
        lookAtPoint.y += 0.5;

        this.camera.lookAt(lookAtPoint);
        this.camera.rotation.z = tiltAngle;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameCamera;
}
