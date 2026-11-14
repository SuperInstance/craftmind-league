/**
 * Course Builder - Define and build disc golf courses in Minecraft.
 *
 * Supports JSON-based hole definitions, pre-built courses,
 * and RCON-based course setup for automated course creation.
 */

/**
 * @typedef {Object} Hole
 * @property {number} number - Hole number (1-18)
 * @property {string} name - Hole name
 * @property {number} par - Par value (3-5)
 * @property {number} distance - Distance in blocks from tee to basket
 * @property {Object} tee - Tee position {x, y, z, yaw}
 * @property {Object} basket - Basket position {x, y, z}
 * @property {Array<{x:number,z:number,radius:number,height:number}>} obstacles - Obstacles
 * @property {string} difficulty - 'easy'|'medium'|'hard'|'expert'
 * @property {string} description - Hole description
 */

/**
 * @typedef {Object} Course
 * @property {string} id - Course identifier
 * @property {string} name - Course name
 * @property {Array<Hole>} holes - Array of holes
 * @property {Object} metadata - Course metadata
 */

/**
 * Pre-built 9-hole "Acadia Pines" course with varied difficulty
 */
const ACADEDA_PINES_COURSE = {
  id: 'acada-pines',
  name: 'Acadia Pines Disc Golf Course',
  metadata: {
    location: 'Maine, USA',
    signature: 'Tight pine tunnels with elevation changes',
    difficulty: 'intermediate',
    holes: 9,
    totalPar: 30,
    author: 'CraftMind Disc Golf'
  },
  holes: [
    {
      number: 1,
      name: 'The Opener',
      par: 3,
      distance: 180,
      tee: { x: 100, y: 64, z: 100, yaw: 45 },
      basket: { x: 273, y: 64, z: 273 },
      obstacles: [],
      difficulty: 'easy',
      description: 'Straightforward opening hole with no obstacles. Good warm-up.'
    },
    {
      number: 2,
      name: 'Pine Needle Alley',
      par: 3,
      distance: 210,
      tee: { x: 280, y: 64, z: 270, yaw: 135 },
      basket: { x: 270, y: 64, z: 478 },
      obstacles: [
        { x: 320, z: 350, radius: 8, height: 12 },
        { x: 280, z: 400, radius: 6, height: 10 }
      ],
      difficulty: 'medium',
      description: 'Narrow fairway through pine trees. Accuracy over distance.'
    },
    {
      number: 3,
      name: 'Elevation Drop',
      par: 4,
      distance: 320,
      tee: { x: 270, y: 72, z: 485, yaw: -45 },
      basket: { x: 560, y: 58, z: 180 },
      obstacles: [
        { x: 400, z: 350, radius: 15, height: 8 }
      ],
      difficulty: 'hard',
      description: 'Significant downhill shot. Watch your landing zone.'
    },
    {
      number: 4,
      name: 'The Tunnel',
      par: 3,
      distance: 195,
      tee: { x: 565, y: 58, z: 180, yaw: 180 },
      basket: { x: 565, y: 58, z: -15 },
      obstacles: [
        { x: 550, z: 60, radius: 5, height: 20 },
        { x: 580, z: 100, radius: 5, height: 20 }
      ],
      difficulty: 'medium',
      description: 'Pure tunnel shot. Straight or bust.'
    },
    {
      number: 5,
      name: 'Risk/Reward',
      par: 4,
      distance: 380,
      tee: { x: 565, y: 58, z: -20, yaw: -90 },
      basket: { x: 180, y: 64, z: -20 },
      obstacles: [
        { x: 400, z: -10, radius: 25, height: 6 },
        { x: 300, z: -40, radius: 10, height: 8 },
        { x: 300, z: 20, radius: 10, height: 8 }
      ],
      difficulty: 'expert',
      description: 'Big distance with multiple obstacle routes. Go big or lay up?'
    },
    {
      number: 6,
      name: 'Ace Run',
      par: 3,
      distance: 155,
      tee: { x: 180, y: 64, z: -15, yaw: 0 },
      basket: { x: 180, y: 64, z: 140 },
      obstacles: [],
      difficulty: 'easy',
      description: 'Short hole with clear ace potential.'
    },
    {
      number: 7,
      name: 'The Grove',
      par: 3,
      distance: 240,
      tee: { x: 180, y: 64, z: 145, yaw: 45 },
      basket: { x: 412, y: 64, z: 377 },
      obstacles: [
        { x: 280, z: 200, radius: 8, height: 15 },
        { x: 320, z: 250, radius: 10, height: 12 },
        { x: 350, z: 300, radius: 7, height: 14 }
      ],
      difficulty: 'hard',
      description: 'Winding path through dense forest. Shot shaping required.'
    },
    {
      number: 8,
      name: 'Water Hazard',
      par: 4,
      distance: 350,
      tee: { x: 415, y: 64, z: 380, yaw: 135 },
      basket: { x: 100, y: 64, z: 730 },
      obstacles: [
        { x: 350, z: 500, radius: 30, height: 3 },
        { x: 250, z: 600, radius: 20, height: 4 }
      ],
      difficulty: 'expert',
      description: 'Long hole with water (blue clay/wool) hazards. Punishes mistakes.'
    },
    {
      number: 9,
      name: 'Clubhouse Finish',
      par: 3,
      distance: 175,
      tee: { x: 100, y: 64, z: 730, yaw: -135 },
      basket: { x: -67, y: 64, z: 563 },
      obstacles: [
        { x: 20, z: 650, radius: 12, height: 8 }
      ],
      difficulty: 'easy',
      description: 'Gentle finishing hole back toward the clubhouse.'
    }
  ]
};

