/**
 * round2-course.js — the Round 2 card: Acadia Pines, mutated.
 *
 * Same course identity as ACADEDA_PINES_COURSE (same holes, names,
 * tees, baskets, obstacles, pars). ONLY distances changed, per hole,
 * from Round 1s measured per-hole evidence (logs/round-1.json;
 * analysis in logs/round-2.md). Pars are untouched: every Round 1
 * distortion traced to distance-vs-arm mismatch or the putter floor,
 * not to wrongly-set pars.
 *
 *   H1 180->235  field -1.00 (all three birdied) — bunched, too easy
 *   H2 210->195  veterans -0.50; the field number (+1.33) is one
 *                rookie putting collapse (Pip 8) — slightly shorter
 *                approach; the putting fix itself is calibration-side
 *   H3 320->300  field +0.67, veterans +1.00 — firmest par 4 after H5
 *   H4 195->240  field -1.00 (all three birdied) — bunched, too easy
 *   H5 380->380  KEPT. +1.00 was a scale artefact: Round 1 drives
 *                covered 31% of it; the calibrated drive covers 46%
 *   H6 155->155  KEPT. The identity ace run; its +0.33 was putter-
 *                floor overshoot (Mara took 4 with three short putts)
 *   H7 240->240  KEPT. The one honest hole (field +0.33, vets at par)
 *   H8 350->370  field -0.67, veterans birdied a par-4 expert hole —
 *                played soft, lengthen the water carry
 *   H9 175->205  field -0.67 — gentle but too gentle
 */
import { ACADEDA_PINES_COURSE } from "./course-builder.js";

const ROUND2_DISTANCES = { 1: 235, 2: 195, 3: 300, 4: 240, 5: 380, 6: 155, 7: 240, 8: 370, 9: 205 };

export const ACADIA_PINES_ROUND2_COURSE = {
  ...ACADEDA_PINES_COURSE,
  name: "Acadia Pines Disc Golf Course — Round 2 card",
  holes: ACADEDA_PINES_COURSE.holes.map((h) => ({ ...h, distance: ROUND2_DISTANCES[h.number] ?? h.distance })),
};
