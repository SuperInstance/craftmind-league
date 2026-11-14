// Runs the three gate fixtures against out/budget.json and files the rulings.
//   node fixtures/run-fixtures.js
'use strict';
const fs = require('fs');
const path = require('path');
const { rule } = require('../gate');

const budget = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'out', 'budget.json'), 'utf8'));
const files = ['plan-day10-replay.json', 'plan-starved.json', 'plan-bloated.json'];
const rulings = files.map(f => rule(JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8')), budget));
fs.writeFileSync(path.join(__dirname, '..', 'out', 'fixture-rulings.json'), JSON.stringify(rulings, null, 1));
for (const r of rulings) console.log(`${r.plan}: ${r.ruling} — ${r.why}`);