/**
 * Course Builder class for loading and building disc golf courses
 */
export class CourseBuilder {
  constructor(rconClient = null) {
    this.rconClient = rconClient;
    this.courses = new Map();
    this.currentCourse = null;

    // Load default courses
    this.loadCourse(ACADDA_PINES_COURSE);
  }

  /**
   * Load a course into memory
   * @param {Course} course - Course object or JSON string
   */
  loadCourse(course) {
    if (typeof course === 'string') {
      course = JSON.parse(course);
    }

    if (!course.id || !course.holes || !Array.isArray(course.holes)) {
      throw new Error('Invalid course format: must have id and holes array');
    }

    this.courses.set(course.id, course);
    return course;
  }

  /**
   * Set the active course for play
   * @param {string} courseId - Course identifier
   */
  setActiveCourse(courseId) {
    const course = this.courses.get(courseId);
    if (!course) {
      throw new Error(`Course not found: ${courseId}`);
    }
    this.currentCourse = course;
    return course;
  }

  /**
   * Get a specific hole from the current course
   * @param {number} holeNumber - Hole number (1-18)
   */
  getHole(holeNumber) {
    if (!this.currentCourse) {
      throw new Error('No active course. Call setActiveCourse first.');
    }

    const hole = this.currentCourse.holes.find(h => h.number === holeNumber);
    if (!hole) {
      throw new Error(`Hole ${holeNumber} not found in current course`);
    }

    return hole;
  }

  /**
   * Get all holes from the current course
   */
  getAllHoles() {
    if (!this.currentCourse) {
      throw new Error('No active course. Call setActiveCourse first.');
    }
    return this.currentCourse.holes;
  }

  /**
   * List all available courses
   */
  listCourses() {
    return Array.from(this.courses.values()).map(course => ({
      id: course.id,
      name: course.name,
      holes: course.holes.length,
      totalPar: course.metadata?.totalPar || course.holes.reduce((sum, h) => sum + h.par, 0),
      difficulty: course.metadata?.difficulty || 'unknown'
    }));
  }

  /**
   * List holes in current course with summary
   */
  listHoles() {
    if (!this.currentCourse) {
      throw new Error('No active course. Call setActiveCourse first.');
    }

    return this.currentCourse.holes.map(hole => ({
      number: hole.number,
      name: hole.name,
      par: hole.par,
      distance: hole.distance,
      difficulty: hole.difficulty,
      description: hole.description
    }));
  }

  /**
   * Build a hole in Minecraft using RCON commands
   * @param {number} holeNumber - Hole number to build
   * @param {Object} options - Build options
   */
  async buildHole(holeNumber, options = {}) {
    if (!this.rconClient) {
      throw new Error('RCON client required for building. Initialize CourseBuilder with rconClient.');
    }

    const hole = this.getHole(holeNumber);
    const { clearArea = true, placeMarkers = true } = options;

    const commands = [];

    // Clear fairway area
    if (clearArea) {
      commands.push(
        // Clear area between tee and basket
        this.generateClearCommand(hole.tee, hole.basket, hole.distance + 20)
      );
    }

    // Place tee marker (sign)
    if (placeMarkers) {
      commands.push(
        `setblock ${hole.tee.x} ${hole.tee.y} ${hole.tee.z} oak_sign[facing=${this.getDirection(hole.tee, hole.basket)}]`,
        `data merge block ${hole.tee.x} ${hole.tee.y} ${hole.tee.z} {Text1:'{"text":"Hole ${hole.number}","color:"black"}',Text2:'{"text":"${hole.name}","color:"blue"}',Text3:'{"text":"Par ${hole.par} | ${hole.distance}\'","color:"dark_green"}',Text4:'{"text":"${hole.difficulty}","color":"${this.getDifficultyColor(hole.difficulty)}"}'}`
      );
    }

    // Place basket (chain/iron bars + sign)
    if (placeMarkers) {
      commands.push(
        // Basket chains (iron bars)
        `setblock ${hole.basket.x} ${hole.basket.y} ${hole.basket.z} iron_bars`,
        `setblock ${hole.basket.x} ${hole.basket.y + 1} ${hole.basket.z} iron_bars`,
        `setblock ${hole.basket.x} ${hole.basket.y + 2} ${hole.basket.z} iron_bars`,
        // Basket sign
        `setblock ${hole.basket.x + 1} ${hole.basket.y} ${hole.basket.z} oak_sign[facing=west]`,
        `data merge block ${hole.basket.x + 1} ${hole.basket.y} ${hole.basket.z} {Text1:'{"text":"Basket","color:"gold"}',Text2:'{"text":"Hole ${hole.number}","color:"black"}',Text3:'{"text":"","color:"black"}',Text4:'{"text":"","color:"black"}'}`
      );
    }

    // Place obstacles (oak logs representing trees)
    for (const obs of hole.obstacles) {
      for (let y = 0; y < obs.height; y++) {
        commands.push(
          `setblock ${obs.x} ${hole.basket.y + y} ${obs.z} oak_log[axis=y]`
        );
      }
      // Leaves on top
      commands.push(
        `setblock ${obs.x} ${hole.basket.y + obs.height} ${obs.z} oak_leaves[distance=1,persistent=true]`,
        `setblock ${obs.x + 1} ${hole.basket.y + obs.height} ${obs.z} oak_leaves[distance=1,persistent=true]`,
        `setblock ${obs.x - 1} ${hole.basket.y + obs.height} ${obs.z} oak_leaves[distance=1,persistent=true]`,
        `setblock ${obs.x} ${hole.basket.y + obs.height} ${obs.z + 1} oak_leaves[distance=1,persistent=true]`,
        `setblock ${obs.x} ${hole.basket.y + obs.height} ${obs.z - 1} oak_leaves[distance=1,persistent=true]`
      );
    }

    // Execute all commands
    for (const cmd of commands) {
      await this.rconClient.send(cmd);
    }

    return {
      success: true,
      hole: hole.number,
      commandsExecuted: commands.length
    };
  }

