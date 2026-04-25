# NFS Heat - Underground Racing Game

A 3D first-person driving game inspired by Need for Speed Heat, built with JavaScript, Three.js, and Cannon.js physics engine.

## Features

- 🚗 **3D First-Person Driving** - Immersive driving experience with dynamic camera
- 🏙️ **Large City Map** - Procedurally generated cityscape with buildings, roads, and street lighting
- 🚔 **Police Chases** - Dynamic cop AI that pursues you with a heat level system
- 💰 **Car Shop** - Purchase and switch between multiple car types
- 📊 **Leaderboard System** - Track your best rep scores locally
- ⚡ **Nitro Boost** - Use nitro fuel to temporarily increase speed
- 🎮 **Realistic Physics** - Vehicle physics powered by Cannon.js
- 💾 **Save/Load Progress** - Your progress is saved to browser storage

## Controls

- **W** - Accelerate Forward
- **S** - Reverse
- **A** - Steer Left
- **D** - Steer Right
- **Space** - Handbrake (for drifting)
- **N** - Use Nitro Boost
- **P** - Open Shop
- **R** - Reset Position
- **ESC** - Return to Main Menu

## Game Mechanics

### Heat Level
- Increases when you drive at high speeds
- Cops spawn when heat level rises
- More cops = more difficulty and more rep rewards
- Evade for longer to earn rep

### Rep System
- Earn rep by driving fast
- Earn bonus rep for evading police
- Lose rep if caught by cops
- Reach high rep levels to climb the leaderboard

### Cars Available
1. **Street Racer** - FREE (Default)
   - Fast & Agile
   - Speed: 200 | Acceleration: 150 | Handling: 80%

2. **Muscle Car** - $8,000
   - Raw Power
   - Speed: 190 | Acceleration: 180 | Handling: 60%

3. **Sports Car** - $25,000
   - Balanced Performance
   - Speed: 210 | Acceleration: 170 | Handling: 85%

4. **Supercar** - $50,000
   - Ultimate Performance
   - Speed: 220 | Acceleration: 200 | Handling: 90%

## How to Deploy to Netlify

### Option 1: Netlify Drop (Easiest)
1. Visit [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the entire `nfs-heat-game` folder
3. Your game will be deployed instantly with a temporary URL
4. Configure a custom domain if desired

### Option 2: Git Push Deploy
1. Create a GitHub repository
2. Push the `nfs-heat-game` folder to the repo
3. Connect the repo to Netlify
4. Set build command: (leave empty, this is a static site)
5. Set publish directory: `/` (root of folder)

### Option 3: Manual Netlify CLI
```bash
npm install -g netlify-cli
cd nfs-heat-game
netlify deploy --prod
```

## Project Structure

```
nfs-heat-game/
├── index.html          # Main game HTML
├── css/
│   └── style.css       # Game UI and styling
├── js/
│   ├── game.js         # Main game engine
│   ├── physics.js      # Cannon.js physics system
│   ├── map.js          # City map generation
│   ├── player.js       # Player car controller
│   ├── cop.js          # Cop AI system
│   ├── camera.js       # First-person camera
│   ├── input.js        # Input/control handling
│   ├── ui.js           # UI management
│   ├── shop.js         # Car shop system
│   └── leaderboard.js  # Leaderboard system
└── assets/             # (Future) Game assets
```

## Technologies Used

- **Three.js** - 3D Graphics Rendering
- **Cannon.js** - Physics Engine
- **HTML5** - Markup Structure
- **CSS3** - Styling & Animations
- **Vanilla JavaScript** - Game Logic

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** WebGL is required. Your browser must support WebGL 2.0 for optimal performance.

## Performance Tips

- For better performance on lower-end devices:
  - Reduce quality settings (in-game graphics quality not currently available, but can be added)
  - Lower the map generation complexity
  - Close other browser tabs

## Future Features (Roadmap)

- [ ] Multiplayer online play
- [ ] More car customization options
- [ ] Additional maps/cities
- [ ] Race events and missions
- [ ] Traffic AI
- [ ] Damage system
- [ ] Day/night cycle
- [ ] Weather effects
- [ ] Sound effects and music
- [ ] Mobile touch controls

## Tips for Playing

1. **Early Game**: Drive fast to earn initial rep and money
2. **Heat Management**: Watch your heat level - higher heat = more challenge
3. **Cop Evasion**: Drive through tight alleys and obstacles to lose cops
4. **Money Making**: Use rep to unlock better cars for higher speeds
5. **Leaderboard**: Get your name on the leaderboard and share with friends!

## Troubleshooting

**Game won't load**
- Clear your browser cache
- Check browser console for errors (F12)
- Make sure WebGL is enabled

**Physics feels weird**
- This is normal - the physics can be tuned by adjusting values in `js/physics.js`
- Different cars have different handling characteristics

**Game is slow**
- Close other browser tabs
- Try a different browser
- Reduce your display resolution

## Credits

Built with:
- Three.js ([https://threejs.org/](https://threejs.org/))
- Cannon-es ([https://github.com/pmndrs/cannon-es](https://github.com/pmndrs/cannon-es))
- Inspired by Need for Speed Heat

## License

This is a fan-made project for educational purposes.

---

Enjoy the game! 🏁
