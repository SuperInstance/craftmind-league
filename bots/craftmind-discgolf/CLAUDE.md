# CLAUDE.md - CraftMind Disc Golf

## Project Overview

CraftMind Disc Golf is an AI-powered disc golf companion bot for Minecraft. Part of the [CraftMind](https://github.com/CedarBeach2019/craftmind) ecosystem, this module brings realistic disc flight physics, a database of 70+ real-world discs, and four distinct personality-driven NPC scripts to Minecraft disc golf courses.

**Key Features:**
- **Pure heuristic AI** — No LLM/API required for disc selection or gameplay
- **70+ Real Discs** — From Innova, Discraft, Dynamic Discs, Prodigy, and Discmania with authentic flight numbers
- **3D Physics Engine** — Drag, lift, spin decay, wind interaction, and obstacle collision
- **4 Personalities** — Stoic Pro, Showboat, Caddy, and Veteran with unique dialogue and behavior
- **Stochastic Behavior** — Randomized line selection and shot variation for natural play

## Architecture

### Core Systems

**1. Disc Physics Engine** (`src/engine/disc-physics.js`)
- Time-stepped 3D simulation of disc flight
- Forces: drag (speed²), lift (glide-based), gravity, spin decay
- Wind interaction from any direction
- Obstacle collision with deflection
- Ground interaction (skip, roll, settle)
- Outputs trajectory arrays for mineflayer pathfinding

**2. Disc Database** (`src/engine/disc-database.js`)
- 70+ discs across 4 types: Putter (13), Midrange (14), Fairway Driver (17), Distance Driver (29)
- Flight numbers: [Speed, Glide, Turn, Fade]
- Stability formula: `stability = fade + turn` (higher = more overstable)
- Helper functions: `getDisc()`, `getDiscsByType()`, `stability()`, `stabilityLabel()`

**3. Script Engine** (`src/scripts/script-engine.js`)
- Step-based personality script runner
- `MoodSystem`: tracks mood (0-1), focus, energy; affects chattiness and timing
- `Scorecard`: tracks strokes, par, score-to-par
- `GolfScriptRunner`: executes scripts with bot integration
- Step types: chat, wait, throw_disc, walk_to_tee, walk_to_basket, celebrate, branch, set

**4. Disc Selector AI** (`src/scripts/disc-selector.js`)
- Pure heuristic disc recommendation (no neural nets)
- Selection logic:
  - Distance → disc type (<150ft putter, <250ft midrange, <350ft fairway, 350ft+ driver)
  - Wind → stability (headwind=overstable, tailwind=understable, crosswind=direction-dependent)
  - Obstacles → speed (tight corridors penalize high-speed discs)
  - Scoring → stability match, speed fit, +1 bonus for classics (Buzzz, Teebird, Destroyer)
- Returns: disc, reason, throwType, suggestedPower, suggestedHyzer

**5. Personality Scripts** (`src/scripts/v1-*.js`)
Each personality defines dialogue pools and builds unique scripts:

- **Stoic Pro** (`v1-stoic.js`): Silent, efficient. Minimal dialogue. "Mm.", "*nods*"
- **Showboat** (`v1-showboat.js`): Flashy, risky. Celebrates everything. Uses high-speed drivers
- **Caddy** (`v1-caddy.js`): Helpful, advisory. Explains picks, encourages player
- **Veteran** (`v1-veteran.js`): Nostalgic, opinionated. Knows every hole, complains about course design

### Data Flow

```
Hole Context (distance, wind, par, obstacles)
    ↓
Disc Selector (recommendDisc)
    ↓
Personality Script (buildXxxScript)
    ↓
GolfScriptRunner (execute steps)
    ↓
Physics Engine (simulateThrow) → trajectory, landing result
    ↓
Mood Update (based on result)
    ↓
Scorecard Update (record strokes)
```

## File Structure

```
src/
├── engine/
│   ├── disc-physics.js      # 3D flight simulation
│   └── disc-database.js     # 70+ discs + stability math
├── scripts/
│   ├── script-engine.js     # Step-based script runner
│   ├── disc-selector.js     # Heuristic AI caddy
│   ├── v1-stoic.js          # The Silent Pro
│   ├── v1-showboat.js       # The Trick Shot Artist
│   ├── v1-caddy.js          # The Helpful Advisor
│   └── v1-veteran.js        # The Old Course Regular
tests/
└── test-disc-scripts.js     # 45 tests for all systems
assets/discs/                # 73 disc images (PNG)
package.json                 # ES module, node --test
README.md                    # Professional docs with JRPG flavor
```

## Current State

**Implemented:**
- ✅ Disc physics engine with full 3D simulation
- ✅ 70+ disc database with authentic flight numbers
- ✅ Heuristic disc selection AI
- ✅ 4 personality scripts with unique dialogue pools
- ✅ Mood system affecting behavior and chattiness
- ✅ Scorecard tracking system
- ✅ 45 tests covering all core systems
- ✅ Professional README with architecture docs

**Not Implemented:**
- ❌ Mineflayer bot integration layer
- ❌ Course data/holes (mentioned in README: Sitka Cedar, Volcano Island, Sky Garden)
- ❌ In-game commands (!scripts, !script <name>)
- ❌ Actual throwing mechanics in Minecraft
- ❌ Basket detection and scoring

## 5 Improvements

1. **Mineflayer Integration Layer**
   - Create `src/mineflayer/disc-golf-bot.js` that wraps the script engine
   - Implement actual throwing: `bot.lookAt()`, arm swing timing, release point
   - Add basket detection: scan for chain/iron bar blocks
   - Commands: `!scripts`, `!script <name>`, `!play <hole>`

2. **Course Data Module**
   - Create `src/courses/` with hole definitions
   - Each hole: par, distance, basket position, tee position, obstacles
   - Implement `src/courses/sitka-cedar.js`, `volcano-island.js`, `sky-garden.js`
   - Add course metadata: JRPG descriptions, signatures, difficulty

3. **Enhanced Physics Realism**
   - Add elevation changes (uphill/downhill shots)
   - Implement ground type interaction (grass vs dirt vs concrete)
   - Add disc wear/break-in period affecting stability over time
   - Consider temperature and humidity effects on flight

4. **Advanced Personalities**
   - Add more personalities: "Coach", "Rival", "Rookie"
   - Implement memory: personalities remember previous holes
   - Add player relationship system: personalities react to human performance
   - Personality-specific disc preferences (not just random picks)

5. **Multiplayer & Tournaments**
   - Support multiple bots playing together
   - Tournament mode: stroke play, match play, skins
   - Leaderboards and scoring systems
   - Spectator chat and commentary

## Core Integration (for CraftMind Main Bot)

To integrate this disc golf module into the main CraftMind bot:

```javascript
// In main CraftMind bot initialization
import { GolfScriptRunner } from './craftmind-discgolf/src/scripts/script-engine.js';
import { buildStoicScript, buildShowboatScript, buildCaddyScript, buildVeteranScript } from './craftmind-discgolf/src/scripts/v1-*.js';
import { simulateThrow } from './craftmind-discgolf/src/engine/disc-physics.js';

// Initialize runner
const golfRunner = new GolfScriptRunner(bot, {
  mood: new MoodSystem(),
  scorecard: new Scorecard(courseHoles),
  onThrow: async (opts, ctx) => {
    // Actually throw the disc in Minecraft
    const result = await throwDiscInGame(bot, opts.disc, opts.power, opts.hyzer);
    return result;
  },
  onWalk: async (target, ctx) => {
    // Pathfind to tee or basket
    await bot.pathfind.to(target);
  }
});

// Register scripts
golfRunner.register(buildStoicScript(ctx));
golfRunner.register(buildShowboatScript(ctx));
golfRunner.register(buildCaddyScript(ctx));
golfRunner.register(buildVeteranScript(ctx));

// Handle commands
bot.on('chat', (username, message) => {
  if (message === '!scripts') {
    bot.chat('Available: Stoic, Showboat, Caddy, Veteran');
  } else if (message.startsWith('!script ')) {
    const name = message.split(' ')[1];
    // Switch personality script
  }
});
```

## Key Concepts

**Stability Math:**
- `stability = fade + turn`
- Understable: turn ≤ -1 (discs turn right at high speed for RHBH)
- Stable: turn ≈ 0, fade ≤ 2 (straight flight with mild fade)
- Overstable: fade ≥ 3 (fights left throughout flight for RHBH)

**Hyzer/Anhyzer:**
- Hyzer: disc angled outward (right edge down for RHBH) → fades left
- Anhyzer: disc angled inward (right edge up for RHBH) → turns right
- Combined with disc stability to shape lines

**Throw Types:**
- Putt: <150ft, low power, straight aim
- Backhand: standard, most control, 200-400ft
- Forehand (flick): more stable, fights wind better, 200-350ft
- Overhead (tomahawk/thumber): escape shots, steep angles

## Testing

```bash
npm test
# Runs 45 tests covering:
# - Disc database integrity
# - Disc selection heuristics
# - Mood system behavior
# - Scorecard tracking
# - Script runner execution
# - Personality script building
```

## Ecosystem Links

- [craftmind](https://github.com/CedarBeach2019/craftmind) - Core bot framework
- [craftmind-fishing](https://github.com/CedarBeach2019/craftmind-fishing) - AI fishing companion (script engine origin)
- [craftmind-courses](https://github.com/CedarBeach2019/craftmind-courses) - Course designs & data

## Development Notes

- All distances in Minecraft blocks (1 block ≈ 1 foot)
- Physics simulation: 0.02s timestep, max 8s flight
- Mood decay: 0.8% per tick toward neutral
- Chattiness: 0.1-0.95 based on mood
- Classic disc bonus: +1 score for Buzzz, Teebird, Destroyer, Aviar, Roc3, Wraith
