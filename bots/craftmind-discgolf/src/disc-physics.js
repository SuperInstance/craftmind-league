/**
 * Disc Physics Engine - Minecraft entity-based disc simulation.
 *
 * Uses snowball entities to simulate disc flight in Minecraft with
 * realistic physics, terrain collision, and basket detection.
 */

/**
 * @typedef {Object} ThrowResult
 * @property {string} discId - Disc identifier
 * @property {Array<{x:number,y:number,z:number,time:number}>} trajectory - Flight path
 * @property {number} distance - Total distance traveled in blocks
 * @property {number} height - Maximum height achieved
 * @property {string} landing - Landing zone category
 * @property {number} finalX - Final X position
 * @property {number} finalY - Final Y position
 * @property {number} finalZ - Final Z position
 * @property {boolean} inBasket - Whether disc landed in basket
 * @property {number} basketDistance - Distance from basket center
 * @property {number} score - Landing score (0-100)
 */

/**
 * Disc physics class for Minecraft entity simulation
 */
export class DiscPhysics {
  constructor(bot) {
    this.bot = bot;
    this.activeDiscs = new Map();
    this.gravity = 0.05; // Minecraft snowball gravity
    this.airResistance = 0.99;
    this.maxFlightTime = 200; // ticks (10 seconds)
  }

  /**
   * Throw a disc using snowball physics
   * @param {Object} options - Throw options
   * @returns {Promise<ThrowResult>} Throw result
   */
  async throw(options = {}) {
    const {
      disc = { id: 'default', speed: 5, glide: 4, turn: 0, fade: 2 },
      power = 0.85,
      angle = 0,
      hyzer = 0,
      startX,
      startY,
      startZ,
      basketX,
      basketY,
      basketZ,
      windSpeed = 0,
      windDirection = 0,
      obstacles = []
    } = options;

    // Validate positions
    if (startX === undefined || startY === undefined || startZ === undefined) {
      throw new Error('Start position (startX, startY, startZ) required');
    }

    // Calculate initial velocity based on power and disc speed
    const velocity = this.calculateVelocity(power, disc.speed, angle, hyzer);

    // Initialize disc state
    const discState = {
      x: startX,
      y: startY,
      z: startZ,
      vx: velocity.x,
      vy: velocity.y,
      vz: velocity.z,
      time: 0,
      trajectory: [{ x: startX, y: startY, z: startZ, time: 0 }],
      maxHeight: startY,
      active: true
    };

    // Store active disc
    const discId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.activeDiscs.set(discId, discState);

    // Simulate flight
    const result = await this.simulateFlight(discState, {
      disc,
      basketX,
      basketY,
      basketZ,
      windSpeed,
      windDirection,
      obstacles
    });

    // Clean up
    this.activeDiscs.delete(discId);

    return {
      discId: disc.id,
      trajectory: result.trajectory,
      distance: result.distance,
      height: result.maxHeight - startY,
      landing: result.landing,
      finalX: result.x,
      finalY: result.y,
      finalZ: result.z,
      inBasket: result.inBasket,
      basketDistance: result.basketDistance,
      score: result.score
    };
  }

  /**
   * Calculate initial velocity vector based on throw parameters
   * @private
   */
  calculateVelocity(power, discSpeed, angle, hyzer) {
    // Base velocity from power and disc speed
    const baseSpeed = (0.4 + (discSpeed / 14) * 0.6) * power;

    // Convert angles to radians
    const angleRad = (angle * Math.PI) / 180;
    const hyzerRad = (hyzer * Math.PI) / 180;

    // Calculate velocity components
    // Angle: horizontal aim direction
    // Hyzer: disc tilt affecting curve
    // Vertical component: slight upward angle for distance

    const horizontalSpeed = baseSpeed * 0.95;
    const verticalSpeed = baseSpeed * 0.3 + 0.1; // Base loft

    const vx = horizontalSpeed * Math.sin(angleRad + hyzerRad * 0.3);
    const vy = verticalSpeed;
    const vz = horizontalSpeed * Math.cos(angleRad + hyzerRad * 0.3);

    return { x: vx, y: vy, z: vz };
  }

