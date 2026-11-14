/**
 * Disc Physics Engine — simplified disc flight simulation for Minecraft.
 *
 * Models disc trajectory in 3D space with lift, drag, spin decay,
 * and ground interaction. Outputs position arrays suitable for
 * mineflayer bot pathfinding / throwing.
 *
 * All distances in Minecraft blocks (1 block ≈ 1 foot for our purposes).
 */

import { applyExecutionNoise, executionNoiseEnabled } from './execution-noise.js';

export const GRAVITY = 9.81; // m/s²
export const AIR_DENSITY = 1.225; // kg/m³
export const DISC_MASS = 0.175; // kg (standard 175g disc)

/**
 * Flight result for a single throw.
 * @typedef {Object} FlightResult
 * @property {string} discId
 * @property {Array<{x:number,y:number,z:number,t:number}>} trajectory
 * @property {number} distance - total horizontal distance in blocks
 * @property {number} maxDistance - furthest point from launch
 * @property {number} height - peak height in blocks
 * @property {'parked'|'in_basket'|'short'|'long'|'left'|'right'|'obstacle'} landing
 * @property {number} finalX
 * @property {number} finalY
 * @property {number} finalZ
 */

/**
 * Simulate a disc throw.
 *
 * @param {Object} opts
 * @param {Object} opts.disc - disc object from database
 * @param {number} opts.power - 0-1 throw power
 * @param {number} opts.hyzer - angle in degrees (-90 to 90). Negative = anhyzer, positive = hyzer
 * @param {number} opts.aimYaw - horizontal aim in degrees
 * @param {number} opts.aimPitch - vertical aim in degrees (positive = up)
 * @param {number} opts.windSpeed - blocks/s
 * @param {number} opts.windDirection - degrees
 * @param {number} opts.startX
 * @param {number} opts.startY
 * @param {number} opts.startZ
 * @param {Array<{x:number,z:number,radius:number}>} opts.obstacles
 * @param {{throwsTaken:number}} [opts.skillState] - career throw counter;
 *        when env LEAGUE_NOISE=1, the intended shot is perturbed by
 *        practice-shrinking execution noise (see execution-noise.js)
 *        and this counter is incremented once for the throw.
 * @param {() => number} [opts.noiseRng] - injectable RNG for the noise
 * @returns {FlightResult}
 */
