// Main Game Engine
class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a14);
        this.scene.fog = new THREE.Fog(0x0a0a14, 500, 3000);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(0, 5, 10);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        document.getElementById('gameContainer').appendChild(this.renderer.domElement);

        // Game systems
        this.physics = new PhysicsEngine();
        this.map = null;
        this.playerCar = null;
        this.copAI = null;
        this.gameCamera = null;
        this.inputManager = null;
        this.uiManager = new UIManager();
        this.shop = new ShopSystem();
        this.leaderboard = new LeaderboardSystem();

        // Game state
        this.gameActive = false;
        this.gameStartTime = 0;
        this.frameCount = 0;
        this.evadeTimer = 0;

        // Load saved progress
        const saved = this.shop.loadProgress();
        if (saved) {
            console.log('Game loaded from save');
        }

        // Update global state
        window.gameState = {
            game: this,
            physics: this.physics,
            map: this.map,
            playerCar: this.playerCar,
            copAI: this.copAI,
            uiManager: this.uiManager,
            shop: this.shop,
            leaderboard: this.leaderboard,
            gameActive: false,
            selectedCar: 'street-racer'
        };

        this.setupEventListeners();
        this.animate();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());

        // Watch for game mode changes
        const observer = new MutationObserver(() => {
            if (this.uiManager.currentScreen === 'game' && !this.gameActive) {
                this.startGame();
            }
        });

        observer.observe(document.getElementById('gameHUD'), {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    startGame() {
        if (this.gameActive) return;

        console.log('Starting game...');
        this.gameActive = true;
        this.gameStartTime = Date.now();
        this.frameCount = 0;

        // Initialize game systems if not already done
        if (!this.map) {
            this.map = new CityMap(this.scene, this.physics);
            this.map.generateCity();
        }

        // Create player car
        const spawnPoint = this.map.getSpawnPoint();
        this.playerCar = new PlayerCar(this.scene, this.physics, spawnPoint);
        this.playerCar.money = this.shop.purchasedUpgrades.nitro ? 2000 : 1000;

        // Create camera controller
        this.gameCamera = new GameCamera(this.camera, this.playerCar);

        // Create input manager
        this.inputManager = new InputManager(this.playerCar);

        // Create cop AI
        this.copAI = new CopAI(this.scene, this.physics);

        // Update global state
        window.gameState.game = this;
        window.gameState.map = this.map;
        window.gameState.playerCar = this.playerCar;
        window.gameState.copAI = this.copAI;
        window.gameState.gameActive = true;
        window.gameState.selectedCar = this.playerCar.currentCar;

        // Change selected car if needed
        if (window.gameState.selectedCar !== 'street-racer') {
            this.playerCar.switchCar(window.gameState.selectedCar);
        }

        console.log('Game started successfully');
    }

    update(deltaTime) {
        if (!this.gameActive || !this.playerCar) return;

        // Update input
        this.inputManager.update();

        // Update player car
        this.playerCar.update(deltaTime);

        // Update physics
        this.physics.update(deltaTime);

        // Update cop AI
        const heatLevel = this.copAI.update(this.playerCar, deltaTime);

        // Check if caught by cops
        if (this.copAI.playerCaught) {
            this.playerCar.addRep(-100);
            this.copAI.clearAllCops();
            const spawnPoint = this.map.getSpawnPoint();
            this.playerCar.reset(spawnPoint);
        }

        // Award rep for surviving evasion
        this.evadeTimer += deltaTime;
        if (this.copAI.getCopCount() > 0 && this.evadeTimer > 5) {
            this.playerCar.addRep(50 * this.copAI.getCopCount());
            this.evadeTimer = 0;
        }

        // Award rep for driving (small amount)
        const speed = this.playerCar.getSpeed();
        if (speed > 80) {
            this.playerCar.addRep(0.1);
        }

        // Update camera
        this.gameCamera.update();

        // Update HUD
        this.uiManager.updateHUD(this.playerCar, heatLevel, this.copAI.getCopCount());
        this.uiManager.updateMinimap(this.playerCar, this.scene);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const now = Date.now();
        const deltaTime = (now - (this.lastTime || now)) / 1000;
        this.lastTime = now;

        this.update(deltaTime);
        this.render();
        this.frameCount++;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    endGame() {
        this.gameActive = false;
        
        // Save progress
        this.shop.saveProgress(this.playerCar);
        
        // Add to leaderboard
        const playerName = prompt('Enter your name for the leaderboard:', 'Player');
        if (playerName) {
            const rank = this.leaderboard.addScore(playerName, Math.floor(this.playerCar.rep));
            alert(`Final Rep: ${Math.floor(this.playerCar.rep)}\nRank: ${rank}`);
        }
        
        this.uiManager.showScreen('title');
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing NFS Heat game...');
    window.heatGame = new Game();
    console.log('Game initialized');
});

// Prevent context menu
document.addEventListener('contextmenu', (e) => e.preventDefault());