  /**
   * Build all holes in the current course
   */
  async buildCourse(options = {}) {
    if (!this.currentCourse) {
      throw new Error('No active course. Call setActiveCourse first.');
    }

    const results = [];
    for (const hole of this.currentCourse.holes) {
      const result = await this.buildHole(hole.number, options);
      results.push(result);
    }

    return results;
  }

  /**
   * Generate a clear command for fairway area
   * @private
   */
  generateClearCommand(tee, basket, buffer = 20) {
    // Calculate bounding box
    const minX = Math.min(tee.x, basket.x) - buffer / 2;
    const maxX = Math.max(tee.x, basket.x) + buffer / 2;
    const minZ = Math.min(tee.z, basket.z) - buffer / 2;
    const maxZ = Math.max(tee.z, basket.z) + buffer / 2;
    const minY = Math.min(tee.y, basket.y) - 2;
    const maxY = Math.max(tee.y, basket.y) + 15;

    return `fill ${minX} ${minY} ${minZ} ${maxX} ${maxY} ${maxZ} air replace grass_block dirt stone oak_leaves oak_log`;
  }

  /**
   * Get cardinal direction from one point to another
   * @private
   */
  getDirection(from, to) {
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const angle = Math.atan2(dx, dz) * (180 / Math.PI);

    if (angle >= -45 && angle < 45) return 'south';
    if (angle >= 45 && angle < 135) return 'west';
    if (angle >= 135 || angle < -135) return 'north';
    return 'east';
  }

  /**
   * Get Minecraft color code for difficulty level
   * @private
   */
  getDifficultyColor(difficulty) {
    const colors = {
      easy: 'green',
      medium: 'yellow',
      hard: 'red',
      expert: 'dark_red'
    };
    return colors[difficulty] || 'white';
  }

  /**
   * Export course as JSON
   */
  exportCourse(courseId = null) {
    const id = courseId || this.currentCourse?.id;
    if (!id) {
      throw new Error('No course specified and no active course');
    }

    const course = this.courses.get(id);
    if (!course) {
      throw new Error(`Course not found: ${id}`);
    }

    return JSON.stringify(course, null, 2);
  }

  /**
   * Calculate total par for current course
   */
  getTotalPar() {
    if (!this.currentCourse) {
      throw new Error('No active course');
    }
    return this.currentCourse.holes.reduce((sum, hole) => sum + hole.par, 0);
  }

  /**
   * Get course statistics
   */
  getCourseStats() {
    if (!this.currentCourse) {
      throw new Error('No active course');
    }

    const holes = this.currentCourse.holes;
    return {
      totalHoles: holes.length,
      totalPar: this.getTotalPar(),
      totalDistance: holes.reduce((sum, h) => sum + h.distance, 0),
      averageDistance: Math.round(holes.reduce((sum, h) => sum + h.distance, 0) / holes.length),
      difficultyBreakdown: {
        easy: holes.filter(h => h.difficulty === 'easy').length,
        medium: holes.filter(h => h.difficulty === 'medium').length,
        hard: holes.filter(h => h.difficulty === 'hard').length,
        expert: holes.filter(h => h.difficulty === 'expert').length
      }
    };
  }
}

// Export the default course for direct import
export { ACADEDA_PINES_COURSE };
