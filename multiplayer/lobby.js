// Bomberman Multiplayer Lobby (Local Demo Version)
class BombermanLobby {
    constructor() {
        this.roomId = null;
        this.playerId = null;
        this.players = new Map();
        this.isReady = false;
        this.isHost = false;
        
        this.init();
    }

    async init() {
        try {
            // Generate room ID and player info
            this.roomId = this.getRoomIdFromURL() || this.generateRoomId();
            this.playerId = this.generatePlayerId();
            this.isHost = !this.getRoomIdFromURL(); // First player is host
            
            // Add local player
            this.players.set(this.playerId, {
                id: this.playerId,
                name: this.generatePlayerName(),
                ready: false,
                isHost: this.isHost
            });
            
            // Add some demo players for testing
            if (this.isHost) {
                this.addDemoPlayers();
            }
            
            // Update UI
            this.updateRoomCode();
            this.updatePlayerList();
            
        } catch (error) {
            console.error('Failed to initialize lobby:', error);
            this.showError('Failed to initialize lobby. Please try again.');
        }
    }

    addDemoPlayers() {
        const demoNames = ['Bomber123', 'Exploder456', 'Blaster789'];
        demoNames.forEach((name, index) => {
            const demoPlayerId = `demo-${index + 1}`;
            this.players.set(demoPlayerId, {
                id: demoPlayerId,
                name: name,
                ready: Math.random() > 0.5, // Random ready status
                isHost: false
            });
        });
    }

    generatePlayerId() {
        return 'player-' + Math.random().toString(36).substring(2, 15);
    }

    getRoomIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('room');
    }

    generateRoomId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    generatePlayerName() {
        const names = ['Bomber', 'Exploder', 'Blaster', 'Detonator', 'Fuse', 'Spark', 'Boom', 'Kaboom'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomNumber = Math.floor(Math.random() * 999) + 1;
        return `${randomName}${randomNumber}`;
    }

    updateRoomCode() {
        const roomCodeElement = document.getElementById('roomCode');
        if (roomCodeElement) {
            roomCodeElement.textContent = this.roomId;
            
            // Update URL with room code
            const url = new URL(window.location);
            url.searchParams.set('room', this.roomId);
            window.history.replaceState({}, '', url);
        }
    }

    updatePlayerList() {
        const playerListElement = document.getElementById('playerList');
        const playerCountElement = document.getElementById('playerCount');
        
        if (!playerListElement) return;

        // Update player count
        if (playerCountElement) {
            playerCountElement.textContent = this.players.size;
        }

        // Clear current list
        playerListElement.innerHTML = '';

        // Add each player
        this.players.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.className = `player-item ${player.ready ? 'ready' : ''}`;
            
            playerElement.innerHTML = `
                <div class="player-name">
                    ${player.name}
                    ${player.isHost ? ' 👑' : ''}
                </div>
                <div class="player-status ${player.ready ? 'ready' : ''}">
                    ${player.ready ? 'Ready' : 'Not Ready'}
                </div>
            `;
            
            playerListElement.appendChild(playerElement);
        });

        // Update start button
        this.updateStartButton();
    }

    updateStartButton() {
        const startBtn = document.getElementById('startBtn');
        if (!startBtn) return;

        const readyPlayers = Array.from(this.players.values()).filter(p => p.ready).length;
        const totalPlayers = this.players.size;
        
        // Enable start button if host and at least 2 players are ready
        const canStart = this.isHost && readyPlayers >= 2 && totalPlayers >= 2;
        startBtn.disabled = !canStart;
    }

    toggleReady() {
        this.isReady = !this.isReady;
        
        // Update local player
        const localPlayer = this.players.get(this.playerId);
        if (localPlayer) {
            localPlayer.ready = this.isReady;
        }

        // Update button text
        const readyBtn = document.getElementById('readyBtn');
        if (readyBtn) {
            readyBtn.textContent = this.isReady ? 'Not Ready' : 'Ready';
        }

        this.updatePlayerList();
    }

    startGame() {
        if (!this.isHost) return;

        // Redirect to game
        window.location.href = `game.html?room=${this.roomId}`;
    }

    leaveLobby() {
        window.location.href = '../index.html';
    }

    showError(message) {
        const playerList = document.getElementById('playerList');
        if (playerList) {
            playerList.innerHTML = `
                <div style="text-align: center; color: #ff6b6b; padding: 20px;">
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }
}

// Global functions for HTML buttons
let lobby;

function toggleReady() {
    if (lobby) {
        lobby.toggleReady();
    }
}

function startGame() {
    if (lobby) {
        lobby.startGame();
    }
}

function leaveLobby() {
    if (lobby) {
        lobby.leaveLobby();
    }
}

// Initialize lobby when page loads
document.addEventListener('DOMContentLoaded', () => {
    lobby = new BombermanLobby();
}); 