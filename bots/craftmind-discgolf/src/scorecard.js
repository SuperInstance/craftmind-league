/**
 * Scorecard System - Track scores, par comparison, and leaderboards.
 *
 * Comprehensive scoring system for disc golf with support for
 * multiple players, rounds, courses, and handicap calculation.
 */

/**
 * @typedef {Object} HoleScore
 * @property {number} hole - Hole number
 * @property {number} strokes - Number of strokes
 * @property {number} par - Par value
 * @property {number} scoreToPar - Score relative to par (negative is good)
 * @property {string} label - Score label ('Ace','Birdie','Par','Bogey', etc.)
 * @property {number} distance - Throw distance (optional)
 * @property {boolean} inBasket - Whether final throw was in basket
 */

/**
 * @typedef {Object} RoundScore
 * @property {string} id - Unique round identifier
 * @property {string} courseId - Course identifier
 * @property {string} courseName - Course name
 * @property {string} playerId - Player identifier
 * @property {string} playerName - Player name
 * @property {Date} date - Round date
 * @property {Array<HoleScore>} holes - Array of hole scores
 * @property {number} totalStrokes - Total strokes for round
 * @property {number} totalPar - Total par for course
 * @property {number} scoreToPar - Total score relative to par
 * @property {string} performanceLabel - Performance label
 * @property {number} handicap - Calculated handicap (optional)
 */

/**
 * Scorecard class for tracking disc golf scores
 */
export class Scorecard {
  constructor() {
    this.currentRounds = new Map(); // Active rounds
    this.completedRounds = []; // Completed rounds
    this.courseRecords = new Map(); // Best rounds per course
    this.playerStats = new Map(); // Player statistics
  }

  /**
   * Create a new round scorecard
   * @param {Object} options - Round creation options
   * @returns {string} Round ID
   */
  createRound(options) {
    const {
      courseId = 'default',
      courseName = 'Unknown Course',
      playerId = 'player1',
      playerName = 'Player',
      holes = 9,
      parPerHole = 3
    } = options;

    const roundId = `${courseId}-${playerId}-${Date.now()}`;

    // Initialize hole scores
    const holeScores = [];
    for (let i = 1; i <= holes; i++) {
      holeScores.push({
        hole: i,
        strokes: 0,
        par: parPerHole,
        scoreToPar: 0,
        label: '-',
        distance: 0,
        inBasket: false
      });
    }

    const round = {
      id: roundId,
      courseId,
      courseName,
      playerId,
      playerName,
      date: new Date(),
      holes: holeScores,
      totalStrokes: 0,
      totalPar: holes * parPerHole,
      scoreToPar: 0,
      performanceLabel: 'In Progress',
      handicap: 0
    };

    this.currentRounds.set(roundId, round);
    return roundId;
  }

  /**
   * Record strokes for a hole
   * @param {string} roundId - Round identifier
   * @param {number} holeNumber - Hole number
   * @param {number} strokes - Number of strokes
   * @param {Object} details - Additional details
   */
  recordThrow(roundId, holeNumber, strokes, details = {}) {
    const round = this.currentRounds.get(roundId);
    if (!round) {
      throw new Error(`Round not found: ${roundId}`);
    }

    const holeIndex = holeNumber - 1;
    if (holeIndex < 0 || holeIndex >= round.holes.length) {
      throw new Error(`Invalid hole number: ${holeNumber}`);
    }

    const hole = round.holes[holeIndex];
    hole.strokes = strokes;
    hole.distance = details.distance || 0;
    hole.inBasket = details.inBasket || false;

    // Calculate score to par
    hole.scoreToPar = strokes - hole.par;

    // Set label
    hole.label = this.getScoreLabel(hole.scoreToPar, hole.inBasket);

    // Update round totals
    this.updateRoundTotals(round);

    return hole;
  }

  /**
   * Get score label for score to par
   * @private
   */
  getScoreLabel(scoreToPar, inBasket) {
    if (inBasket && scoreToPar === 1) return 'Ace';
    if (scoreToPar === -2) return 'Eagle';
    if (scoreToPar === -1) return 'Birdie';
    if (scoreToPar === 0) return 'Par';
    if (scoreToPar === 1) return 'Bogey';
    if (scoreToPar === 2) return 'Double Bogey';
    if (scoreToPar === 3) return 'Triple Bogey';
    if (scoreToPar > 3) return `+${scoreToPar}`;
    return `-${Math.abs(scoreToPar)}`; // Rare scores like albatross (-3)
  }

