// Leaderboard System
class LeaderboardSystem {
    constructor() {
        this.leaderboard = [
            { name: 'Racer_X', rep: 15000, timestamp: Date.now() },
            { name: 'NightRunner', rep: 12000, timestamp: Date.now() },
            { name: 'SpeedKing', rep: 10000, timestamp: Date.now() },
            { name: 'FastNFurious', rep: 8500, timestamp: Date.now() },
            { name: 'DriftMaster', rep: 7200, timestamp: Date.now() }
        ];

        this.loadLeaderboard();
    }

    addScore(playerName, rep) {
        this.leaderboard.push({
            name: playerName,
            rep: rep,
            timestamp: Date.now()
        });

        this.leaderboard.sort((a, b) => b.rep - a.rep);
        this.leaderboard = this.leaderboard.slice(0, 50); // Keep top 50

        this.saveLeaderboard();
        return this.getPlayerRank(playerName);
    }

    saveLeaderboard() {
        localStorage.setItem('nfs-heat-leaderboard', JSON.stringify(this.leaderboard));
    }

    loadLeaderboard() {
        const saved = localStorage.getItem('nfs-heat-leaderboard');
        if (saved) {
            this.leaderboard = JSON.parse(saved);
        }
    }

    getTopScores(limit = 10) {
        return this.leaderboard.slice(0, limit);
    }

    getPlayerRank(playerName) {
        const rank = this.leaderboard.findIndex(entry => entry.name === playerName);
        return rank >= 0 ? rank + 1 : null;
    }

    getPlayerScore(playerName) {
        const entry = this.leaderboard.find(e => e.name === playerName);
        return entry ? entry.rep : 0;
    }

    getLeaderboard() {
        return this.leaderboard;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeaderboardSystem;
}
