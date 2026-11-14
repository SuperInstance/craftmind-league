import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = process.env.GEMINI_API_KEY;
const ASSETS_DIR = path.join(import.meta.dirname, '..', 'assets', 'discs');
fs.mkdirSync(ASSETS_DIR, { recursive: true });

const DISCS = [
  // INNOVA
  { id: 'innova_wraith', name: 'Wraith', brand: 'Innova', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with spectral purple ghost wisps and ethereal energy, dark purple to black gradient background, the word WRAITH in bold gothic font across center, Innova brand text at bottom, fantasy JRPG style, detailed illustration', color: '#9b59b6' },
  { id: 'innova_destroyer', name: 'Destroyer', brand: 'Innova', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with massive explosion and energy chaos, deep red and orange flames radiating from center, the word DESTROYER in bold angular font, Innova brand text at bottom, intense JRPG summoning magic style', color: '#e74c3c' },
  { id: 'innova_firebird', name: 'Firebird', brand: 'Innova', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with phoenix rising from flames, orange and gold fire feathers against dark background, the word FIREBIRD in flame font, Innova brand text at bottom, mythical creature JRPG art style', color: '#f39c12' },
  { id: 'innova_valkyrie', name: 'Valkyrie', brand: 'Innova', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with winged warrior woman holding a shield, gold and sky blue colors, glowing light radiating, the word VALKYRIE in elegant nordic font, Innova brand text at bottom, JRPG character portrait style', color: '#3498db' },
  { id: 'innova_teebird', name: 'Teebird', brand: 'Innova', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with a stylized bird soaring through forest canopy, forest green and sky blue gradient, the word TEEBIRD in clean nature font, Innova brand text at bottom, nature illustration style', color: '#27ae60' },
  { id: 'innova_leopard', name: 'Leopard', brand: 'Innova', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with leopard spots and golden fur texture, golden yellow background with dark spots, the word LEOPARD in wild font, Innova brand text at bottom, animal print design', color: '#f1c40f' },
  { id: 'innova_aviar', name: 'Aviar', brand: 'Innova', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with a small bird in flight over calm water, soft green and white colors, peaceful and precise feeling, the word AVIAR in clean sans-serif font, Innova brand text at bottom, minimalist elegant design', color: '#2ecc71' },
  { id: 'innova_roc', name: 'Roc', brand: 'Innova', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with ancient stone texture and carved rune symbols, gray and gold colors, the word ROC in runic font, Innova brand text at bottom, ancient artifact style', color: '#7f8c8d' },
  { id: 'innova_katana', name: 'Katana', brand: 'Innova', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with Japanese katana sword cutting through wind, red and black dramatic style, the word KATANA in brush stroke kanji-inspired font, Innova brand text at bottom, samurai JRPG style', color: '#c0392b' },
  { id: 'innova_mako3', name: 'Mako3', brand: 'Innova', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with shark fin cutting through ocean waves, ocean blue and teal colors, the word MAKO3 in sharp angular font, Innova brand text at bottom, ocean predator style', color: '#00b4d8' },
  { id: 'innova_roadrunner', name: 'Roadrunner', brand: 'Innova', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with cartoon roadrunner bird kicking up desert dust, desert orange and brown colors with speed lines, the word ROADRUNNER in fun speed font, Innova brand text at bottom, cartoon style', color: '#e67e22' },
  { id: 'innova_skeeter', name: 'Skeeter', brand: 'Innova', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with mosquito/insect wing design, iridescent green and purple, delicate and precise, the word SKEETER in thin elegant font, Innova brand text at bottom', color: '#8e44ad' },
  { id: 'innova_pegasus', name: 'Pegasus', brand: 'Innova', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with winged horse Pegasus flying through clouds, white and gold with blue sky, the word PEGASUS in majestic font, Innova brand text at bottom, mythological JRPG style', color: '#ecf0f1' },
  { id: 'innova_cheetah', name: 'Cheetah', brand: 'Innova', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with cheetah spots and speed lines, orange and gold with motion blur, the word CHEETAH in dynamic italic font, Innova brand text at bottom, speed animal style', color: '#f39c12' },
  // DISCRAFT
  { id: 'discraft_buzzz', name: 'Buzzz', brand: 'Discraft', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with stylized bee and honeycomb pattern, bright yellow and black stripes, the word BUZZZ in bold buzz font, Discraft brand text at bottom, bold insect design', color: '#f1c40f' },
  { id: 'discraft_zone', name: 'Zone', brand: 'Discraft', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with target zone bullseye design, red and white concentric circles, the word ZONE in military stencil font, Discraft brand text at bottom, tactical precision style', color: '#e74c3c' },
  { id: 'discraft_luna', name: 'Luna', brand: 'Discraft', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with crescent moon and glowing stars in night sky, deep blue and silver with moonlight glow, the word LUNA in elegant moonlight font, Discraft brand text at bottom, celestial night style', color: '#2c3e50' },
  { id: 'discraft_zeus', name: 'Zeus', brand: 'Discraft', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with Greek god Zeus lightning bolt striking from clouds, electric blue and white with golden lightning, the word ZEUS in powerful lightning font, Discraft brand text at bottom, JRPG god summon style', color: '#3498db' },
  { id: 'discraft_raptor', name: 'Raptor', brand: 'Discraft', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with velociraptor claws and feathers, red and black aggressive design, the word RAPTOR in sharp predatory font, Discraft brand text at bottom, dinosaur attack style', color: '#c0392b' },
  { id: 'discraft_nuke', name: 'Nuke', brand: 'Discraft', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with nuclear mushroom cloud and radioactive glow, neon green and black, the word NUKE in radiation hazard font, Discraft brand text at bottom, apocalyptic JRPG style', color: '#00ff00' },
  { id: 'discraft_undertaker', name: 'Undertaker', brand: 'Discraft', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with grim reaper silhouette over graveyard, dark purple and black with ghostly glow, the word UNDERTAKER in gothic font, Discraft brand text at bottom, dark fantasy style', color: '#4a235a' },
  { id: 'discraft_flame', name: 'Flame', brand: 'Discraft', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with dancing flame design, orange and red gradient, the word FLAME in fire font, Discraft brand text at bottom, fire element style', color: '#e67e22' },
  { id: 'discraft_challenger', name: 'Challenger', brand: 'Discraft', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with knight shield and crossed swords, silver and blue, the word CHALLENGER in heraldic font, Discraft brand text at bottom, knightly heraldry style', color: '#2980b9' },
  { id: 'discraft_predator', name: 'Predator', brand: 'Discraft', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with alien predator face with dreadlocks, dark green and black with mandible detail, the word PREDATOR in sci-fi font, Discraft brand text at bottom, sci-fi horror style', color: '#1a5276' },
  // DYNAMIC DISCS
  { id: 'dd_judge', name: 'Judge', brand: 'Dynamic Discs', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with gavel and scales of justice, gold and black judicial design, the word JUDGE in official court font, Dynamic Discs brand text at bottom, legal authority style', color: '#f1c40f' },
  { id: 'dd_truth', name: 'Truth', brand: 'Dynamic Discs', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with all-seeing eye and sacred geometry, purple and white mystical design, the word TRUTH in mystical font, Dynamic Discs brand text at bottom, esoteric truth style', color: '#8e44ad' },
  { id: 'dd_felon', name: 'Felon', brand: 'Dynamic Discs', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with crime scene evidence markers and police tape, red and black, the word FELON in stencil font, Dynamic Discs brand text at bottom, crime thriller style', color: '#c0392b' },
  { id: 'dd_sheriff', name: 'Sheriff', brand: 'Dynamic Discs', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with wild west sheriff badge and star, bronze and dark brown, the word SHERIFF in western wanted poster font, Dynamic Discs brand text at bottom, western lawman style', color: '#d4a574' },
  { id: 'dd_trespass', name: 'Trespass', brand: 'Dynamic Discs', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with no trespassing sign being destroyed, red and black danger style, the word TRESPASS in warning font, Dynamic Discs brand text at bottom, rebellion style', color: '#e74c3c' },
  { id: 'dd_warrant', name: 'Warrant', brand: 'Dynamic Discs', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with search warrant document design, cream and black with red seal, the word WARRANT in official document font, Dynamic Discs brand text at bottom', color: '#d5d8dc' },
  // LATITUDE 64
  { id: 'lat64_river', name: 'River', brand: 'Latitude 64', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with flowing river through mountain valley, blue and green gradient, the word RIVER in flowing water font, Latitude 64 brand text at bottom, nature landscape style', color: '#3498db' },
  { id: 'lat64_fuse', name: 'Fuse', brand: 'Latitude 64', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with burning fuse spark pattern, orange and red with sparks, the word FUSE in fire font, Latitude 64 brand text at bottom, explosive style', color: '#e67e22' },
  { id: 'lat64_saint', name: 'Saint', brand: 'Latitude 64', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with angel wings and golden halo, white and gold divine light, the word SAINT in divine serif font, Latitude 64 brand text at bottom, heavenly JRPG style', color: '#f1c40f' },
  { id: 'lat64_explorer', name: 'Explorer', brand: 'Latitude 64', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with compass rose and old map design, earth tones and parchment, the word EXPLORER in adventure font, Latitude 64 brand text at bottom, cartography style', color: '#d4a574' },
  { id: 'lat64_diamond', name: 'Diamond', brand: 'Latitude 64', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with sparkling diamond gem facets, brilliant white and rainbow prismatic, the word DIAMOND in luxurious font, Latitude 64 brand text at bottom, gemstone sparkle style', color: '#bdc3c7' },
  { id: 'lat64_mercy', name: 'Mercy', brand: 'Latitude 64', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with praying hands and soft light rays, soft blue and white, the word MERCY in gentle italic font, Latitude 64 brand text at bottom, peaceful spiritual style', color: '#aed6f1' },
  { id: 'lat64_pearl', name: 'Pearl', brand: 'Latitude 64', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with iridescent pearl in oyster shell, pearly white and soft pink rainbow sheen, the word PEARL in elegant script font, Latitude 64 brand text at bottom', color: '#f5b7b1' },
  { id: 'lat64_trust', name: 'Trust', brand: 'Latitude 64', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with handshake and shield of trust, blue and silver, the word TRUST in reliable font, Latitude 64 brand text at bottom, partnership style', color: '#5dade2' },
  // MVP / AXIOM
  { id: 'mvp_photon', name: 'Photon', brand: 'MVP', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with photon particle physics design, electric blue and white energy, the word PHOTON in futuristic font, MVP brand text at bottom, quantum physics style', color: '#00d4ff' },
  { id: 'mvp_tesla', name: 'Tesla', brand: 'MVP', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with Tesla coil electricity bolts, purple and electric blue, the word TESLA in electric font, MVP brand text at bottom, steampunk electric style', color: '#9b59b6' },
  { id: 'mvp_volt', name: 'Volt', brand: 'MVP', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with lightning bolt energy pattern, yellow and electric blue, the word VOLT in lightning font, MVP brand text at bottom, electric energy style', color: '#f1c40f' },
  { id: 'mvp_envy', name: 'Envy', brand: 'MVP', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with green eye of envy design, emerald green with dark pupil, the word ENVY in jealous font, MVP brand text at bottom, seven sins style', color: '#27ae60' },
  { id: 'mvp_atom', name: 'Atom', brand: 'MVP', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with atomic orbital rings and nucleus, cyan and white scientific design, the word ATOM in scientific font, MVP brand text at bottom, atomic structure style', color: '#00bcd4' },
  { id: 'mvp_theory', name: 'Theory', brand: 'MVP', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with mathematical equations and blackboard formula design, dark green chalkboard with white equations, the word THEORY in chalk font, MVP brand text at bottom, scientific theory style', color: '#1e8449' },
  { id: 'mvp_relay', name: 'Relay', brand: 'Axiom', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with Olympic relay baton passing design, orange and black racing stripes, the word RELAY in athletic font, Axiom brand text at bottom, racing relay style', color: '#e67e22' },
  { id: 'mvp_crave', name: 'Crave', brand: 'Axiom', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with craving hunger desire design, deep red and black, the word CRAVE in hungry font, Axiom brand text at bottom, dark desire style', color: '#922b21' },
  // PRODIGY
  { id: 'prodigy_d1', name: 'D1', brand: 'Prodigy', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with speed force one design, blue and white bold racing style, the word D1 in bold number font, Prodigy brand text at bottom, formula one speed style', color: '#2c3e50' },
  { id: 'prodigy_d4', name: 'D4', brand: 'Prodigy', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with aerodynamic air flow lines design, teal and white, the word D4 in aerodynamic font, Prodigy brand text at bottom, wind tunnel style', color: '#1abc9c' },
  { id: 'prodigy_m4', name: 'M4', brand: 'Prodigy', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with midrange precision crosshair design, orange and black, the word M4 in precision font, Prodigy brand text at bottom, targeting style', color: '#e67e22' },
  { id: 'prodigy_pa3', name: 'PA3', brand: 'Prodigy', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with putter approach target design, soft green and white, the word PA3 in clean approach font, Prodigy brand text at bottom, precision putting style', color: '#2ecc71' },
  { id: 'prodigy_f7', name: 'F7', brand: 'Prodigy', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with F-7 fighter jet design, military gray and blue, the word F7 in military stencil font, Prodigy brand text at bottom, fighter jet style', color: '#5d6d7e' },
  // DISCMANIA
  { id: 'dm_p2', name: 'P2', brand: 'Discmania', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with finnish nature birch tree design, green and white Scandinavian, the word P2 in clean Nordic font, Discmania brand text at bottom, Finnish nature style', color: '#27ae60' },
  { id: 'dm_fd', name: 'FD', brand: 'Discmania', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with Finnish disc golf fairway design, blue and green, the word FD in clean Discmania font, Discmania brand text at bottom, clean Finnish design', color: '#2980b9' },
  { id: 'dm_dd3', name: 'DD3', brand: 'Discmania', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with wind dragon design, deep purple and blue, the word DD3 in powerful font, Discmania brand text at bottom, JRPG wind dragon style', color: '#6c3483' },
  { id: 'dm_pd', name: 'PD', brand: 'Discmania', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with power driver energy design, red and black aggressive, the word PD in power font, Discmania brand text at bottom, power energy style', color: '#e74c3c' },
  { id: 'dm_lunatic', name: 'Lunatic', brand: 'Discmania', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with crazed laughing moon face, purple and silver moonlight, the word LUNATIC in mad font, Discmania brand text at bottom, crazy moon JRPG style', color: '#8e44ad' },
  { id: 'dm_fortune', name: 'Fortune', brand: 'Discmania', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with fortune cookie and lucky symbols, gold and red, the word FORTUNE in lucky font, Discmania brand text at bottom, fortune cookie style', color: '#f1c40f' },
  { id: 'dm_geotrax', name: 'Geotrax', brand: 'Discmania', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with GPS topographic map contour lines, green and brown earth tones, the word GEOTRAX in topographic font, Discmania brand text at bottom, cartography terrain style', color: '#6e4b3a' },
  { id: 'dm_method', name: 'Method', brand: 'Discmania', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with scientific method beaker and experiment design, teal and white, the word METHOD in scientific font, Discmania brand text at bottom, laboratory style', color: '#008080' },
  // CRAFTMIND EXCLUSIVES
  { id: 'custom_tsunami', name: 'Tsunami', brand: 'CraftMind', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with massive ocean wave and tidal energy, deep blue and white foam, the word TSUNAMI in wave font, CraftMind brand text at bottom, ocean power JRPG style', color: '#1a5276' },
  { id: 'custom_sitka_slammer', name: 'Sitka Slammer', brand: 'CraftMind', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with Sitka Alaska fishing boat and mountain landscape, forest green and ocean blue, the word SITKA SLAMMER in rustic font, CraftMind brand text at bottom, Alaskan fishing town style', color: '#2c3e50' },
  { id: 'custom_salmon_run', name: 'Salmon Run', brand: 'CraftMind', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with jumping salmon and Alaskan river, orange and blue water design, the word SALMON RUN in wild river font, CraftMind brand text at bottom, Alaskan salmon style', color: '#e67e22' },
  { id: 'custom_northern_lights', name: 'Aurora', brand: 'CraftMind', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with northern lights aurora borealis over mountains, green and purple aurora, the word AURORA in ethereal font, CraftMind brand text at bottom, Arctic aurora style', color: '#27ae60' },
  { id: 'custom_glacier', name: 'Glacier', brand: 'CraftMind', type: 'putter', prompt: 'Disc golf disc stamp design viewed from above, circular disc with blue glacier ice crystal design, ice blue and white frozen, the word GLACIER in frozen crystal font, CraftMind brand text at bottom, Arctic ice style', color: '#85c1e9' },
  { id: 'custom_volcano', name: 'Edgecumbe', brand: 'CraftMind', type: 'distance_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with Mount Edgecumbe volcano eruption, red lava and dark rock, the word EDGECUMBE in volcanic font, CraftMind brand text at bottom, Sitka volcano style', color: '#c0392b' },
  { id: 'custom_bear', name: 'Brown Bear', brand: 'CraftMind', type: 'midrange', prompt: 'Disc golf disc stamp design viewed from above, circular disc with Alaskan brown bear catching salmon, brown and blue river scene, the word BEAR in wild nature font, CraftMind brand text at bottom, Alaskan wildlife style', color: '#8b4513' },
  { id: 'custom_eagle', name: 'Bald Eagle', brand: 'CraftMind', type: 'fairway_driver', prompt: 'Disc golf disc stamp design viewed from above, circular disc with bald eagle soaring over Sitka Sound, white and brown with blue sky, the word EAGLE in majestic font, CraftMind brand text at bottom, American bald eagle style', color: '#ecf0f1' },
];

async function generateDiscImage(disc) {
  const outputDir = path.join(ASSETS_DIR, disc.type);
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${disc.id}.png`);

  if (fs.existsSync(outputPath)) return 'exists';

  const body = JSON.stringify({
    contents: [{ parts: [{ text: disc.prompt }] }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 429) { resolve('rate_limited'); return; }
        try {
          const json = JSON.parse(data);
          const parts = json.candidates?.[0]?.content?.parts || [];
          const imagePart = parts.find(p => p.inlineData);
          if (imagePart?.inlineData?.data) {
            fs.writeFileSync(outputPath, Buffer.from(imagePart.inlineData.data, 'base64'));
            resolve('ok');
          } else {
            const text = parts.find(p => p.text)?.text?.substring(0, 100) || 'none';
            console.log(`    No image. Text: ${text}`);
            resolve('fail');
          }
        } catch(e) {
          console.log(`    Parse error: ${e.message.substring(0, 80)}`);
          resolve('fail');
        }
      });
    });
    req.on('error', (e) => { console.log(`    Network: ${e.message}`); resolve('fail'); });
    req.write(body);
    req.end();
  });
}

async function wait(seconds) { return new Promise(r => setTimeout(r, seconds * 1000)); }

async function main() {
  if (!API_KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

  console.log(`Generating ${DISCS.length} disc images...`);
  console.log(`Output: ${ASSETS_DIR}\n`);

  let generated = 0, failed = 0, skipped = 0;
  const failed_discs = [];

  for (let i = 0; i < DISCS.length; i++) {
    const disc = DISCS[i];
    process.stdout.write(`[${i+1}/${DISCS.length}] ${disc.brand} ${disc.name}... `);
    const result = await generateDiscImage(disc);

    if (result === 'exists') { console.log('✓ (exists)'); skipped++; }
    else if (result === 'ok') { console.log('✓'); generated++; }
    else if (result === 'rate_limited') { console.log('⏳ rate limited, waiting 90s...'); await wait(90); i--; continue; }
    else { console.log('✗'); failed++; failed_discs.push(disc.id); }

    // Back off more after failures
    const delay = (result === 'ok' || result === 'exists') ? 18 : 30;
    if (i < DISCS.length - 1) await wait(delay);
  }

  console.log(`\nDone! ${generated} generated, ${skipped} skipped, ${failed} failed`);
  if (failed_discs.length) console.log(`Failed: ${failed_discs.join(', ')}`);
  console.log(`Assets: ${ASSETS_DIR}`);
}

main();
