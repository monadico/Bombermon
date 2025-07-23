// MultiSynq Bomberman Configuration
const GAME_CONFIG = {
    // MultiSynq Settings
    API_KEY: '234567_Paste_Your_Own_API_Key_Here_7654321', // Get your own from multisynq.io/coder
    APP_ID: 'io.multisynq.bomberman-multiplayer',
    
    // Game Settings
    TILE_SIZE: 26,
    MOVE_SPEED: 130,
    BOMB_TIMER: 3,
    EXPLOSION_DURATION: 1,
    
    // Player Settings
    MAX_PLAYERS: 4,
    DEFAULT_LIVES: 3,
    DEFAULT_BOMB_COUNT: 1,
    DEFAULT_FIRE_POWER: 1,
    
    // Timing Settings
    MOVE_DELAY: 160, // milliseconds between moves
    BOMB_COOLDOWN: 500, // milliseconds between bomb placements
    RESPAWN_DELAY: 2000, // milliseconds before respawn
    
    // Game Map
    LEVEL_MAP: [
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
    ],
    
    // Spawn positions for players
    SPAWN_POSITIONS: [
        { x: 26, y: 26 },           // Top-left
        { x: 26 * 13, y: 26 },      // Top-right  
        { x: 26, y: 26 * 13 },      // Bottom-left
        { x: 26 * 13, y: 26 * 13 }  // Bottom-right
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_CONFIG;
} 