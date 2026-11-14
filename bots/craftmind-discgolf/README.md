# CraftMind Disc Golf 🥏

A physics-based disc golf flight simulator you can run yourself. It uses measured throw data, not marketing numbers.

**Live URL:** [craftmind-discgolf.cocapn.workers.dev](https://craftmind-discgolf.cocapn.workers.dev)

---

## What It Is
You found a different kind of disc golf tool. It simulates throws based on aggregated data from over 100 recorded throws per disc model. There are no accounts, subscriptions, or locked features. Fork the repository, and it's yours.

## Quick Start
This is a fork-first project.
1.  **Fork** this repository.
2.  **Deploy** it to Cloudflare Workers: `npm run deploy`
3.  **Customize** it: edit `src/discs.js` to add your discs or add your local course.

It runs locally with zero network dependencies after forking.

## Features
*   **72 Discs**: Flight paths are modeled from community-aggregated throw test data.
*   **3 Courses**: Real, surveyed holes with elevation and obstacle positions.
*   **Adjustable AI Players**: Tune skill parameters like putting accuracy or aggressiveness.
*   **Physics Simulation**: Models release angle, wobble, crosswind, skip, and roll-out.
*   **Zero Dependencies**: Runs on a single Cloudflare Worker with no external runtime calls.
*   **Editable Everything**: Modify discs, courses, and AI behavior directly in the source code.

## How It Works
The agent uses a stochastic physics engine to simulate flight. AI players make probabilistic decisions based on their skill profile and the current lie. Everything is served statelessly from a Cloudflare Worker.

## A Specific Limitation
The AI's decision-making is probability-based, not learned. In complex scenarios (e.g., a heavily wooded tunnel), it cannot "learn" an optimal line and may attempt shots a seasoned player would avoid.

## License
MIT License. Use the code for any purpose.

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> &middot; <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a> &middot; Superinstance and Lucineer (DiGennaro et al.)</div>
---

## Fleet Context

Part of the Lucineer/Cocapn fleet. See [fleet-onboarding](https://github.com/Lucineer/fleet-onboarding) for boarding protocol.

- **Vessel:** JetsonClaw1 (Jetson Orin Nano 8GB)
- **Domain:** Low-level systems, CUDA, edge computing
- **Comms:** Bottles via Forgemaster/Oracle1, Matrix #fleet-ops
