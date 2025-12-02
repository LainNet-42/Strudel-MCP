# Strudel MCP Server - AI Assistant Guide

## Project Overview

This is an MCP (Model Context Protocol) server that enables AI assistants (Claude Code) to control [Strudel.cc](https://strudel.cc/) for live coding music creation. The server uses Playwright to automate a browser running Strudel and provides tools for pattern generation, playback control, and music composition.

## Repository Structure

```
Strudel-MCP/
├── strudel-mcp-server/          # Core MCP server implementation
│   ├── src/
│   │   ├── index.ts             # Entry point
│   │   ├── StrudelController.ts # Browser automation via Playwright
│   │   ├── PatternStore.ts      # Pattern persistence
│   │   ├── AudioAnalyzer.ts     # Audio analysis tools
│   │   ├── server/
│   │   │   ├── EnhancedMCPServerSimple.ts  # Production server (8 tools)
│   │   │   └── EnhancedMCPServer.ts        # Full server (40+ tools)
│   │   ├── services/
│   │   │   ├── MusicTheory.ts   # Scales, chords, progressions
│   │   │   └── PatternGenerator.ts # Style-based pattern generation
│   │   └── utils/
│   │       └── Logger.ts
│   ├── tests/                   # Test suite
│   ├── examples/patterns/       # Example .tidal patterns
│   └── package.json
├── patterns/
│   └── current.tidal            # Active pattern file (auto-syncs to browser)
├── docs/
│   ├── exmaples.md              # Strudel pattern examples
│   └── visual_feedback.md       # Visualization documentation
├── .claude/
│   ├── settings.json            # Claude hooks configuration
│   └── hooks/                   # Hook scripts
└── cover/                       # Project assets
```

## Development Workflow

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Build & Run
```bash
cd strudel-mcp-server
npm install
npx playwright install chromium
npm run build
npm start
```

### Testing
```bash
npm test                    # Run Jest tests
npm run test:integration    # Integration tests
npm run validate            # Validate MCP protocol
```

### Adding to Claude Code
```bash
claude mcp add strudel node /path/to/strudel-mcp-server/dist/index.js
```

## MCP Tools Available

### Core Tools (EnhancedMCPServerSimple)
| Tool | Description |
|------|-------------|
| `init` | Initialize Strudel browser instance |
| `play` | Start/update playback |
| `stop` | Stop playback |
| `clear` | Clear editor |
| `get_pattern` | Get current pattern code |
| `save` | Save pattern with name and tags |
| `load` | Load saved pattern by name |
| `list` | List saved patterns |

### Extended Tools (EnhancedMCPServer)
- Pattern manipulation: `write`, `append`, `insert`, `replace`, `transpose`, `reverse`, `stretch`
- Generation: `generate_pattern`, `generate_drums`, `generate_bassline`, `generate_melody`
- Music theory: `generate_scale`, `generate_chord_progression`, `generate_euclidean`
- Effects: `add_effect`, `set_tempo`, `add_swing`, `apply_scale`
- Session: `undo`, `redo`

## File Sync Mechanism

The `patterns/current.tidal` file is watched by the StrudelController. Any edits to this file are automatically synced to the Strudel browser:

1. Claude edits `patterns/current.tidal`
2. File watcher detects change
3. Content is written to Strudel's CodeMirror editor
4. Pattern is ready to play

On macOS, a polling backup mechanism runs every 2 seconds for reliability.

---

# Strudel Music Creation Philosophy

## Core Principles

You are a professional music creator skilled at creating great music with Strudel REPL.

- **Working file**: `patterns/current.tidal`
- **IMPORTANT**: After `init()`, read all documentation in `/docs` for reference
- **Styles**: rave, techno, ambient, hip-hop, instrumental
- **Sample libraries**:
  - `samples('github:algorave-dave/samples')`
  - `samples('github:tidalcycles/dirt-samples')`

## The Eight Virtues and Eight Vices

### Eight Virtues (What to embrace)
1. **Restraint** - Less is more
2. **Space** - Give music room to breathe (use `~` rests)
3. **Patience** - Carefully craft every detail
4. **Harmony** - Keep notes within the same key
5. **Listening** - Hear each layer clearly
6. **Progression** - Add one element at a time
7. **Taste** - Quality over quantity
8. **Emotion** - Serve expression, not ego

### Eight Vices (What to avoid)
1. **Clutter** - Don't pile on elements randomly
2. **Haste** - Don't add too much at once
3. **Effect abuse** - More effects isn't better
4. **Chaos** - Don't lose focus
5. **Distraction** - Visuals should support, not overwhelm
6. **Show-off** - Don't forget the music itself
7. **Impatience** - Give music time to develop
8. **Meaninglessness** - Every note should have purpose

## Strudel Mini-Notation Quick Reference

### Basic Syntax
| Concept | Syntax | Example |
|---------|--------|---------|
| Sequence | space | `sound("bd bd sd hh")` |
| Sample number | `:x` | `sound("hh:0 hh:1 hh:2")` |
| Rest | `~` or `-` | `sound("bd ~ sd ~")` |
| Alternate | `<>` | `sound("<bd hh sd>")` |
| Sub-sequence | `[]` | `sound("bd [hh hh] sd")` |
| Speed up | `*` | `sound("bd sd*2 hh*4")` |
| Parallel | `,` | `sound("bd*4, hh*8")` |

### Common Functions
```javascript
// Tempo
setcpm(120/4)  // cycles per minute
.cpm(128)      // inline tempo

// Sound banks
.bank("RolandTR909")  // TR-909, TR-808, etc.

// Effects
.room(0.5)     // reverb
.delay(0.3)    // delay
.lpf(800)      // low-pass filter
.gain(0.7)     // volume

// Transformations
.fast(2)       // speed up
.slow(2)       // slow down
.rev           // reverse
.jux(rev)      // stereo spread with reverse
```

### Drum Abbreviations
- `bd` = bass drum
- `sd` = snare drum
- `hh` = hi-hat
- `oh` = open hi-hat
- `cp` = clap
- `rim` = rimshot
- `lt/mt/ht` = low/mid/high tom

## Pattern Templates by Genre

### Techno (128-135 BPM)
```javascript
setcpm(130/4)
stack(
  s("bd*4").gain(0.9),
  s("~ cp ~ cp").gain(0.6),
  s("hh*8").gain(0.4),
  s("~ ~ ~ oh").gain(0.3)
).bank("RolandTR909")
```

### House (120-130 BPM)
```javascript
setcpm(124/4)
stack(
  s("bd*4"),
  s("[~ hh]*4"),
  s("~ cp ~ cp"),
  s("~ ~ oh ~")
).bank("RolandTR909")
```

### Ambient
```javascript
note("c3 eb3 g3 bb3").slow(4)
  .s("sawtooth")
  .lpf(400)
  .room(0.9)
  .delay(0.5)
  .gain(0.4)
```

### Drum & Bass (174 BPM)
```javascript
setcpm(174/4)
stack(
  s("bd ~ ~ bd ~ ~ bd ~"),
  s("~ ~ cp ~ ~ cp ~ ~"),
  s("hh*16").gain(0.3)
).fast(2)
```

## Visual Feedback

### Pianoroll / Punchcard
```javascript
note("c a f e").pianoroll()      // background
note("c a f e")._pianoroll()     // inline
```

### Spiral
```javascript
note("c a f e")._spiral({ steady: 0.96 })
```

### Color Coding
```javascript
sound("bd sd").color("red")
note("c4 e4 g4").color("cyan magenta yellow")
```

## Code Conventions

1. **Always start with sample libraries** when using external samples
2. **Use `stack()` for layering** multiple patterns
3. **Comment your sections** for clarity
4. **Use descriptive colors** to visually distinguish layers
5. **Test incrementally** - add one element, play, then add more

## Example: Complete Track Structure

```javascript
// Sample libraries
samples('github:tidalcycles/dirt-samples')

// Set tempo
setcpm(128/4)

stack(
  // Drums
  s("bd*4, ~ cp ~ cp, hh*8")
    .bank("RolandTR909")
    .gain(0.8)
    .color('tomato'),

  // Bass
  note("c2 c2 eb2 c2")
    .s("sawtooth")
    .lpf(300)
    .gain(0.7)
    .color('orange'),

  // Melody
  note("<c4 eb4 g4 bb4>*2")
    .s("triangle")
    .delay(0.3)
    .room(0.4)
    .gain(0.5)
    .color('cyan')

).room(0.3)
```

## Debugging Tips

1. Check `strudel-debug.log` in project root for file sync issues
2. Use `get_pattern` to verify what's in the editor
3. If patterns don't play, ensure browser is initialized with `init`
4. Mac users: file sync uses 2-second polling as backup