  /**
   * Update round totals after hole score change
   * @private
   */
  updateRoundTotals(round) {
    round.totalStrokes = round.holes.reduce((sum, hole) => sum + hole.strokes, 0);
    round.totalPar = round.holes.reduce((sum, hole) => sum + hole.par, 0);
    round.scoreToPar = round.totalStrokes - round.totalPar;
    round.performanceLabel = this.getPerformanceLabel(round.scoreToPar);
  }

  /**
   * Get performance label for total score to par
   * @private
   */
  getPerformanceLabel(scoreToPar) {
    if (scoreToPar <= -5) return 'Excellent';
    if (scoreToPar <= -2) return 'Great';
    if (scoreToPar === -1) return 'Good';
    if (scoreToPar === 0) return 'Even';
    if (scoreToPar === 1) return 'Over Par';
    if (scoreToPar <= 3) return 'Needs Work';
    return 'Keep Practicing';
  }

  /**
   * Get current score for a round
   * @param {string} roundId - Round identifier
   */
  getScore(roundId) {
    const round = this.currentRounds.get(roundId);
    if (!round) {
      throw new Error(`Round not found: ${roundId}`);
    }

    return {
      roundId: round.id,
      playerName: round.playerName,
      courseName: round.courseName,
      date: round.date,
      holes: round.holes.map(hole => ({
        hole: hole.hole,
        par: hole.par,
        strokes: hole.strokes,
        scoreToPar: hole.scoreToPar,
        label: hole.label
      })),
      totalStrokes: round.totalStrokes,
      totalPar: round.totalPar,
      scoreToPar: round.scoreToPar,
      performanceLabel: round.performanceLabel,
      isComplete: round.holes.every(hole => hole.strokes > 0)
    };
  }

  /**
   * Complete a round and move to completed rounds
   * @param {string} roundId - Round identifier
   */
  completeRound(roundId) {
    const round = this.currentRounds.get(roundId);
    if (!round) {
      throw new Error(`Round not found: ${roundId}`);
    }

    // Verify all holes are played
    const incompleteHoles = round.holes.filter(hole => hole.strokes === 0);
    if (incompleteHoles.length > 0) {
      throw new Error(`Cannot complete round: ${incompleteHoles.length} holes not played`);
    }

    // Calculate handicap
    round.handicap = this.calculateHandicap(round);

    // Move to completed rounds
    this.currentRounds.delete(roundId);
    this.completedRounds.push(round);

    // Update course records
    this.updateCourseRecord(round);

    // Update player stats
    this.updatePlayerStats(round);

    return this.getScore(roundId);
  }

  /**
   * Calculate handicap for a round (simplified system)
   * @private
   */
  calculateHandicap(round) {
    // Simple handicap: (scoreToPar * 0.9) / number of holes
    // This is a simplified version - real disc golf handicaps are more complex
    const avgScoreToPar = round.scoreToPar / round.holes.length;
    return Math.round(avgScoreToPar * 10) / 10; // Round to 1 decimal
  }

  /**
   * Update course records
   * @private
   */
  updateCourseRecord(round) {
    const courseId = round.courseId;

    if (!this.courseRecords.has(courseId)) {
      this.courseRecords.set(courseId, {
        courseId,
        courseName: round.courseName,
        bestScore: null,
        bestScoreToPar: Infinity,
        bestRounds: []
      });
    }

    const record = this.courseRecords.get(courseId);

    // Update best score if this round is better
    if (round.scoreToPar < record.bestScoreToPar) {
      record.bestScoreToPar = round.scoreToPar;
      record.bestScore = {
        roundId: round.id,
        playerName: round.playerName,
        scoreToPar: round.scoreToPar,
        totalStrokes: round.totalStrokes,
        date: round.date
      };
    }

    // Add to best rounds list (keep top 5)
    record.bestRounds.push({
      roundId: round.id,
      playerName: round.playerName,
      scoreToPar: round.scoreToPar,
      totalStrokes: round.totalStrokes,
      date: round.date
    });

    record.bestRounds.sort((a, b) => a.scoreToPar - b.scoreToPar);
    record.bestRounds = record.bestRounds.slice(0, 5);
  }

