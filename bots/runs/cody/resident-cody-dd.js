// resident-cody-dd.js — DIRECT-DRIVE launch of Cody's body (thin
// wrapper; the original resident-cody.js is untouched). Same bot
// wiring as the proven one-player launch, MINUS the character
// plugin and MINUS pulsePlugin: the direct driver owns the body;
// the survival floor lives inside direct-drive.js as code. Plugins
// that write movement are skipped exactly as in character mode.
process.chdir(__dirname);
require('/home/caseydigennaro/craftmind-league/pulse/direct-drive.js');
