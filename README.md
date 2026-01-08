# NeonGlider

A fast-paced space game with stunning neon aesthetics and progressive difficulty. Pilot your starfighter through 7 increasingly challenging sectors while dodging oscillating obstacles.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow) ![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **7 Progressive Levels** — From DRIFT to OMEGA, each sector increases speed, gravity, and introduces moving obstacles
- **Smooth Physics** — Delta-time normalized gameplay for consistent feel across devices
- **Neon Aesthetics** — Dynamic color themes, particle effects, and engine trails
- **Responsive Design** — Works on desktop and mobile with touch support
- **Persistent High Scores** — Your best score saved locally

## 🎮 How to Play

- **Click / Tap / Spacebar** — Activate thrusters to fly upward
- Navigate through the gaps between obstacles
- Reach score thresholds to advance to harder levels

| Level | Sector | Unlocks At |
|-------|--------|------------|
| 1 | DRIFT | Start |
| 2 | RUSH | 8 points |
| 3 | HYPER | 20 points |
| 4 | VOID | 40 points |
| 5 | PLASMA | 60 points |
| 6 | QUANTUM | 90 points |
| 7 | OMEGA | 120 points |

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/yourusername/NeonGlider.git
cd NeonGlider

# Serve locally (ES6 modules require HTTP)
npx serve .

# Open http://localhost:3000
```

## 🏗️ Architecture

Built with a modern ES6 modular architecture:

```
src/
├── main.js              # Entry point
├── core/                # GameEngine, Canvas, EventBus
├── entities/            # Player, Obstacles
├── systems/             # Particles, Background
├── managers/            # Audio, Input, UI, Score
└── config/              # Level definitions
```

## 🛠️ Tech Stack

- **Vanilla JavaScript** — No frameworks, pure ES6 modules
- **Canvas 2D API** — Hardware-accelerated rendering
- **CSS3** — Glassmorphism UI with backdrop blur
- **TailwindCSS** — Utility styling via CDN

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

**Controls:** Click • Tap • Spacebar