  /**
   * Update player statistics
   * @private
   */
  updatePlayerStats(round) {
    const playerId = round.playerId;

    if (!this.playerStats.has(playerId)) {
      this.playerStats.set(playerId, {
        playerId,
        playerName: round.playerName,
        roundsPlayed: 0,
        totalStrokes: 0,
        totalPar: 0,
        bestScoreToPar: Infinity,
        averageScoreToPar: 0,
        bestRound: null,
        aces: 0,
        birdies: 0,
        pars: 0,
        bogeys: 0
      });
    }

    const stats = this.playerStats.get(playerId);

    // Update totals
    stats.roundsPlayed++;
    stats.totalStrokes += round.totalStrokes;
    stats.totalPar += round.totalPar;

    // Update best score
    if (round.scoreToPar < stats.bestScoreToPar) {
      stats.bestScoreToPar = round.scoreToPar;
      stats.bestRound = {
        roundId: round.id,
        courseName: round.courseName,
        scoreToPar: round.scoreToPar,
        totalStrokes: round.totalStrokes,
        date: round.date
      };
    }

    // Update average
    stats.averageScoreToPar = (stats.totalStrokes - stats.totalPar) / stats.roundsPlayed;

    // Count hole scores
    for (const hole of round.holes) {
      if (hole.label === 'Ace') stats.aces++;
      else if (hole.label === 'Birdie') stats.birdies++;
      else if (hole.label === 'Par') stats.pars++;
      else if (hole.label === 'Bogey') stats.bogeys++;
    }
  }

  /**
   * Get leaderboard for a course
   * @param {string} courseId - Course identifier
   */
  getLeaderboard(courseId) {
    const rounds = this.completedRounds.filter(r => r.courseId === courseId);

    if (rounds.length === 0) {
      return {
        courseId,
        courseName: rounds[0]?.courseName || 'Unknown',
        entries: []
      };
    }

    // Sort by score to par (lower is better)
    const sorted = rounds.sort((a, b) => a.scoreToPar - b.scoreToPar);

    // Create leaderboard entries
    const entries = sorted.map((round, index) => ({
      position: index + 1,
      playerName: round.playerName,
      scoreToPar: round.scoreToPar,
      totalStrokes: round.totalStrokes,
      totalPar: round.totalPar,
      date: round.date
    }));

    return {
      courseId,
      courseName: sorted[0].courseName,
      entries: entries.slice(0, 10) // Top 10
    };
  }

  /**
   * Get course records
   * @param {string} courseId - Course identifier
   */
  getCourseRecord(courseId) {
    return this.courseRecords.get(courseId);
  }

  /**
   * Get all course records
   */
  getAllCourseRecords() {
    return Array.from(this.courseRecords.values());
  }

  /**
   * Get player statistics
   * @param {string} playerId - Player identifier
   */
  getPlayerStats(playerId) {
    return this.playerStats.get(playerId);
  }

  /**
   * Get all player statistics
   */
  getAllPlayerStats() {
    return Array.from(this.playerStats.values()).sort((a, b) =>
      a.averageScoreToPar - b.averageScoreToPar
    );
  }

  /**
   * Get round summary
   * @param {string} roundId - Round identifier
   */
  getRoundSummary(roundId) {
    // Check current rounds
    let round = this.currentRounds.get(roundId);

    // Check completed rounds
    if (!round) {
      round = this.completedRounds.find(r => r.id === roundId);
    }

    if (!round) {
      throw new Error(`Round not found: ${roundId}`);
    }

    return {
      roundId: round.id,
      playerName: round.playerName,
      courseName: round.courseName,
      date: round.date,
      holes: round.holes.map(hole => ({
        hole: hole.hole,
        par: hole.par,
        strokes: hole.strokes,
        scoreToPar: hole.scoreToPar,
        label: hole.label
      })),
      front9: this.getNineSummary(round.holes.slice(0, 9)),
      back9: this.getNineSummary(round.holes.slice(9, 18)),
      totalStrokes: round.totalStrokes,
      totalPar: round.totalPar,
      scoreToPar: round.scoreToPar,
      performanceLabel: round.performanceLabel,
      isComplete: round.holes.every(hole => hole.strokes > 0)
    };
  }

