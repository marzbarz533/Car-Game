// Input System
class InputManager {
    constructor(playerCar) {
        this.playerCar = playerCar;
        this.keys = {};
        this.isHandbraking = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(event) {
        const key = event.key.toLowerCase();
        this.keys[key] = true;

        // Handle special keys
        switch (key) {
            case ' ':
                this.isHandbraking = true;
                event.preventDefault();
                break;
            case 'p':
                // Open shop
                if (window.gameState && window.gameState.uiManager) {
                    window.gameState.uiManager.showShop(this.playerCar);
                }
                break;
            case 'escape':
                // Return to menu
                if (window.gameState && window.gameState.uiManager) {
                    window.gameState.uiManager.showScreen('title');
                    window.gameState.gameActive = false;
                }
                break;
            case 'r':
                // Reset player position
                const spawnPoint = window.gameState.map.getSpawnPoint();
                this.playerCar.reset(spawnPoint);
                break;
            case 'n':
                // Use nitro
                this.playerCar.useNitro();
                break;
        }
    }

    handleKeyUp(event) {
        const key = event.key.toLowerCase();
        this.keys[key] = false;

        if (key === ' ') {
            this.isHandbraking = false;
        }
    }

    update() {
        // Calculate input values
        let acceleration = 0;
        let steering = 0;
        let braking = 0;

        // Forward/Backward
        if (this.keys['w']) acceleration = 1;
        if (this.keys['s']) acceleration = -0.5;

        // Steering
        if (this.keys['a']) steering = -1;
        if (this.keys['d']) steering = 1;

        // Braking
        if (this.isHandbraking) braking = 1;

        // Apply exponential smoothing for better feel
        this.playerCar.input.acceleration += (acceleration - this.playerCar.input.acceleration) * 0.2;
        this.playerCar.input.steering += (steering - this.playerCar.input.steering) * 0.15;
        this.playerCar.input.braking += (braking - this.playerCar.input.braking) * 0.1;
    }

    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    }

    getInputState() {
        return {
            acceleration: this.playerCar.input.acceleration,
            steering: this.playerCar.input.steering,
            braking: this.playerCar.input.braking,
            handbrake: this.isHandbraking
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputManager;
}