export function simulateThrow({
  disc,
  power = 0.85,
  hyzer = 0,
  aimYaw = 0,
  aimPitch = 8,
  windSpeed = 0,
  windDirection = 0,
  startX = 0,
  startY = 1.6,
  startZ = 0,
  obstacles = [],
  skillState = null,
  noiseRng = null,
}) {
  const dt = 0.02; // time step
  const maxTime = 8; // max flight time

  // Execution noise (flag: LEAGUE_NOISE=1 + a skill state). Off = the
  // intended shot is used verbatim, exactly as upstream.
  let execution = null;
  if (skillState && executionNoiseEnabled()) {
    const eff = applyExecutionNoise({ power, hyzer, aimYaw }, skillState, noiseRng || Math.random);
    power = eff.power;
    hyzer = eff.hyzer;
    aimYaw = eff.aimYaw;
    execution = eff.noise;
    skillState.throwsTaken = (skillState.throwsTaken || 0) + 1;
  }

  // Initial velocity based on disc speed and throw power
  // Typical arm speed mapped: speed 14 driver = ~25 m/s max
  const maxArmSpeed = 22 + (disc.speed / 14) * 8;
  const armSpeed = maxArmSpeed * power;

  const yawRad = (aimYaw * Math.PI) / 180;
  const pitchRad = (aimPitch * Math.PI) / 180;
  const hyzerRad = (hyzer * Math.PI) / 180;

  let vx = armSpeed * Math.cos(pitchRad) * Math.cos(yawRad);
  let vy = armSpeed * Math.sin(pitchRad);
  let vz = armSpeed * Math.cos(pitchRad) * Math.sin(yawRad);

  // Disc properties affect drag and lift
  const dragCoeff = 0.08 + (14 - disc.speed) * 0.003;
  const liftCoeff = 0.02 + (disc.glide / 7) * 0.06;

  // Spin effect on turn
  const spinEffect = disc.turn * 0.15; // turn rating influences curving

  let x = startX, y = startY, z = startZ;
  let hitObstacle = false; // hoisted: also read by the landing classification after the loop (upstream had it loop-scoped -> ReferenceError)
  let t = 0;

  const trajectory = [{ x, y, z, t }];
  let maxDist = 0, peakHeight = y;

  while (t < maxTime) {
    t += dt;

    // Velocity magnitude
    const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
    if (speed < 0.1) break;

    // Drag
    const drag = 0.5 * AIR_DENSITY * speed * speed * dragCoeff * (1 / DISC_MASS);
    const dragX = -drag * (vx / speed);
    const dragZ = -drag * (vz / speed);
    const dragY = -drag * (vy / speed);

    // Lift (perpendicular to velocity, upward)
    const lift = 0.5 * AIR_DENSITY * speed * speed * liftCoeff * (1 / DISC_MASS);

    // Gravity
    const gravY = -GRAVITY;

    // Spin decay — disc's natural turn fades as it slows
    const spinFactor = Math.max(0, 1 - t / (2 + disc.fade * 0.5));

    // Turn effect: lateral force based on disc turn rating + hyzer angle
    // At high speed: disc turns in direction of hyzer/anhyzer
    // As it slows: fade kicks in (always left for RHBH)
    const turnForce = spinEffect * spinFactor + (hyzer * 0.03);
    const fadeForce = disc.fade * 0.08 * (1 - spinFactor);

    // Lateral force direction (perpendicular to throw direction)
    const lateralX = Math.sin(yawRad + Math.PI / 2);
    const lateralZ = Math.cos(yawRad + Math.PI / 2);

    // Wind
    const windRad = (windDirection * Math.PI) / 180;
    const windVx = windSpeed * Math.cos(windRad) * 0.5;
    const windVz = windSpeed * Math.sin(windRad) * 0.5;

    // Apply forces
    vx += (dragX + (turnForce + fadeForce) * lateralX + windVx * 0.01) * dt;
    vy += (dragY + lift * 0.3 + gravY) * dt;
    vz += (dragZ + (turnForce + fadeForce) * lateralZ + windVz * 0.01) * dt;

    x += vx * dt;
    y += vy * dt;
    z += vz * dt;

    // Ground collision
    if (y <= 0) {
      y = 0;
      trajectory.push({ x, y, z, t });
      break;
    }

    // Obstacle collision (simple sphere check)
    hitObstacle = false;
    for (const obs of obstacles) {
      const dx = x - obs.x;
      const dz = z - obs.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < obs.radius && y < 6) {
        hitObstacle = true;
        // Deflect — reduce speed significantly
        vx *= 0.3;
        vz *= 0.3;
        vy *= 0.5;
        // Push away from obstacle center
        x += (dx / dist) * 1.5;
        z += (dz / dist) * 1.5;
        trajectory.push({ x, y, z, t });
        break;
      }
    }

    if (hitObstacle && y <= 1) break;

    trajectory.push({ x, y, z, t });

    const horizDist = Math.sqrt((x - startX) ** 2 + (z - startZ) ** 2);
    if (horizDist > maxDist) maxDist = horizDist;
    if (y > peakHeight) peakHeight = y;
  }

  const finalX = x, finalY = y, finalZ = z;
  const distance = Math.sqrt((finalX - startX) ** 2 + (finalZ - startZ) ** 2);

  // Determine landing quality relative to basket position (assume basket at target)
  const targetDistance = maxDist; // we used maxDist as the target
  const lateralOffset = Math.abs(finalX - startX); // simplified

  let landing;
  if (hitObstacle) {
    landing = 'obstacle';
  } else if (distance < 5) {
    landing = 'short';
  } else if (lateralOffset > 8) {
    landing = finalX > startX ? 'right' : 'left';
  } else if (distance > targetDistance * 1.1) {
    landing = 'long';
  } else if (distance > targetDistance * 0.8 && lateralOffset < 3) {
    landing = 'parked';
  } else if (distance > targetDistance * 0.7 && lateralOffset < 5) {
    landing = 'in_basket';
  } else {
    landing = 'short';
  }

  const result = {
    discId: disc.id,
    trajectory,
    distance,
    maxDistance: maxDist,
    height: peakHeight - startY,
    landing,
    finalX,
    finalY,
    finalZ,
  };
  if (execution) {
    // The shot as actually executed (post-noise) + the noise record.
    result.shot = { power, hyzer, aimYaw, aimPitch };
    result.executionNoise = execution;
  }
  return result;
}
