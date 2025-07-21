# Bomberman JavaScript

A classic Bomberman game built with JavaScript using the Kaboom.js library, featuring both single-player and multiplayer modes.

## 🎮 Game Modes

### Single Player Mode
- Classic Bomberman gameplay against AI bots
- Located in `/singleplayer/` folder
- Features the original game mechanics

### Multiplayer Mode (Demo)
- Multiplayer lobby system with demo players
- Located in `/multiplayer/` folder
- Shows the complete multiplayer UI and flow

## 🚀 How to Run

1. **Start the server:**
   ```bash
   python3 -m http.server 3000
   ```

2. **Open your browser:**
   ```
   http://localhost:3000
   ```

3. **Choose your game mode:**
   - **Multiplayer**: Click "🎮 Multiplayer" to access the lobby system
   - **Single Player**: Click "👤 Single Player" for classic gameplay

## 📁 Project Structure

```
bomberman/
├── index.html              # Main menu
├── README.md              # This file
├── images/                # Game sprites and assets
│   └── bombermon.png     # Bomberman character sprite
├── singleplayer/          # Single player game
│   ├── game.js           # Original Bomberman game logic
│   └── singleplayer.html # Single player game interface
└── multiplayer/          # Multiplayer game (demo)
    ├── lobby.html        # Multiplayer lobby interface
    ├── lobby.js          # Lobby functionality
    ├── game.html         # Multiplayer game interface
    └── multiplayer-game.js # Multiplayer game logic
```

## 🎯 Features

### Single Player
- ✅ Grid-based movement
- ✅ Bomb placement and explosions
- ✅ AI bots with basic intelligence
- ✅ Power-ups (bombs, fire power, speed)
- ✅ Lives system
- ✅ Proper sprite animations

### Multiplayer (Demo)
- ✅ Beautiful lobby interface
- ✅ Room code generation and sharing
- ✅ Player ready system
- ✅ Host controls
- ✅ Demo players for testing
- ✅ Seamless game transition

## 🎮 Controls

- **Arrow Keys**: Move character
- **Spacebar**: Place bombs
- **Objective**: Defeat all enemies before they defeat you!

## 🛠️ Technical Details

- **Engine**: Kaboom.js 0.6.0
- **Graphics**: Custom sprite sheet (7x4 grid)
- **Multiplayer**: Local demo (ready for WebSocket integration)
- **Server**: Python HTTP server

## 🔧 Future Enhancements

To make the multiplayer fully functional:
1. Implement WebSocket server (Node.js + Socket.IO)
2. Add real-time player synchronization
3. Implement actual player joining/leaving
4. Add game state synchronization

## 📝 Credits

- **Kaboom.js**: https://kaboomjs.com/
- **Original Tutorial**: https://youtu.be/v68tS9BgjV4
- **Sprites**: Custom Bomberman character sprites
