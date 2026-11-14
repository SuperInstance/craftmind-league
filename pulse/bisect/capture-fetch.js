// Contrast capture: the fetch shape Vega/Geist/smith use.
(async () => {
  const key = ["league", "cody"].join("-");
  const res = await fetch("http://127.0.0.1:8792/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({ model: "confluence-presence-brain", messages: [{ role: "user", content: "hi" }], max_tokens: 200, temperature: 0.8 }),
  });
  console.log("FETCH RESULT:", res.status, JSON.stringify(await res.json()));
})();
