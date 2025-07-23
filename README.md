# 🎮 Multiplayer Bomberman - MultiSynq Edition

A real-time multiplayer Bomberman game built with [MultiSynq](https://multisynq.io) for deterministic client-side synchronization and [Kaboom.js](https://kaboomjs.com) for game rendering.

## 🚀 Quick Start

### 1. Get Your MultiSynq API Key
1. Visit [multisynq.io/coder](https://multisynq.io/coder)
2. Sign up for a free account (no credit card required)
3. Copy your API key

### 2. Configure the Game
1. Open `game.html` in a text editor
2. Replace `'234567_Paste_Your_Own_API_Key_Here_7654321'` with your actual API key
3. Or update the `API_KEY` in `config.js`

### 3. Run the Game
1. Start a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
2. Open your browser to `http://localhost:8000/game.html`
3. Share the URL with friends to play together!

## 🎯 How to Play

### Controls
- **Arrow Keys** or **WASD**: Move your Bomberman
- **Spacebar**: Place bomb (or restart game when game over)

### Objective
- Destroy other players with bombs while avoiding getting caught in explosions
- Last player standing wins!
- Collect power-ups to become stronger

### Power-ups
- 💣 **Bomb Power-up**: Increases number of bombs you can place
- 🔥 **Fire Power-up**: Increases explosion radius
- ⚡ **Speed Power-up**: Increases movement speed (planned feature)

### Game Mechanics
- **Lives**: Each player starts with 3 lives
- **Grid Movement**: Players move on a tile-based grid
- **Bomb Timer**: Bombs explode after 3 seconds
- **Destructible Blocks**: Red bricks can be destroyed, revealing power-ups
- **Steel Walls**: Indestructible gray blocks that stop explosions

## 🏗️ Technical Architecture

### MultiSynq Integration
This game uses **MultiSynq** for multiplayer synchronization, which means:
- ✅ **No server code needed** - all game logic runs on each client
- ✅ **Deterministic gameplay** - same inputs produce same results everywhere
- ✅ **Low latency** - only input events are sent over network
- ✅ **Automatic state sync** - game state stays synchronized automatically

### Game Models (Synchronized)
- **`GameModel`**: Root model managing overall game state
- **`PlayerModel`**: Individual player data (position, lives, power-ups)
- **`BombModel`**: Bomb instances with countdown and explosion logic
- **`ExplosionModel`**: Explosion effects and damage areas
- **`PowerUpModel`**: Collectible items on the map

### View Layer (Local Rendering)
- **`GameView`**: Handles rendering, input capture, and UI updates
- **Smooth Animation**: 60fps interpolation between synchronized positions
- **Input Publishing**: Captures controls and sends to player's model

## 🎮 Multiplayer Features

### Player Management
- **Auto-spawn**: Players automatically join when connecting
- **Up to 4 players**: Supports 2-4 players simultaneously
- **Dynamic lobby**: Players can join/leave during gameplay
- **Player identification**: Visual indicators for local vs remote players

### Real-time Synchronization
- **Grid-based movement**: All players move on synchronized grid
- **Bomb synchronization**: Explosions happen simultaneously for all players
- **Animation sync**: Walking animations stay synchronized
- **State preservation**: Game continues even if players reconnect

### Game Flow
1. **Lobby Phase**: Wait for at least 2 players to join
2. **Game Start**: Automatic game start when enough players present
3. **Live Gameplay**: Real-time multiplayer action
4. **Game Over**: Winner announced, restart with SPACE
5. **Restart**: All players reset, new game begins

## 🔧 Development

### File Structure
```
bomberman/
├── game.html          # Main multiplayer game file
├── config.js          # Game configuration
├── index.html         # Lobby system  
├── singleplayer/      # Original singleplayer version
│   ├── game.js
│   ├── singleplayer.html
│   ├── images/        # Sprite files
│   └── sprites/       # Game assets
└── README.md          # This file
```

### Key Technologies
- **MultiSynq**: Client-side multiplayer synchronization
- **Kaboom.js**: 2D game engine and rendering
- **HTML5 Canvas**: Game rendering surface
- **JavaScript ES6+**: Modern web development

### Preserved Singleplayer Features
All original gameplay mechanics are preserved:
- ✅ Grid-based movement with smooth animations
- ✅ Bomb placement and explosion mechanics
- ✅ Destructible walls and power-up spawning
- ✅ Player lives and respawn system
- ✅ Original sprite animations and visual style
- ✅ Collision detection and game physics

## 🎨 Customization

### Modifying Game Settings
Edit `config.js` to adjust:
- Movement speed and timing
- Bomb timer and explosion duration
- Player lives and power-up effects
- Map layout and spawn positions

### Adding New Features
The MultiSynq architecture makes it easy to add:
- New power-up types
- Different map layouts
- Special game modes
- Enhanced visual effects

## 🐛 Troubleshooting

### Common Issues

**"Failed to connect to multiplayer server"**
- Check your API key is correct
- Ensure you have internet connectivity
- Verify your domain is allowlisted in MultiSynq dashboard

**Sprites not loading**
- Confirm the `singleplayer/sprites/` and `singleplayer/images/` folders exist
- Check that all sprite files are present
- Verify the HTTP server is running from the correct directory

**Players not synchronizing**
- Ensure all players are using the same session URL
- Check browser console for JavaScript errors
- Verify MultiSynq connection is established

### Debug Mode
Add `debug: true` to the Kaboom configuration to enable:
- Collision box visualization
- Performance metrics
- Debug console output

## 🌟 Future Enhancements

### Planned Features
- [ ] Speed power-up implementation
- [ ] Different map layouts
- [ ] Spectator mode
- [ ] Tournament bracket system
- [ ] Custom game rooms with codes
- [ ] Mobile touch controls
- [ ] Sound effects and music

### Community Contributions
Feel free to contribute:
- New map designs
- Additional power-up types
- UI/UX improvements
- Performance optimizations
- Bug fixes and testing

## 📝 License

This project is built for educational purposes demonstrating MultiSynq multiplayer capabilities. Based on the classic Bomberman gameplay concept.

## 🤝 Support

- **MultiSynq Documentation**: [multisynq.io/docs](https://multisynq.io/docs)
- **MultiSynq Discord**: [multisynq.io/discord](https://multisynq.io/discord)
- **Kaboom.js Documentation**: [kaboomjs.com](https://kaboomjs.com)

---

🎮 **Ready to play? Get your API key and start bombing!** 💣✨
