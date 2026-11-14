const fs=require("fs");
const nbt=require("/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules/prismarine-nbt");
async function load(name){ const {parsed}=await nbt.parse(fs.readFileSync(process.env.HOME+"/craftmind-league/repair-cody/"+name+".dat")); return {raw:parsed, simp:nbt.simplify(parsed)}; }
(async()=>{
  const files=["cody","cody_old","geist","vega","magnus"];
  const data={};
  for(const f of files){ try{ data[f]=await load(f);}catch(e){ console.log(f,"ERR",e.message)} }
  // key sets
  for(const f of files){ if(data[f]) console.log(f, "keys:", Object.keys(data[f].raw.value).sort().join(",")); }
  console.log("\n---DIFF keys Cody vs others---");
  const codyKeys=new Set(Object.keys(data.cody.raw.value));
  for(const f of ["geist","vega","magnus","cody_old"]){ const k=new Set(Object.keys(data[f].raw.value)); console.log(f, "only-in-cody:", [...codyKeys].filter(x=>!k.has(x)), "only-in-"+f+":", [...k].filter(x=>!codyKeys.has(x))); }
  console.log("\n---CODY_OLD detail---");
  console.log(JSON.stringify(data.cody_old.simp,null,1));
  console.log("\n---effects / all uncommon fields per file---");
  for(const f of files){ const s=data[f].simp; console.log(f, {Pos:s.Pos, Motion:s.Motion, Rotation:s.Rotation, OnGround:s.OnGround, Dimension:s.Dimension, gameType:s.playerGameType, abilities:s.abilities, attributes:s.attributes, RootVehicle:s.RootVehicle, Passengers:s.Passengers, active_effects:s.active_effects, effects:s.effects, Health:s.Health, SleepTimer:s.SleepTimer, FallFlying:s.FallFlying, fall_distance:s.fall_distance, Fire:s.Fire, Air:s.Air}); }
})();
