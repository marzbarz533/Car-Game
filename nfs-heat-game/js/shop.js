// Shop System
class ShopSystem {
    constructor() {
        this.inventory = {
            'street-racer': true,
            'muscle-car': false,
            'sports-car': false,
            'supercar': false
        };

        this.upgrades = {
            'turbo': { name: 'Turbo', price: 2000, bonus: 1.2 },
            'nitro': { name: 'Nitro Kit', price: 3000, bonus: 1.5 },
            'suspension': { name: 'Sport Suspension', price: 1500, bonus: 1.3 },
            'engine': { name: 'Engine Upgrade', price: 5000, bonus: 1.4 }
        };

        this.purchasedUpgrades = {
            'turbo': false,
            'nitro': false,
            'suspension': false,
            'engine': false
        };
    }

    buyCar(carType, money) {
        const cars = {
            'street-racer': 0,
            'muscle-car': 8000,
            'sports-car': 25000,
            'supercar': 50000
        };

        if (carType in cars && money >= cars[carType]) {
            this.inventory[carType] = true;
            return true;
        }
        return false;
    }

    buyUpgrade(upgradeType, money) {
        if (upgradeType in this.upgrades && money >= this.upgrades[upgradeType].price) {
            this.purchasedUpgrades[upgradeType] = true;
            return true;
        }
        return false;
    }

    getUpgradeBonus(upgradeType) {
        if (this.purchasedUpgrades[upgradeType]) {
            return this.upgrades[upgradeType].bonus;
        }
        return 1;
    }

    getAvailableCars() {
        return Object.entries(this.inventory)
            .filter(([_, owned]) => owned)
            .map(([carType, _]) => carType);
    }

    getAllCars() {
        return {
            'street-racer': { name: 'Street Racer', price: 0, owned: this.inventory['street-racer'] },
            'muscle-car': { name: 'Muscle Car', price: 8000, owned: this.inventory['muscle-car'] },
            'sports-car': { name: 'Sports Car', price: 25000, owned: this.inventory['sports-car'] },
            'supercar': { name: 'Supercar', price: 50000, owned: this.inventory['supercar'] }
        };
    }

    saveProgress(playerCar) {
        const save = {
            inventory: this.inventory,
            upgrades: this.purchasedUpgrades,
            rep: playerCar.rep,
            money: playerCar.money,
            currentCar: playerCar.currentCar
        };
        localStorage.setItem('nfs-heat-save', JSON.stringify(save));
    }

    loadProgress() {
        const save = localStorage.getItem('nfs-heat-save');
        if (save) {
            const data = JSON.parse(save);
            this.inventory = data.inventory || this.inventory;
            this.purchasedUpgrades = data.upgrades || this.purchasedUpgrades;
            return data;
        }
        return null;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShopSystem;
}
