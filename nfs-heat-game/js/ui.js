// UI Manager
class UIManager {
    constructor() {
        this.currentScreen = 'title';
        this.selectedCar = 'street-racer';
        this.screens = {
            'title': document.getElementById('titleScreen'),
            'carSelect': document.getElementById('carSelectScreen'),
            'shop': document.getElementById('shopScreen'),
            'leaderboard': document.getElementById('leaderboardScreen'),
            'game': document.getElementById('gameHUD')
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Title screen buttons
        document.getElementById('singleplayerBtn').addEventListener('click', () => {
            this.showScreen('carSelect');
            window.gameState = window.gameState || {};
            window.gameState.gameMode = 'singleplayer';
        });

        document.getElementById('multiplayerBtn').addEventListener('click', () => {
            alert('Multiplayer coming soon! For now, use Singleplayer.');
        });

        document.getElementById('leaderboardBtn').addEventListener('click', () => {
            this.showScreen('leaderboard');
            this.updateLeaderboard();
        });

        // Back buttons
        document.getElementById('backFromCarsBtn').addEventListener('click', () => {
            this.showScreen('title');
        });

        document.getElementById('backFromShopBtn').addEventListener('click', () => {
            if (window.gameState && window.gameState.gameActive) {
                this.showScreen('game');
            } else {
                this.showScreen('carSelect');
            }
        });

        document.getElementById('backFromLeaderboardBtn').addEventListener('click', () => {
            this.showScreen('title');
        });

        // Car selection
        this.updateCarGrid();
    }

    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
    }

    updateCarGrid() {
        const carGrid = document.getElementById('carGrid');
        carGrid.innerHTML = '';

        const cars = {
            'street-racer': { name: 'Street Racer', desc: 'Fast & Agile', price: 'FREE' },
            'muscle-car': { name: 'Muscle Car', desc: 'Raw Power', price: '$8,000' },
            'sports-car': { name: 'Sports Car', desc: 'Balanced', price: '$25,000' },
            'supercar': { name: 'Supercar', desc: 'Ultimate', price: '$50,000' }
        };

        Object.entries(cars).forEach(([carType, carInfo]) => {
            const div = document.createElement('div');
            div.className = 'car-option';
            if (carType === 'street-racer') div.classList.add('selected');
            div.innerHTML = `
                <h3>${carInfo.name}</h3>
                <p>${carInfo.desc}</p>
                <p style="color: #00ff00;">${carInfo.price}</p>
            `;
            div.addEventListener('click', () => {
                document.querySelectorAll('.car-option').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                this.selectedCar = carType;
                this.startGame(carType);
            });
            carGrid.appendChild(div);
        });
    }

    startGame(carType) {
        if (window.gameState) {
            window.gameState.selectedCar = carType;
            window.gameState.gameActive = true;
        }
        this.showScreen('game');
    }

    updateHUD(playerCar, heat, copCount) {
        const speed = Math.round(playerCar.getSpeed());
        document.getElementById('speedometer').textContent = speed;
        document.getElementById('repDisplay').textContent = Math.floor(playerCar.rep);
        document.getElementById('heatLevel').textContent = Math.ceil(heat);

        // Update heat bar
        const heatBar = document.getElementById('heatBar');
        const fillDiv = heatBar.querySelector('.heat-bar-fill') || (() => {
            const div = document.createElement('div');
            div.className = 'heat-bar-fill';
            heatBar.appendChild(div);
            return div;
        })();
        fillDiv.style.width = (heat / 5 * 100) + '%';

        // Show cop warning
        const copWarning = document.getElementById('copWarning');
        if (copCount > 0) {
            copWarning.style.display = 'block';
        } else {
            copWarning.style.display = 'none';
        }
    }

    updateMinimap(playerCar, scene) {
        const canvas = document.getElementById('minimapCanvas');
        const ctx = canvas.getContext('2d');
        const scale = 10; // pixels per game unit

        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Draw player
        const playerPos = playerCar.getPosition();
        const screenX = canvas.width / 2 + (playerPos.x / scale);
        const screenY = canvas.height / 2 + (playerPos.z / scale);

        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(screenX, screenY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw direction indicator
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        const carMesh = playerCar.mesh;
        const forwardDir = new THREE.Vector3(0, 0, -1);
        forwardDir.applyQuaternion(carMesh.quaternion);
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(screenX + forwardDir.x * 10, screenY + forwardDir.z * 10);
        ctx.stroke();
    }

    showShop(playerCar) {
        this.populateShop(playerCar);
        this.showScreen('shop');
    }

    populateShop(playerCar) {
        const shopCars = document.getElementById('shopCars');
        shopCars.innerHTML = '';

        const cars = {
            'street-racer': { name: 'Street Racer', desc: 'Fast & Agile', price: 0 },
            'muscle-car': { name: 'Muscle Car', desc: 'Raw Power', price: 8000 },
            'sports-car': { name: 'Sports Car', desc: 'Balanced', price: 25000 },
            'supercar': { name: 'Supercar', desc: 'Ultimate', price: 50000 }
        };

        Object.entries(cars).forEach(([carType, carInfo]) => {
            const div = document.createElement('div');
            div.className = 'shop-car-item';
            if (carType === playerCar.currentCar) div.classList.add('selected');
            div.innerHTML = `<h4>${carInfo.name}</h4><p>$${carInfo.price}</p>`;
            div.addEventListener('click', () => {
                document.querySelectorAll('.shop-car-item').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');

                document.getElementById('carName').textContent = carInfo.name;
                const stats = playerCar.carTypes[carType];
                document.getElementById('carStats').innerHTML = `
                    Speed: ${stats.maxSpeed}<br>
                    Acceleration: ${stats.acceleration}<br>
                    Handling: ${Math.round(stats.handling * 100)}%
                `;
                document.getElementById('carPrice').textContent = `$${carInfo.price}`;
                document.getElementById('buyCarBtn').onclick = () => {
                    if (playerCar.money >= carInfo.price) {
                        playerCar.money -= carInfo.price;
                        playerCar.switchCar(carType);
                        alert('Car purchased!');
                    } else {
                        alert('Not enough money!');
                    }
                };
            });
            shopCars.appendChild(div);
        });
    }

    updateLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';

        // Get leaderboard data
        const leaderboard = window.leaderboardData || [
            { name: 'Player', rep: 0 },
            { name: 'Racer_X', rep: 5000 },
            { name: 'NightRunner', rep: 4500 },
            { name: 'SpeedKing', rep: 4000 }
        ];

        leaderboard.sort((a, b) => b.rep - a.rep);

        leaderboard.forEach((entry, index) => {
            const div = document.createElement('div');
            div.className = 'leaderboard-entry';
            div.innerHTML = `
                <div class="leaderboard-rank">#${index + 1}</div>
                <div class="leaderboard-name">${entry.name}</div>
                <div class="leaderboard-rep">${Math.floor(entry.rep)} REP</div>
            `;
            leaderboardList.appendChild(div);
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
