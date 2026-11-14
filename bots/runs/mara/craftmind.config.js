// craftmind.config.js — league run config for agent "mara".
// The brain's apiUrl points at the league GOVERNOR (127.0.0.1:8642),
// never at a model directly — the governor meters mind-seconds per
// agent and writes the receipts. The apiKey is the agent identity:
// "league-<agentname>".
module.exports = {
  llm: {
    apiUrl: 'http://127.0.0.1:8642/v1/chat/completions',
    apiKey: 'league-mara',
    model: 'confluence-presence-brain',
    maxTokens: 200,
    temperature: 0.8,
    timeout: 15000,
    minInterval: 2000,
    maxHistory: 20,
  },
};