  /**
   * Get summary for 9 holes
   * @private
   */
  getNineSummary(holes) {
    if (holes.length === 0) return null;

    const strokes = holes.reduce((sum, hole) => sum + hole.strokes, 0);
    const par = holes.reduce((sum, hole) => sum + hole.par, 0);

    return {
      strokes,
      par,
      scoreToPar: strokes - par
    };
  }

  /**
   * Get global leaderboard across all courses
   */
  getGlobalLeaderboard() {
    const playerAggregates = new Map();

    // Aggregate scores by player
    for (const round of this.completedRounds) {
      if (!playerAggregates.has(round.playerId)) {
        playerAggregates.set(round.playerId, {
          playerId: round.playerId,
          playerName: round.playerName,
          roundsPlayed: 0,
          totalScoreToPar: 0,
          bestScoreToPar: Infinity,
          bestRound: null
        });
      }

      const aggregate = playerAggregates.get(round.playerId);
      aggregate.roundsPlayed++;
      aggregate.totalScoreToPar += round.scoreToPar;

      if (round.scoreToPar < aggregate.bestScoreToPar) {
        aggregate.bestScoreToPar = round.scoreToPar;
        aggregate.bestRound = {
          courseName: round.courseName,
          scoreToPar: round.scoreToPar,
          date: round.date
        };
      }
    }

    // Calculate averages and sort
    const entries = Array.from(playerAggregates.values())
      .map(aggregate => ({
        ...aggregate,
        averageScoreToPar: aggregate.totalScoreToPar / aggregate.roundsPlayed
      }))
      .sort((a, b) => a.averageScoreToPar - b.averageScoreToPar)
      .slice(0, 20); // Top 20

    return {
      entries: entries.map((entry, index) => ({
        position: index + 1,
        playerName: entry.playerName,
        roundsPlayed: entry.roundsPlayed,
        averageScoreToPar: Math.round(entry.averageScoreToPar * 10) / 10,
        bestScoreToPar: entry.bestScoreToPar,
        bestRound: entry.bestRound
      }))
    };
  }

  /**
   * Delete a round (for testing or correction)
   * @param {string} roundId - Round identifier
   */
  deleteRound(roundId) {
    const currentRound = this.currentRounds.get(roundId);
    if (currentRound) {
      this.currentRounds.delete(roundId);
      return true;
    }

    const index = this.completedRounds.findIndex(r => r.id === roundId);
    if (index !== -1) {
      this.completedRounds.splice(index, 1);
      return true;
    }

    return false;
  }

  /**
   * Clear all data (for testing)
   */
  clearAll() {
    this.currentRounds.clear();
    this.completedRounds = [];
    this.courseRecords.clear();
    this.playerStats.clear();
  }

  /**
   * Export scorecard data as JSON
   */
  exportData() {
    return JSON.stringify({
      currentRounds: Array.from(this.currentRounds.values()),
      completedRounds: this.completedRounds,
      courseRecords: Array.from(this.courseRecords.values()),
      playerStats: Array.from(this.playerStats.values())
    }, null, 2);
  }

  /**
   * Import scorecard data from JSON
   */
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);

      this.currentRounds.clear();
      this.completedRounds = [];
      this.courseRecords.clear();
      this.playerStats.clear();

      for (const round of data.currentRounds) {
        this.currentRounds.set(round.id, round);
      }

      this.completedRounds = data.completedRounds || [];

      for (const record of data.courseRecords || []) {
        this.courseRecords.set(record.courseId, record);
      }

      for (const stats of data.playerStats || []) {
        this.playerStats.set(stats.playerId, stats);
      }

      return true;
    } catch (error) {
      console.error('Error importing scorecard data:', error);
      return false;
    }
  }
}

/**
 * Create a new scorecard instance
 * @returns {Scorecard} Scorecard instance
 */
export function createScorecard() {
  return new Scorecard();
}
