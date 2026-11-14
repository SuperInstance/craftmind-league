// golf-harness.mjs — offline league-path proof: a real v1 golfer
// script runs through GolfScriptRunner with simulateThrow as the
// arm, LEAGUE_LEDGER=1, and the throws land in the league ledger.
// Run: LEAGUE_LEDGER=1 node golf-harness.mjs   (times out by design
// after ~25s; the script loops holes — events written are the proof)
import { GolfScriptRunner } from '/home/caseydigennaro/craftmind-league/bots/craftmind-discgolf/src/scripts/script-engine.js';
import { simulateThrow } from '/home/caseydigennaro/craftmind-league/bots/craftmind-discgolf/src/engine/disc-physics.js';
import { getDisc } from '/home/caseydigennaro/craftmind-league/bots/craftmind-discgolf/src/engine/disc-database.js';
import { buildVeteranScript } from '/home/caseydigennaro/craftmind-league/bots/craftmind-discgolf/src/scripts/v1-veteran.js';

const bot = { username: 'LedgerBot', chat: (m) => console.log('[chat]', m) };

const onThrow = async (opts, ctx) => {
  const disc = (opts.disc && typeof opts.disc === 'object') ? opts.disc : getDisc('destroyer');
  const r = simulateThrow({
    disc,
    power: opts.power ?? 0.85,
    hyzer: opts.hyzer ?? 0,
    windSpeed: ctx.windSpeed ?? 0,
    windDirection: ctx.windDirection ?? 0,
  });
  return { landing: r.landing, distance: Math.round(r.distance) };
};

const runner = new GolfScriptRunner(bot, { onThrow, agentName: 'LedgerBot' });
runner.updateContext({ hole: 1, par: 3, distanceToBasket: 95, windSpeed: 3, windDirection: 45 });
const script = buildVeteranScript(runner.context);
runner.register(script);
console.log('[harness] running', script.name);
await runner.run(script);
console.log('[harness] script finished');
