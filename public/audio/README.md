# Audio Drop-in Directory

You can drop in audio soundtracks here in MP3 format. The game auto-detects them without requiring any code changes.

### Multi-track option (Recommended):
- `menu.mp3`: Loops during title, idle attract mode, name entry, pregame, how-to, and leaderboard.
- `gameplay.mp3`: High-energy / escalating chiptune ("Crunch Mode") looping during the 10 logo-reveal rounds.
- `victory.mp3`: Triumphant fanfare played on the results screen for high scores / survivors.
- `gameover.mp3`: Humorous / design crime stinger played on the results screen for low scores.

### Single-track option (Simple drop-in):
- `theme.mp3`: A single soundtrack that automatically plays across the game (auto-fallback if specific tracks are not provided).

### Zero-asset fallback:
If no audio files are added to this folder, the game runs cleanly without errors using its built-in synthesized Web Audio SFX (`src/lib/audio.ts`).