  /**
   * Simulate disc flight through Minecraft world
   * @private
   */
  async simulateFlight(state, params) {
    const { disc, basketX, basketY, basketZ, windSpeed, windDirection, obstacles } = params;
    let inBasket = false;
    let basketDistance = Infinity;
    let groundTime = 0;
    const maxGroundTime = 20; // ticks to wait before settling

    // Main physics loop
    while (state.time < this.maxFlightTime && state.active) {
      state.time++;

      // Apply physics
      this.updatePhysics(state, disc, windSpeed, windDirection);

      // Record trajectory
      state.trajectory.push({
        x: state.x,
        y: state.y,
        z: state.z,
        time: state.time
      });

      // Track max height
      if (state.y > state.maxHeight) {
        state.maxHeight = state.y;
      }

      // Check terrain collision
      const groundY = await this.getGroundHeight(state.x, state.z);
      if (state.y <= groundY) {
        state.y = groundY;
        groundTime++;

        // Check if settled
        if (groundTime >= maxGroundTime) {
          state.active = false;
        }

        // Skip/roll physics
        if (groundTime === 1) {
          this.applySkipPhysics(state, disc);
        } else if (groundTime > 1) {
          this.applyRollPhysics(state, disc);
        }
      }

      // Check basket collision
      if (basketX !== undefined && basketY !== undefined && basketZ !== undefined) {
        const basketResult = this.checkBasketCollision(state, basketX, basketY, basketZ);
        inBasket = basketResult.inBasket;
        basketDistance = basketResult.distance;

        if (inBasket) {
          state.active = false;
          // Snap to basket center
          state.x = basketX;
          state.y = basketY;
          state.z = basketZ;
        }
      }

      // Check obstacle collision
      for (const obstacle of obstacles) {
        if (this.checkObstacleCollision(state, obstacle)) {
          this.applyObstacleDeflection(state, obstacle);
          break;
        }
      }

      // Check if out of bounds or too far
      if (state.y < -10) {
        state.active = false; // Fell out of world
      }

      // Small delay to prevent blocking
      if (state.time % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    // Calculate final results
    const startX = state.trajectory[0].x;
    const startZ = state.trajectory[0].z;
    const distance = Math.sqrt(
      Math.pow(state.x - startX, 2) +
      Math.pow(state.z - startZ, 2)
    );

    const landing = this.categorizeLanding(
      distance,
      basketDistance,
      inBasket,
      state.x,
      state.z,
      startX,
      startZ
    );

    return {
      x: state.x,
      y: state.y,
      z: state.z,
      trajectory: state.trajectory,
      maxHeight: state.maxHeight,
      distance,
      landing,
      inBasket,
      basketDistance,
      score: this.calculateScore(distance, basketDistance, inBasket, landing)
    };
  }

  /**
   * Update physics for one tick
   * @private
   */
  updatePhysics(state, disc, windSpeed, windDirection) {
    // Apply gravity
    state.vy -= this.gravity;

    // Apply air resistance
    state.vx *= this.airResistance;
    state.vy *= this.airResistance;
    state.vz *= this.airResistance;

    // Disc stability effects
    const speed = Math.sqrt(state.vx ** 2 + state.vy ** 2 + state.vz ** 2);
    const turnEffect = disc.turn * 0.001 * speed;
    const fadeEffect = disc.fade * 0.002 * (1 - speed / 10);

    // Apply turn and fade (perpendicular to motion)
    state.vx += turnEffect + fadeEffect;

    // Wind effect
    if (windSpeed > 0) {
      const windRad = (windDirection * Math.PI) / 180;
      state.vx += Math.cos(windRad) * windSpeed * 0.01;
      state.vz += Math.sin(windRad) * windSpeed * 0.01;
    }

    // Lift from glide
    const lift = disc.glide * 0.0001 * speed ** 2;
    state.vy += lift;

    // Update position
    state.x += state.vx;
    state.y += state.vy;
    state.z += state.vz;
  }

  /**
   * Apply skip physics when disc hits ground
   * @private
   */
  applySkipPhysics(state, disc) {
    const speed = Math.sqrt(state.vx ** 2 + state.vz ** 2);
    if (speed > 0.3) {
      // Skip: retain some horizontal momentum, reduce vertical
      state.vx *= 0.6;
      state.vz *= 0.6;
      state.vy = speed * 0.3 * Math.sin(Math.PI / 6); // 30-degree skip angle
    } else {
      state.vy = 0;
      state.vx *= 0.8;
      state.vz *= 0.8;
    }
  }

  /**
   * Apply roll physics after disc settles on ground
   * @private
   */
  applyRollPhysics(state, disc) {
    // Gradual slowdown
    state.vx *= 0.95;
    state.vz *= 0.95;

    // Stop if very slow
    if (Math.abs(state.vx) < 0.01 && Math.abs(state.vz) < 0.01) {
      state.vx = 0;
      state.vz = 0;
    }
  }

  /**
   * Get ground height at position
   * @private
   */
  async getGroundHeight(x, z) {
    try {
      const block = await this.bot.blockAt({ x: Math.floor(x), y: 100, z: Math.floor(z) });
      if (block) {
        // Find first solid block below
        for (let y = 100; y >= 0; y--) {
          const b = await this.bot.blockAt({ x: Math.floor(x), y, z: Math.floor(z) });
          if (b && b.type !== 0) { // Not air
            return y + 1;
          }
        }
      }
    } catch (error) {
      // Default to ground level if error
      console.warn('Error getting ground height:', error);
    }
    return 64; // Default sea level
  }

  /**
   * Check if disc is in or near basket
   * @private
   */
  checkBasketCollision(state, basketX, basketY, basketZ) {
    const dx = state.x - basketX;
    const dy = state.y - basketY;
    const dz = state.z - basketZ;
    const distance = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

    // Basket dimensions: 2 blocks tall, 1 block radius
    const inBasket = distance < 1.5 && dy > -2 && dy < 1;

    return { inBasket, distance };
  }

  /**
   * Check collision with obstacle
   * @private
   */
  checkObstacleCollision(state, obstacle) {
    const dx = state.x - obstacle.x;
    const dz = state.z - obstacle.z;
    const horizontalDist = Math.sqrt(dx ** 2 + dz ** 2);

    // Check if within obstacle radius and height
    return horizontalDist < obstacle.radius &&
           state.y < obstacle.height;
  }

  /**
   * Apply obstacle deflection
   * @private
   */
  applyObstacleDeflection(state, obstacle) {
    const dx = state.x - obstacle.x;
    const dz = state.z - obstacle.z;
    const dist = Math.sqrt(dx ** 2 + dz ** 2);

    if (dist > 0) {
      // Deflect away from obstacle
      const deflectX = (dx / dist) * 0.3;
      const deflectZ = (dz / dist) * 0.3;

      state.vx = deflectX;
      state.vz = deflectZ;
      state.vy *= 0.5; // Lose vertical momentum

      // Push out of obstacle
      state.x += (dx / dist) * 1.5;
      state.z += (dz / dist) * 1.5;
    }
  }

  /**
   * Categorize landing quality
   * @private
   */
  categorizeLanding(distance, basketDist, inBasket, x, z, startX, startZ) {
    if (inBasket) {
      return 'in_basket';
    }

    if (basketDist === Infinity) {
      // No basket defined, use distance-based
      return distance < 50 ? 'short' : distance < 150 ? 'medium' : 'long';
    }

    // Lateral accuracy
    const lateralOffset = Math.abs(
      Math.atan2(z - startZ, x - startX) -
      Math.atan2(basketDist, basketDist)
    ) * distance;

    if (basketDist < 3 && lateralOffset < 5) {
      return 'parked';
    } else if (basketDist < 10 && lateralOffset < 10) {
      return 'near_basket';
    } else if (basketDist < 20) {
      return 'approach_zone';
    } else if (lateralOffset > 20) {
      return 'off_line';
    } else {
      return 'short';
    }
  }

  /**
   * Calculate landing score (0-100)
   * @private
   */
  calculateScore(distance, basketDist, inBasket, landing) {
    if (inBasket) {
      return 100;
    }

    if (basketDist === Infinity) {
      return Math.min(100, distance / 3); // Distance-based for practice
    }

    const landingScores = {
      'parked': 95,
      'near_basket': 85,
      'approach_zone': 70,
      'off_line': 50,
      'short': 30
    };

    const baseScore = landingScores[landing] || 20;

    // Adjust based on basket proximity
    if (basketDist < 10) {
      return baseScore + (10 - basketDist);
    }

    return Math.max(0, baseScore);
  }

  /**
   * Get all active discs
   */
  getActiveDiscs() {
    return Array.from(this.activeDiscs.entries()).map(([id, state]) => ({
      id,
      x: state.x,
      y: state.y,
      z: state.z,
      time: state.time
    }));
  }

  /**
   * Stop tracking a specific disc
   */
  stopDisc(discId) {
    const disc = this.activeDiscs.get(discId);
    if (disc) {
      disc.active = false;
      this.activeDiscs.delete(discId);
      return true;
    }
    return false;
  }

  /**
   * Clear all active discs
   */
  clearAllDiscs() {
    for (const [id, disc] of this.activeDiscs) {
      disc.active = false;
    }
    this.activeDiscs.clear();
  }
}

/**
 * Create a new disc physics instance
 * @param {Object} bot - Mineflayer bot instance
 * @returns {DiscPhysics} Disc physics instance
 */
export function createDiscPhysics(bot) {
  return new DiscPhysics(bot);
}
