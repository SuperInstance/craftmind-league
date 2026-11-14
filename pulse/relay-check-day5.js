'use strict';
// relay-check-day5.js — ddbridge end-to-end proof from Thor
// (127.0.0.1:8912, the driver's PRIMARY route). One metered call;
// PASS = HTTP 200 with non-empty model content. Prints usage cost.
const http = require('http');
const body = JSON.stringify({ model: 'deepseek-ai/DeepSeek-V4.1-Flash-1017', messages: [{ role: 'user', content: 'Reply with exactly: RELAY-OK' }], max_tokens: 20, temperature: 0 });
const req = http.request({ hostname: '127.0.0.1', port: 8912, path: '/chat/completions', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }, timeout: 30000 }, (res) => {
  let data = '';
  res.on('data', (c) => { data += c; });
  res.on('end', () => {
    try {
      const j = JSON.parse(data);
      const content = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : '';
      console.log('HTTP', res.statusCode, '| content:', JSON.stringify(content), '| usage:', JSON.stringify(j.usage || null));
      console.log(content && content.includes('RELAY-OK') ? 'RELAY-OK PASS' : (content ? 'RELAY ANSWERED (content differs) — route live' : 'RELAY FAIL: empty content'));
    } catch (e) { console.log('RELAY FAIL: parse', e.message, data.slice(0, 200)); }
  });
});
req.on('timeout', () => { req.destroy(new Error('timeout')); console.log('RELAY FAIL: timeout'); });
req.on('error', (e) => console.log('RELAY FAIL:', e.message));
req.write(body); req.end();
