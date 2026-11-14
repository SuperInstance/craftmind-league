// Replicates the resident mind call: league LLMClient + the REAL Cody
// config required from disk; only apiUrl is overridden to the echo port.
const cfg = require("/home/caseydigennaro/craftmind-league/bots/runs/cody/craftmind.config.js");
const { LLMClient } = require("/home/caseydigennaro/craftmind-league/bots/craftmind/src/brain.js");
const llm = new LLMClient({ ...cfg.llm, apiUrl: "http://127.0.0.1:8791/v1/chat/completions" });
llm.setSystemPrompt("You are Cody, a friendly AI player in a Minecraft world.");
llm.chat("hi", { _internal: true }).then(r => {
  console.log("CLIENT RESULT:", JSON.stringify(r));
  process.exit(0);
}).catch(e => { console.log("CLIENT ERROR:", e.message); process.exit(0); });
