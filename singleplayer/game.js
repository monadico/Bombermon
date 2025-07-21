kaboom({
  global: true,
  width: 780,
  height: 520,
  scale: 1.5,
  debug: false,
  clearColor: [0,0,0,1]
})

const TILE_SIZE = 26;
const MOVE_SPEED = 130;
const BOT_SPEED = 80;
const BOMB_TIMER = 3;
const EXPLOSION_DURATION = 1;

// Load all sprites from local sprites folder
loadSprite('wall-steel', '../sprites/wall-steel.png'); 
loadSprite('brick-red', '../sprites/brick-red.png');
loadSprite('door', '../sprites/door.png');
loadSprite('kaboom', '../sprites/kaboom.png');
loadSprite('bg', '../sprites/bg.png');
loadSprite('wall-gold', '../sprites/wall-gold.png');
loadSprite('brick-wood', '../sprites/brick-wood.png');

// Load original Bomberman sprite
loadSprite('bomberman', '../images/bombermon.png', {
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

// Bot sprites (using original Bomberman sprite)
loadSprite('bot1', '../images/bombermon.png', {
  sliceX: 7,
  sliceY: 4,
  anims: {
    idle: { from: 14, to: 14 },
    move: { from: 15, to: 20 },
  }
});

loadSprite('bomb', '../sprites/bomb.png', {
  sliceX: 3,
  anims: {
    tick: { from: 0, to: 2 },
  }
});

loadSprite('explosion', '../sprites/explosion.png', { 
  sliceX: 5,
  sliceY: 5,
});

// Power-ups
loadSprite('powerup-bomb', '../sprites/powerup-bomb.png');
loadSprite('powerup-fire', '../sprites/powerup-fire.png');
loadSprite('powerup-speed', '../sprites/powerup-speed.png');

scene('game', () => {
  layers(['bg', 'obj', 'ui'], 'obj');

  // Game state
  let gameState = {
    playerLives: 3,
    botLives: [3, 3, 3],
    playerBombCount: 1,
    playerFirePower: 1,
    gameOver: false,
    winner: null
  };

  // Level map
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
      moving: false
    }],
    '$': [sprite('bot1'), scale(1.5), 'bot', 'enemy', { 
      id: 0,
      dir: vec2(1, 0), 
      lives: 3,
      lastMoveTime: 0,
      targetPos: null,
      avoidBombs: true,
      moveTimer: 0
    }],
    '&': [sprite('bot1'), scale(1.5), 'bot', 'enemy', { 
      id: 1,
      dir: vec2(-1, 0), 
      lives: 3,
      lastMoveTime: 0,
      targetPos: null,
      avoidBombs: true,
      moveTimer: 0
    }],
    '*': [sprite('bot1'), scale(1.5), 'bot', 'enemy', { 
      id: 2,
      dir: vec2(0, 1), 
      lives: 3,
      lastMoveTime: 0,
      targetPos: null,
      avoidBombs: true,
      moveTimer: 0
    }],
    '#': [sprite('bot1'), scale(1.5), 'bot', 'enemy', { 
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
    text('Lives: ' + gameState.playerLives),
    pos(20, 20),
    layer('ui'),
    scale(0.8)
  ]);

  const bombsLabel = add([
    text('Bombs: ' + gameState.playerBombCount),
    pos(20, 40),
    layer('ui'),
    scale(0.8)
  ]);

  const fireLabel = add([
    text('Fire: ' + gameState.playerFirePower),
    pos(20, 60),
    layer('ui'),
    scale(0.8)
  ]);

  const statusLabel = add([
    text('Fight!'),
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
    player.pos = snapToGrid(player.pos);
    player.isMoving = false;
    player.targetPos = null;
    player.lastDirection = 'down';
    player.lastBombTime = 0;
    player.lastMoveTime = 0;
    player.moveDelay = 0.16; // Time between moves when holding key (lower = faster)
  }

        // GRID MOVEMENT HELPER FUNCTIONS
   function snapToGrid(pos) {
     return vec2(
       Math.round(pos.x / TILE_SIZE) * TILE_SIZE,
       Math.round(pos.y / TILE_SIZE) * TILE_SIZE
     );
   }

   // Initialize bots on grid
   bots.forEach(bot => {
     bot.pos = snapToGrid(bot.pos);
     bot.lastMoveTime = rand(1, 3); // Stagger bot movement
     bot.isMoving = false;
     bot.moveTimer = 0;
   });

  function isValidPosition(pos) {
    const gridX = Math.round(pos.x / TILE_SIZE);
    const gridY = Math.round(pos.y / TILE_SIZE);
    
    // Check boundaries
    if (gridX < 0 || gridY < 0 || gridX >= 15 || gridY >= 15) {
      return false;
    }
    
    // Check for walls, bricks, and bombs by getting all objects and checking overlaps
    const allWalls = get('wall');
    const allBricks = get('brick');
    const allBombs = get('bomb');
    
    // Check if position overlaps with any wall or brick
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
    
    // Check if position overlaps with any bomb (bombs act as walls)
    for (let bomb of allBombs) {
      if (bomb.pos.dist(pos) < TILE_SIZE / 2) {
        return false;
      }
    }
    
    return true;
  }

  function movePlayerTo(targetPos, direction) {
    if (player.isMoving || !isValidPosition(targetPos)) {
      return false;
    }

    player.isMoving = true;
    player.startPos = vec2(player.pos.x, player.pos.y);
    player.targetPos = targetPos;
    player.lastDirection = direction;
    player.moveProgress = 0;
    player.moveSpeed = 6; // Higher = faster movement
    
    // Play movement animation
    const animMap = {
      'left': 'moveLeft',
      'right': 'moveRight', 
      'up': 'moveUp',
      'down': 'moveDown'
    };
    player.play(animMap[direction]);

    return true;
  }

  // Player movement animation action
  action('player', (p) => {
    if (p.isMoving && p.targetPos && p.startPos) {
      p.moveProgress += p.moveSpeed * dt();
      
      if (p.moveProgress >= 1) {
        // Movement complete
        p.pos = p.targetPos;
        p.isMoving = false;
        p.moveProgress = 0;
        
        // Play idle animation
        const idleMap = {
          'left': 'idleLeft',
          'right': 'idleRight',
          'up': 'idleUp', 
          'down': 'idleDown'
        };
        p.play(idleMap[p.lastDirection]);
      } else {
        // Interpolate position
        const lerpedPos = p.startPos.lerp(p.targetPos, p.moveProgress);
        p.pos = lerpedPos;
      }
    }
  });

  // PLAYER CONTROLS - Continuous movement when holding keys
  function tryMovePlayer(direction) {
    if (!gameState.gameOver && player && !player.isMoving && 
        time() - player.lastMoveTime >= player.moveDelay) {
      
      let targetPos;
      switch(direction) {
        case 'left':
          targetPos = player.pos.add(vec2(-TILE_SIZE, 0));
          break;
        case 'right':
          targetPos = player.pos.add(vec2(TILE_SIZE, 0));
          break;
        case 'up':
          targetPos = player.pos.add(vec2(0, -TILE_SIZE));
          break;
        case 'down':
          targetPos = player.pos.add(vec2(0, TILE_SIZE));
          break;
      }
      
      if (movePlayerTo(targetPos, direction)) {
        player.lastMoveTime = time();
      }
    }
  }

  // Continuous movement when holding arrow keys
  keyDown('left', () => {
    tryMovePlayer('left');
  });

  keyDown('right', () => {
    tryMovePlayer('right');
  });

  keyDown('up', () => {
    tryMovePlayer('up');
  });

  keyDown('down', () => {
    tryMovePlayer('down');
  });

  // Play idle animations when keys are released
  keyRelease('left', () => {
    if (player && !player.isMoving) {
      player.play('idleLeft');
      player.lastDirection = 'left';
    }
  });

  keyRelease('right', () => {
    if (player && !player.isMoving) {
      player.play('idleRight');
      player.lastDirection = 'right';
    }
  });

  keyRelease('up', () => {
    if (player && !player.isMoving) {
      player.play('idleUp');
      player.lastDirection = 'up';
    }
  });

  keyRelease('down', () => {
    if (player && !player.isMoving) {
      player.play('idleDown');
      player.lastDirection = 'down';
    }
  });

  keyPress('space', () => {
    if (!gameState.gameOver && player && time() - player.lastBombTime > 0.5) {
      // Place bomb on grid-aligned position
      const bombPos = snapToGrid(player.pos);
      placeBomb(bombPos, 'player');
      player.lastBombTime = time();
    }
  });

  // Note: Bot AI action moved to BOT MOVEMENT FUNCTION section for better organization

  // BOT AI FUNCTION
  function botAI(bot) {
    if (!player || !player.pos || !bot || !bot.pos) return;
    
    const playerPos = player.pos;
    const botPos = bot.pos;
    
    // Snap bot to grid
    bot.pos = snapToGrid(bot.pos);
    
    // Check for nearby bombs and avoid them
    const nearbyBombs = get('bomb').filter(bomb => 
      bomb && bomb.pos && bomb.pos.dist && bomb.pos.dist(botPos) < TILE_SIZE * 3
    );

    // Available movement directions
    const directions = [
      { vec: vec2(-TILE_SIZE, 0), name: 'left' },
      { vec: vec2(TILE_SIZE, 0), name: 'right' },
      { vec: vec2(0, -TILE_SIZE), name: 'up' },
      { vec: vec2(0, TILE_SIZE), name: 'down' }
    ];

    // Filter valid moves
    const validMoves = directions.filter(dir => {
      const targetPos = botPos.add(dir.vec);
      return isValidPosition(targetPos);
    });

    if (validMoves.length === 0) return; // Bot is stuck

    // If bombs nearby, try to escape
    if (nearbyBombs.length > 0) {
      const safeMoves = validMoves.filter(dir => {
        const targetPos = botPos.add(dir.vec);
        return !nearbyBombs.some(bomb => bomb.pos.dist(targetPos) < TILE_SIZE * 2);
      });
      
      if (safeMoves.length > 0) {
        const escapeMove = choose(safeMoves);
        moveBotTo(bot, botPos.add(escapeMove.vec));
        return;
      }
    }

    // Random chance to place bomb if player is nearby
    if (botPos.dist(playerPos) < TILE_SIZE * 3 && rand() < 0.2) {
      placeBomb(snapToGrid(botPos), 'bot');
    }

    // Choose movement: chase player or move randomly
    let chosenMove;
    if (rand() < 0.7) {
      // Try to move towards player
      const dx = playerPos.x - botPos.x;
      const dy = playerPos.y - botPos.y;
      
      let preferredMoves = [];
      if (Math.abs(dx) > Math.abs(dy)) {
        // Move horizontally
        preferredMoves = validMoves.filter(dir => 
          (dx > 0 && dir.name === 'right') || (dx < 0 && dir.name === 'left')
        );
      } else {
        // Move vertically
        preferredMoves = validMoves.filter(dir =>
          (dy > 0 && dir.name === 'down') || (dy < 0 && dir.name === 'up')
        );
      }
      
      chosenMove = preferredMoves.length > 0 ? choose(preferredMoves) : choose(validMoves);
    } else {
      // Random movement
      chosenMove = choose(validMoves);
    }

    if (chosenMove) {
      moveBotTo(bot, botPos.add(chosenMove.vec));
    }
  }

  // BOT MOVEMENT FUNCTION
  function moveBotTo(bot, targetPos) {
    if (bot.isMoving) return;
    
    bot.isMoving = true;
    bot.startPos = vec2(bot.pos.x, bot.pos.y);
    bot.targetPos = targetPos;
    bot.moveProgress = 0;
    bot.moveSpeed = 4; // Slightly slower than player
  }

  // Bot movement animation action
  action('bot', (bot) => {
    if (gameState.gameOver) return;
    
    // Handle smooth movement
    if (bot.isMoving && bot.targetPos && bot.startPos) {
      bot.moveProgress += bot.moveSpeed * dt();
      
      if (bot.moveProgress >= 1) {
        // Movement complete
        bot.pos = bot.targetPos;
        bot.isMoving = false;
        bot.moveProgress = 0;
      } else {
        // Interpolate position
        const lerpedPos = bot.startPos.lerp(bot.targetPos, bot.moveProgress);
        bot.pos = lerpedPos;
      }
    }
    
    // Handle AI decisions
    bot.moveTimer += dt();
    if (bot.moveTimer > bot.lastMoveTime && !bot.isMoving) {
      botAI(bot);
      bot.moveTimer = 0;
      bot.lastMoveTime = rand(0.8, 1.5);
    }
  });

  // BOMB PLACEMENT
  function placeBomb(position, owner) {
    if (!position) return;
    
    const bomb = add([
      sprite('bomb'),
      pos(position.x, position.y),
      'bomb',
      {
        owner: owner,
        timer: BOMB_TIMER,
        firePower: owner === 'player' ? gameState.playerFirePower : 1
      }
    ]);
    
    bomb.play('tick');
    
    // Bomb countdown
    const countdown = setInterval(() => {
      bomb.timer -= 0.1;
      if (bomb.timer <= 0) {
        clearInterval(countdown);
        explodeBomb(bomb);
      }
    }, 100);
  }

  // BOMB EXPLOSION
  function explodeBomb(bomb) {
    if (!bomb || !bomb.exists()) return;
    
    const bombPos = bomb.pos;
    const firePower = bomb.firePower || 1;
    
    if (!bombPos) return;
    
    destroy(bomb);
    
    // Create explosion at bomb position
    createExplosion(bombPos, 12); // center
    
    // Create explosions in 4 directions
    const directions = [
      { dir: vec2(0, -1), frame: 2 }, // up
      { dir: vec2(0, 1), frame: 22 }, // down  
      { dir: vec2(-1, 0), frame: 10 }, // left
      { dir: vec2(1, 0), frame: 14 }  // right
    ];
    
    directions.forEach(({dir, frame}) => {
      for (let i = 1; i <= firePower; i++) {
        if (!bombPos.add) return;
        const explosionPos = bombPos.add(dir.scale(TILE_SIZE * i));
        
        // Check what's at explosion position
        const allWalls = get('wall');
        const allBricks = get('brick');
        
        // Find walls and bricks at this position
        const wallsHit = allWalls.filter(wall => wall.pos.dist(explosionPos) < TILE_SIZE / 2);
        const bricksHit = allBricks.filter(brick => brick.pos.dist(explosionPos) < TILE_SIZE / 2);
        
        // Check if we hit a solid wall (steel/gold) - stops explosion
        const solidWallHit = wallsHit.filter(wall => !wall.is('brick'));
        if (solidWallHit.length > 0) {
          break;
        }
        
        // Check if we hit destructible bricks
        if (bricksHit.length > 0) {
          // Destroy bricks and create explosion
          bricksHit.forEach(obj => {
            destroy(obj);
            // Chance to spawn power-up
            if (rand() < 0.3) {
              spawnPowerUp(explosionPos);
            }
          });
          createExplosion(explosionPos, frame);
          break; // Stop explosion after hitting brick
        } else {
          // Empty space - continue explosion
          createExplosion(explosionPos, frame);
        }
      }
    });
  }

  // CREATE EXPLOSION
  function createExplosion(position, frame) {
    if (!position) return;
    
    const explosion = add([
      sprite('explosion', { frame: frame }),
      pos(position.x, position.y),
      scale(1.5),
      'explosion'
    ]);

    wait(EXPLOSION_DURATION, () => {
      destroy(explosion);
    });
  }

  // SPAWN POWER-UP
  function spawnPowerUp(position) {
    if (!position) return;
    
    const powerUpTypes = ['bomb', 'fire', 'speed'];
    const type = choose(powerUpTypes);
    
    add([
      sprite('powerup-' + type),
      pos(position.x, position.y),
      'powerup',
      { type: type }
    ]);
  }

  // COLLISIONS
  
    // Player hit by explosion
  if (player) {
    player.collides('explosion', () => {
      if (!gameState.gameOver) {
        gameState.playerLives--;
        livesLabel.text = 'Lives: ' + gameState.playerLives;
        
        if (gameState.playerLives <= 0) {
          gameOver('Bots Win!');
        } else {
          // Respawn player at starting position
          player.pos = vec2(TILE_SIZE, TILE_SIZE);
          player.isMoving = false;
        }
      }
    });
  }

  // Bot hit by explosion
  collides('bot', 'explosion', (bot, explosion) => {
    if (!gameState.gameOver) {
      gameState.botLives[bot.id]--;
      
      if (gameState.botLives[bot.id] <= 0) {
        destroy(bot);
        
        // Check if all bots are dead
        const aliveBots = get('bot').length - 1;
        if (aliveBots <= 0) {
          gameOver('Player Wins!');
        }
             } else {
         // Respawn bot at corner positions
         const spawnPositions = [
           vec2(TILE_SIZE, TILE_SIZE * 13),
           vec2(TILE_SIZE * 13, TILE_SIZE * 13), 
           vec2(TILE_SIZE * 13, TILE_SIZE)
         ];
         bot.pos = choose(spawnPositions);
       }
    }
  });

  // Player collects power-up
  if (player) {
    player.collides('powerup', (powerup) => {
      switch(powerup.type) {
        case 'bomb':
          gameState.playerBombCount++;
          bombsLabel.text = 'Bombs: ' + gameState.playerBombCount;
          break;
        case 'fire':
          gameState.playerFirePower++;
          fireLabel.text = 'Fire: ' + gameState.playerFirePower;
          break;
        case 'speed':
          // Increase player speed (would need to modify movement)
          break;
      }
      destroy(powerup);
    });
  }

  // Note: Removed bot-player collision death - players should only die from explosions

  // GAME OVER FUNCTION
  function gameOver(winner) {
    gameState.gameOver = true;
    gameState.winner = winner;
    statusLabel.text = winner;
    
    add([
      text('Press SPACE to restart', 16),
      pos(width()/2, height()/2 + 50),
      origin('center'),
      layer('ui')
    ]);
  }

  keyPress('space', () => {
    if (gameState.gameOver) {
      go('game');
    }
  });
});

scene('menu', () => {
  add([
    text('BOMBERMAN', 32),
    pos(width()/2, height()/2 - 50),
    origin('center')
  ]);
  
  add([
    text('Press SPACE to start', 16),
    pos(width()/2, height()/2 + 20),
    origin('center')
  ]);
  
  add([
    text('Arrow keys to move, SPACE to place bomb', 12),
    pos(width()/2, height()/2 + 60),
    origin('center')
  ]);

  keyPress('space', () => {
    go('game');
  });
});

go('menu');