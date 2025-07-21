// Multiplayer Bomberman Game (Local Demo Version)
class MultiplayerBomberman {
    constructor() {
        this.roomId = null;
        this.playerId = null;
        this.players = new Map();
        this.gameState = {
            playerLives: 3,
            playerBombCount: 1,
            playerFirePower: 1,
            gameOver: false,
            winner: null
        };
        
        this.init();
    }

    async init() {
        try {
            // Get room ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            this.roomId = urlParams.get('room');
            
            if (!this.roomId) {
                throw new Error('No room ID provided');
            }

            // Generate player info
            this.playerId = this.generatePlayerId();
            
            // Add demo players
            this.addDemoPlayers();
            
            // Start the game
            this.startGame();
            
        } catch (error) {
            console.error('Failed to initialize multiplayer game:', error);
            alert('Failed to initialize multiplayer game. Please try again.');
            window.location.href = 'lobby.html';
        }
    }



    generatePlayerId() {
        return 'player-' + Math.random().toString(36).substring(2, 15);
    }

    generatePlayerName() {
        const names = ['Bomber', 'Exploder', 'Blaster', 'Detonator', 'Fuse', 'Spark', 'Boom', 'Kaboom'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomNumber = Math.floor(Math.random() * 999) + 1;
        return `${randomName}${randomNumber}`;
    }

    addDemoPlayers() {
        const demoNames = ['Bomber123', 'Exploder456', 'Blaster789'];
        demoNames.forEach((name, index) => {
            const demoPlayerId = `demo-${index + 1}`;
            this.players.set(demoPlayerId, {
                id: demoPlayerId,
                name: name,
                lives: 3,
                position: null,
                isDead: false
            });
        });
    }

    startGame() {
        // Initialize Kaboom game
        this.initKaboomGame();
    }

    initKaboomGame() {
        // Initialize Kaboom with the same configuration as the original game
        kaboom({
            global: true,
            width: 780,
            height: 520,
            scale: 1.5,
            debug: false,
            clearColor: [0,0,0,1]
        });

        // Load sprites (same as original game)
        this.loadSprites();
        
        // Start the game scene
        this.startGameScene();
    }

    loadSprites() {
        const TILE_SIZE = 26;
        
        // Load all sprites with full paths
        loadSprite('wall-steel', 'https://i.imgur.com/EkleLlt.png'); 
        loadSprite('brick-red', 'https://i.imgur.com/C46n8aY.png');
        loadSprite('door', 'https://i.imgur.com/Ou9w4gH.png');
        loadSprite('kaboom', 'https://i.imgur.com/o9WizfI.png');
        loadSprite('bg', 'https://i.imgur.com/qIXIczt.png');
        loadSprite('wall-gold', 'https://i.imgur.com/VtTXsgH.png');
        loadSprite('brick-wood', 'https://i.imgur.com/U751RRV.png');

        // Load original Bomberman sprite
        loadSprite('bomberman', './images/bombermon.png', {
            sliceX: 7,
            sliceY: 4,
            anims: {
                // Row 1 (frames 0-6): Up movement
                idleUp: { from: 0, to: 0 },
                moveUp: { from: 1, to: 6 },
                
                // Row 2 (frames 7-13): Right movement
                idleRight: { from: 7, to: 7 },
                moveRight: { from: 8, to: 13 },
                
                // Row 3 (frames 14-20): Down movement
                idleDown: { from: 14, to: 14 },
                moveDown: { from: 15, to: 20 },
                
                // Row 4 (frames 21-27): Left movement
                idleLeft: { from: 21, to: 21 },
                moveLeft: { from: 22, to: 27 },
            }
        });

        loadSprite('bomb', 'https://i.imgur.com/etY46bP.png', {
            sliceX: 3,
            anims: {
                tick: { from: 0, to: 2 },
            }
        });

        loadSprite('explosion', 'https://i.imgur.com/baBxoqs.png', { 
            sliceX: 5,
            sliceY: 5,
        });

        // Power-ups
        loadSprite('powerup-bomb', 'https://i.imgur.com/C46n8aY.png');
        loadSprite('powerup-fire', 'https://i.imgur.com/U751RRV.png');
        loadSprite('powerup-speed', 'https://i.imgur.com/VtTXsgH.png');
    }

    startGameScene() {
        scene('game', () => {
            layers(['bg', 'obj', 'ui'], 'obj');

            const TILE_SIZE = 26;
            const MOVE_SPEED = 130;
            const BOT_SPEED = 80;
            const BOMB_TIMER = 3;
            const EXPLOSION_DURATION = 1;

            // Level map (same as original)
            const levelMap = [
                'aaaaaaaaaaaaaaa',
                'a @ z z z z z a',
                'a z a z a z a a',
                'a z z z z z z a', 
                'a z a z a z a a',
                'a z z z z z z a',
                'a z a z a z a a',
                'a z z z z z z a',
                'a z a z a z a a',
                'a z z z z z z a',
                'a z a z a z a a',
                'a z z z & z z a',
                'a z a z a z a a',
                'a $ z z * z # a',
                'aaaaaaaaaaaaaaa',
            ];

            const levelCfg = {
                width: TILE_SIZE,
                height: TILE_SIZE,
                a: [sprite('wall-steel'), 'wall', solid()],
                z: [sprite('brick-red'), 'wall', 'brick', solid(), { destructible: true }],
                '@': [sprite('bomberman'), scale(1.5), 'player', { 
                    dir: vec2(0, 0), 
                    lives: 3, 
                    bombCount: 1, 
                    firePower: 1,
                    lastBombTime: 0,
                    moving: false,
                    playerId: this.playerId
                }],
                '$': [sprite('bomberman'), scale(1.5), 'bot', 'enemy', { 
                    id: 0,
                    dir: vec2(1, 0), 
                    lives: 3,
                    lastMoveTime: 0,
                    targetPos: null,
                    avoidBombs: true,
                    moveTimer: 0
                }],
                '&': [sprite('bomberman'), scale(1.5), 'bot', 'enemy', { 
                    id: 1,
                    dir: vec2(-1, 0), 
                    lives: 3,
                    lastMoveTime: 0,
                    targetPos: null,
                    avoidBombs: true,
                    moveTimer: 0
                }],
                '*': [sprite('bomberman'), scale(1.5), 'bot', 'enemy', { 
                    id: 2,
                    dir: vec2(0, 1), 
                    lives: 3,
                    lastMoveTime: 0,
                    targetPos: null,
                    avoidBombs: true,
                    moveTimer: 0
                }],
                '#': [sprite('bomberman'), scale(1.5), 'bot', 'enemy', { 
                    id: 3,
                    dir: vec2(0, -1), 
                    lives: 3,
                    lastMoveTime: 0,
                    targetPos: null,
                    avoidBombs: true,
                    moveTimer: 0
                }],
            };

            const gameLevel = addLevel(levelMap, levelCfg);
            add([sprite('bg'), layer('bg')]);

            // UI Elements
            const livesLabel = add([
                text('Lives: ' + this.gameState.playerLives),
                pos(20, 20),
                layer('ui'),
                scale(0.8)
            ]);

            const bombsLabel = add([
                text('Bombs: ' + this.gameState.playerBombCount),
                pos(20, 40),
                layer('ui'),
                scale(0.8)
            ]);

            const fireLabel = add([
                text('Fire: ' + this.gameState.playerFirePower),
                pos(20, 60),
                layer('ui'),
                scale(0.8)
            ]);

            const statusLabel = add([
                text('Multiplayer Game!'),
                pos(width()/2, 30),
                origin('center'),
                layer('ui'),
                scale(1)
            ]);

            // Get player and bots
            const player = get('player')[0];
            const bots = get('bot');

            // Initialize player properties and snap to grid
            if (player) {
                player.pos = this.snapToGrid(player.pos);
                player.isMoving = false;
                player.targetPos = null;
                player.lastDirection = 'down';
                player.lastBombTime = 0;
                player.lastMoveTime = 0;
                player.moveDelay = 0.16;
            }

            // Initialize bots on grid
            bots.forEach(bot => {
                bot.pos = this.snapToGrid(bot.pos);
                bot.lastMoveTime = rand(1, 3);
                bot.isMoving = false;
                bot.moveTimer = 0;
            });

            // Player movement controls
            this.setupPlayerControls(player);

            // Bot AI
            this.setupBotAI(bots);

            // Bomb and explosion system
            this.setupBombSystem();

            // Update UI
            this.updateGameUI(livesLabel, bombsLabel, fireLabel);
        });

        go('game');
    }

    snapToGrid(pos) {
        const TILE_SIZE = 26;
        return vec2(
            Math.round(pos.x / TILE_SIZE) * TILE_SIZE,
            Math.round(pos.y / TILE_SIZE) * TILE_SIZE
        );
    }

    setupPlayerControls(player) {
        if (!player) return;

        // Player movement
        const tryMovePlayer = (direction) => {
            if (!this.gameState.gameOver && player && !player.isMoving && 
                time() - player.lastMoveTime >= player.moveDelay) {
                
                let targetPos;
                switch(direction) {
                    case 'left':
                        targetPos = player.pos.add(vec2(-26, 0));
                        break;
                    case 'right':
                        targetPos = player.pos.add(vec2(26, 0));
                        break;
                    case 'up':
                        targetPos = player.pos.add(vec2(0, -26));
                        break;
                    case 'down':
                        targetPos = player.pos.add(vec2(0, 26));
                        break;
                }
                
                if (this.isValidPosition(targetPos)) {
                    this.movePlayerTo(player, targetPos, direction);
                    player.lastMoveTime = time();
                }
            }
        };

        // Key controls
        keyDown('left', () => tryMovePlayer('left'));
        keyDown('right', () => tryMovePlayer('right'));
        keyDown('up', () => tryMovePlayer('up'));
        keyDown('down', () => tryMovePlayer('down'));

        // Bomb placement
        keyPress('space', () => {
            if (!this.gameState.gameOver && player && time() - player.lastBombTime > 0.5) {
                const bombPos = this.snapToGrid(player.pos);
                this.placeBomb(bombPos, 'player');
                player.lastBombTime = time();
            }
        });
    }

    setupBotAI(bots) {
        // Bot AI logic (simplified for multiplayer)
        action('bot', (bot) => {
            if (time() - bot.lastMoveTime > 2) {
                const directions = [
                    vec2(-26, 0), vec2(26, 0), vec2(0, -26), vec2(0, 26)
                ];
                const randomDir = choose(directions);
                const targetPos = bot.pos.add(randomDir);
                
                if (this.isValidPosition(targetPos)) {
                    bot.pos = targetPos;
                }
                bot.lastMoveTime = time();
            }
        });
    }

    setupBombSystem() {
        // Bomb explosion logic
        action('bomb', (bomb) => {
            if (time() - bomb.created > 3) {
                this.explodeBomb(bomb);
            }
        });
    }

    isValidPosition(pos) {
        const TILE_SIZE = 26;
        const gridX = Math.round(pos.x / TILE_SIZE);
        const gridY = Math.round(pos.y / TILE_SIZE);
        
        if (gridX < 0 || gridY < 0 || gridX >= 15 || gridY >= 15) {
            return false;
        }
        
        const allWalls = get('wall');
        const allBricks = get('brick');
        const allBombs = get('bomb');
        
        for (let wall of allWalls) {
            if (wall.pos.dist(pos) < TILE_SIZE / 2) {
                return false;
            }
        }
        
        for (let brick of allBricks) {
            if (brick.pos.dist(pos) < TILE_SIZE / 2) {
                return false;
            }
        }
        
        for (let bomb of allBombs) {
            if (bomb.pos.dist(pos) < TILE_SIZE / 2) {
                return false;
            }
        }
        
        return true;
    }

    movePlayerTo(player, targetPos, direction) {
        if (player.isMoving || !this.isValidPosition(targetPos)) {
            return false;
        }

        player.isMoving = true;
        player.startPos = vec2(player.pos.x, player.pos.y);
        player.targetPos = targetPos;
        player.lastDirection = direction;
        player.moveProgress = 0;
        player.moveSpeed = 6;
        
        const animMap = {
            'left': 'moveLeft',
            'right': 'moveRight', 
            'up': 'moveUp',
            'down': 'moveDown'
        };
        player.play(animMap[direction]);

        return true;
    }

    placeBomb(position, owner) {
        const bomb = add([
            sprite('bomb'),
            pos(position),
            'bomb',
            { owner: owner, created: time() }
        ]);
        
        bomb.play('tick');
    }

    explodeBomb(bomb) {
        const bombPos = bomb.pos;
        destroy(bomb);
        
        // Create explosion
        this.createExplosion(bombPos);
        
        // Check for player damage
        const player = get('player')[0];
        if (player && player.pos.dist(bombPos) < 26) {
            this.damagePlayer(player);
        }
    }

    createExplosion(position) {
        const explosion = add([
            sprite('explosion'),
            pos(position),
            'explosion',
            { created: time() }
        ]);
        
        // Remove explosion after 1 second
        wait(1, () => {
            destroy(explosion);
        });
    }

    damagePlayer(player) {
        player.lives--;
        this.gameState.playerLives = player.lives;
        
        if (player.lives <= 0) {
            this.gameOver('bots');
        }
        

    }

    gameOver(winner) {
        this.gameState.gameOver = true;
        this.gameState.winner = winner;
        
        add([
            text(winner === 'player' ? 'You Win!' : 'Game Over!'),
            pos(width()/2, height()/2),
            origin('center'),
            scale(2)
        ]);
        
        wait(3, () => {
            window.location.href = 'lobby.html';
        });
    }

    updateGameUI(livesLabel, bombsLabel, fireLabel) {
        action(() => {
            livesLabel.text = 'Lives: ' + this.gameState.playerLives;
            bombsLabel.text = 'Bombs: ' + this.gameState.playerBombCount;
            fireLabel.text = 'Fire: ' + this.gameState.playerFirePower;
        });
    }

    // Multiplayer event handlers
    handlePlayerMove(data) {
        // Handle other player movement
        console.log('Player moved:', data);
    }

    handlePlayerBomb(data) {
        // Handle other player bomb placement
        console.log('Player placed bomb:', data);
        const bombPos = vec2(data.position.x, data.position.y);
        this.placeBomb(bombPos, 'remote');
    }

    handlePlayerDeath(data) {
        // Handle other player death
        console.log('Player died:', data);
        const player = this.players.get(data.playerId);
        if (player) {
            player.lives = 0;
            player.isDead = true;
            this.updatePlayerUI();
        }
    }

    handleGameState(data) {
        // Handle game state updates
        console.log('Game state update:', data);
        this.gameState = { ...this.gameState, ...data.state };
    }

    updatePlayerUI() {
        const playerListElement = document.getElementById('playerList');
        if (!playerListElement) return;

        playerListElement.innerHTML = '';

        this.players.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.className = `player-info ${player.id === this.playerId ? 'self' : ''} ${player.isDead ? 'dead' : ''}`;
            
            playerElement.innerHTML = `
                <div>${player.name}</div>
                <div>Lives: ${player.lives}</div>
            `;
            
            playerListElement.appendChild(playerElement);
        });
    }
}

// Initialize multiplayer game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MultiplayerBomberman();
}); 