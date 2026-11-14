/**
 * Disc Database — 70+ real disc golf discs with flight ratings.
 *
 * Flight numbers: [Speed, Glide, Turn, Fade]
 *   Speed:   1-14  (higher = faster)
 *   Glide:   1-7   (higher = more air time)
 *   Turn:    -5 to +1 (negative = understable, positive = overstable)
 *   Fade:    0-5   (higher = more fade at end of flight)
 *
 * Stability = (Turn * -1) + Fade  (higher = more overstable)
 */

export const DiscType = {
  PUTTER: 'putter',
  MIDRANGE: 'midrange',
  FAIRWAY_DRIVER: 'fairway_driver',
  DISTANCE_DRIVER: 'distance_driver',
};

export const discs = [
  // ── Putters ──────────────────────────────────────────
  { id: 'aviar', name: 'Aviar', manufacturer: 'Innova', type: DiscType.PUTTER, speed: 2, glide: 3, turn: 0, fade: 1 },
  { id: 'proxy', name: 'Proxy', manufacturer: 'Discraft', type: DiscType.PUTTER, speed: 2, glide: 3, turn: -1, fade: 0 },
  { id: 'luna', name: 'Luna', manufacturer: 'Discraft', type: DiscType.PUTTER, speed: 3, glide: 3, turn: 0, fade: 2 },
  { id: 'challenger', name: 'Challenger', manufacturer: 'Discraft', type: DiscType.PUTTER, speed: 2, glide: 3, turn: 0, fade: 2 },
  { id: 'judge', name: 'Judge', manufacturer: 'Dynamic Discs', type: DiscType.PUTTER, speed: 2, glide: 4, turn: -0.5, fade: 1 },
  { id: 'enforcer-putter', name: 'Enforcer', manufacturer: 'Dynamic Discs', type: DiscType.PUTTER, speed: 2, glide: 3, turn: 0, fade: 1 },
  { id: 'warden', name: 'Warden', manufacturer: 'Dynamic Discs', type: DiscType.PUTTER, speed: 2, glide: 4, turn: -0.5, fade: 0.5 },
  { id: 'pa3', name: 'PA3', manufacturer: 'Prodigy', type: DiscType.PUTTER, speed: 3, glide: 3, turn: 0, fade: 2 },
  { id: 'dart', name: 'Dart', manufacturer: 'Innova', type: DiscType.PUTTER, speed: 2, glide: 4, turn: -1, fade: 0 },
  { id: 'magnet', name: 'Magnet', manufacturer: 'Discraft', type: DiscType.PUTTER, speed: 2, glide: 3, turn: 0, fade: 1 },
  { id: 'soft-magnet', name: 'Soft Magnet', manufacturer: 'Discraft', type: DiscType.PUTTER, speed: 2, glide: 3, turn: 0, fade: 1 },
  { id: 'apteryx', name: 'Apteryx', manufacturer: 'Innova', type: DiscType.PUTTER, speed: 2, glide: 4, turn: -1, fade: 0 },
  { id: 'p2', name: 'P2', manufacturer: 'Discmania', type: DiscType.PUTTER, speed: 2, glide: 3, turn: 0, fade: 2 },

  // ── Midranges ────────────────────────────────────────
  { id: 'buzzz', name: 'Buzzz', manufacturer: 'Discraft', type: DiscType.MIDRANGE, speed: 5, glide: 4, turn: -0.5, fade: 1 },
  { id: 'buzzz-ss', name: 'Buzzz SS', manufacturer: 'Discraft', type: DiscType.MIDRANGE, speed: 5, glide: 4, turn: -1.5, fade: 0.5 },
  { id: 'md3', name: 'MD3', manufacturer: 'Discmania', type: DiscType.MIDRANGE, speed: 5, glide: 5, turn: 0, fade: 1 },
  { id: 'truth', name: 'Truth', manufacturer: 'Dynamic Discs', type: DiscType.MIDRANGE, speed: 5, glide: 5, turn: -0.5, fade: 1 },
  { id: 'm4', name: 'M4', manufacturer: 'Prodigy', type: DiscType.MIDRANGE, speed: 5, glide: 5, turn: -1, fade: 0.5 },
  { id: 'roco', name: 'Roc', manufacturer: 'Innova', type: DiscType.MIDRANGE, speed: 4, glide: 4, turn: 0, fade: 2 },
  { id: 'roc3', name: 'Roc3', manufacturer: 'Innova', type: DiscType.MIDRANGE, speed: 5, glide: 4, turn: 0, fade: 2 },
  { id: 'tomb', name: 'Tomb', manufacturer: 'Discraft', type: DiscType.MIDRANGE, speed: 5, glide: 4, turn: 0, fade: 2 },
  { id: 'verdict', name: 'Verdict', manufacturer: 'Dynamic Discs', type: DiscType.MIDRANGE, speed: 5, glide: 4, turn: 0.5, fade: 2 },
  { id: 'wasp', name: 'Wasp', manufacturer: 'Discraft', type: DiscType.MIDRANGE, speed: 5, glide: 4, turn: 0, fade: 2 },
  { id: 'comet', name: 'Comet', manufacturer: 'Discraft', type: DiscType.MIDRANGE, speed: 5, glide: 5, turn: -2, fade: 1 },
  { id: 'ray', name: 'Ray', manufacturer: 'Discraft', type: DiscType.MIDRANGE, speed: 5, glide: 5, turn: -1, fade: 1 },
  { id: 'matrix', name: 'Matrix', manufacturer: 'Discmania', type: DiscType.MIDRANGE, speed: 5, glide: 5, turn: -1, fade: 1 },
  { id: 'm5', name: 'M5', manufacturer: 'Prodigy', type: DiscType.MIDRANGE, speed: 5, glide: 5, turn: -2, fade: 1 },

  // ── Fairway Drivers ──────────────────────────────────
  { id: 'teebird', name: 'Teebird', manufacturer: 'Innova', type: DiscType.FAIRWAY_DRIVER, speed: 7, glide: 5, turn: 0, fade: 2 },
  { id: 'teebird3', name: 'Teebird3', manufacturer: 'Innova', type: DiscType.FAIRWAY_DRIVER, speed: 8, glide: 4, turn: 0, fade: 2 },
  { id: 'leopard3', name: 'Leopard3', manufacturer: 'Innova', type: DiscType.FAIRWAY_DRIVER, speed: 7, glide: 5, turn: -2, fade: 1 },
  { id: 'fd', name: 'FD', manufacturer: 'Discmania', type: DiscType.FAIRWAY_DRIVER, speed: 7, glide: 6, turn: -1, fade: 1 },
  { id: 'fd2', name: 'FD2', manufacturer: 'Discmania', type: DiscType.FAIRWAY_DRIVER, speed: 7, glide: 5, turn: 0, fade: 2 },
  { id: 'explorer', name: 'Explorer', manufacturer: 'Dynamic Discs', type: DiscType.FAIRWAY_DRIVER, speed: 7, glide: 5, turn: -1, fade: 2 },
  { id: 'trespass', name: 'Trespass', manufacturer: 'Dynamic Discs', type: DiscType.FAIRWAY_DRIVER, speed: 8, glide: 5, turn: -1, fade: 2 },
  { id: 'f5', name: 'F5', manufacturer: 'Prodigy', type: DiscType.FAIRWAY_DRIVER, speed: 7, glide: 5, turn: -2, fade: 1.5 },
  { id: 'f7', name: 'F7', manufacturer: 'Prodigy', type: DiscType.FAIRWAY_DRIVER, speed: 9, glide: 5, turn: -2, fade: 1 },
  { id: 'cyclone', name: 'Cyclone', manufacturer: 'Discraft', type: DiscType.FAIRWAY_DRIVER, speed: 7, glide: 5, turn: -1, fade: 2 },
  { id: 'stalker', name: 'Stalker', manufacturer: 'Discraft', type: DiscType.FAIRWAY_DRIVER, speed: 7, glide: 5, turn: -1, fade: 1.5 },
  { id: 'thunderbird', name: 'Thunderbird', manufacturer: 'Innova', type: DiscType.FAIRWAY_DRIVER, speed: 9, glide: 5, turn: 0, fade: 2 },
  { id: 'firebird', name: 'Firebird', manufacturer: 'Innova', type: DiscType.FAIRWAY_DRIVER, speed: 9, glide: 3, turn: 0, fade: 4 },
  { id: 'fd1', name: 'FD1', manufacturer: 'Discmania', type: DiscType.FAIRWAY_DRIVER, speed: 7, glide: 5, turn: 0, fade: 2 },
  { id: 'vanguard', name: 'Vanguard', manufacturer: 'Innova', type: DiscType.FAIRWAY_DRIVER, speed: 8, glide: 5, turn: -2, fade: 1.5 },
  { id: 'gator', name: 'Gator', manufacturer: 'Innova', type: DiscType.FAIRWAY_DRIVER, speed: 5, glide: 2, turn: 0, fade: 3 },

  // ── Distance Drivers ─────────────────────────────────
  { id: 'destroyer', name: 'Destroyer', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 12, glide: 5, turn: -1, fade: 3 },
  { id: 'wraith', name: 'Wraith', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 11, glide: 5, turn: -1, fade: 3 },
  { id: 'boss', name: 'Boss', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 5, turn: 0, fade: 3 },
  { id: 'katana', name: 'Katana', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 5, turn: -2, fade: 2 },
  { id: 'titan', name: 'Titan', manufacturer: 'Discraft', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 5, turn: -1, fade: 3 },
  { id: 'nuke', name: 'Nuke', manufacturer: 'Discraft', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 5, turn: -1, fade: 3 },
  { id: 'nuke-ss', name: 'Nuke SS', manufacturer: 'Discraft', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 6, turn: -3, fade: 1 },
  { id: 'force', name: 'Force', manufacturer: 'Discraft', type: DiscType.DISTANCE_DRIVER, speed: 12, glide: 5, turn: 0, fade: 3 },
  { id: 'predator', name: 'Predator', manufacturer: 'Discraft', type: DiscType.DISTANCE_DRIVER, speed: 10, glide: 3, turn: 0, fade: 4 },
  { id: 'crank', name: 'Crank', manufacturer: 'Discraft', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 5, turn: -2, fade: 2 },
  { id: 'hades', name: 'Hades', manufacturer: 'Discraft', type: DiscType.DISTANCE_DRIVER, speed: 12, glide: 5, turn: -3, fade: 2 },
  { id: 'zonettd', name: 'Zone', manufacturer: 'Discraft', type: DiscType.DISTANCE_DRIVER, speed: 4, glide: 3, turn: 0, fade: 3 },
  { id: 'ddx', name: 'DDx', manufacturer: 'Discmania', type: DiscType.DISTANCE_DRIVER, speed: 12, glide: 5, turn: -2, fade: 2 },
  { id: 'ddl', name: 'DDx', manufacturer: 'Discmania', type: DiscType.DISTANCE_DRIVER, speed: 14, glide: 5, turn: -2, fade: 3 },
  { id: 'd1', name: 'D1', manufacturer: 'Prodigy', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 5, turn: -1, fade: 3 },
  { id: 'd2', name: 'D2', manufacturer: 'Prodigy', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 6, turn: -2, fade: 2 },
  { id: 'd3', name: 'D3', manufacturer: 'Prodigy', type: DiscType.DISTANCE_DRIVER, speed: 14, glide: 5, turn: -3, fade: 2 },
  { id: 'd4', name: 'D4', manufacturer: 'Prodigy', type: DiscType.DISTANCE_DRIVER, speed: 14, glide: 6, turn: -3, fade: 1 },
  { id: 'tst', name: 'TBD', manufacturer: 'Prodigy', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 5, turn: -2, fade: 2 },
  { id: 'colossus', name: 'Colossus', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 14, glide: 5, turn: -2, fade: 3 },
  { id: 'shryke', name: 'Shryke', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 6, turn: -2, fade: 2 },
  { id: 'vulcan', name: 'Vulcan', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 5, turn: -3, fade: 1 },
  { id: 'groove', name: 'Groove', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 13, glide: 5, turn: -2, fade: 2 },
  { id: 'archangel', name: 'Archangel', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 8, glide: 6, turn: -2, fade: 1 },
  { id: 'roadrunner', name: 'Roadrunner', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 9, glide: 5, turn: -4, fade: 1 },
  { id: 'sidewinder', name: 'Sidewinder', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 9, glide: 5, turn: -3, fade: 1 },
  { id: 'orc', name: 'Orc', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 10, glide: 4, turn: -1, fade: 3 },
  { id: 'starfire', name: 'Starfire', manufacturer: 'Innova', type: DiscType.DISTANCE_DRIVER, speed: 10, glide: 4, turn: 0, fade: 3 },
  { id: 'speed-gt', name: 'GT', manufacturer: 'Discraft', type: DiscType.DISTANCE_DRIVER, speed: 14, glide: 5, turn: -3, fade: 1 },
  { id: 'scream', name: 'Scream', manufacturer: 'Discraft', type: DiscType.DISTANCE_DRIVER, speed: 14, glide: 5, turn: -3, fade: 1 },
];

/** Get a disc by its id */
export function getDisc(id) {
  return discs.find(d => d.id === id) ?? null;
}

/** Get all discs of a given type */
export function getDiscsByType(type) {
  return discs.filter(d => d.type === type);
}

/** Stability score: higher = more overstable */
export function stability(disc) {
  // Higher = more overstable. Turn is negative for understable discs.
  // Stability = fade + turn (turn subtracts for understable).
  return disc.fade + disc.turn;
}

/** Human-readable stability label */
export function stabilityLabel(disc) {
  const s = stability(disc);
  if (s <= 1) return 'very understable';
  if (s <= 2) return 'understable';
  if (s <= 3) return 'stable';
  if (s <= 4) return 'overstable';
  return 'very overstable';
}
