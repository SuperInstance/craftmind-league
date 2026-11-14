const fs=require("fs");
const nbt=require("/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules/prismarine-nbt");
async function parseFile(p){
  const buf=fs.readFileSync(p);
  const {parsed}=await nbt.parse(buf);
  return parsed;
}
function simplify(v){
  // nbt.simplify if available
  try { return nbt.simplify(v); } catch(e){ return v; }
}
(async()=>{
  for(const name of ["cody","geist","vega","magnus"]){
    const parsed=await parseFile(process.env.HOME+"/craftmind-league/repair-cody/"+name+".dat");
    const s=simplify(parsed);
    console.log("====="+name.toUpperCase()+"=====");
    console.log(JSON.stringify(s,null,1));
    console.log("---RAW TOP KEYS---", Object.keys(parsed.value||{}));
    // dump specific raw types
    const val=parsed.value||{};
    for(const k of ["RootVehicle","Pos","Motion","Rotation","Dimension","OnGround","FallDistance","Air","Fire","Invulnerable","PortalCooldown","Sleeping","Brain","Passengers","Riding","Vehicle","Leash","Health","foodLevel"]){
      if(k in val) console.log(k, JSON.stringify(val[k]));
    }
    console.log("Has RootVehicle:", "RootVehicle" in val, "Has Passengers:", "Passengers" in val);
  }
})();
