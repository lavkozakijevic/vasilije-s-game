/**
 * Enemy entity helpers.
 * All logic lives on Level1Scene as methods; these are thin wrappers
 * exported for future decoupling / testing.
 */

/**
 * Spawn an enemy in the scene.
 * @param {Level1Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} type - enemy element type key
 * @param {string} behavior - 'patrol' | 'chase'
 * @param {number} minX
 * @param {number} maxX
 */
export function addEnemy(scene, x, y, type, behavior, minX, maxX) {
  return scene.addEnemy(x, y, type, behavior, minX, maxX);
}

/**
 * Tick a single enemy's AI for one frame.
 * @param {Level1Scene} scene
 * @param {object} e - enemy object
 * @param {number} dt - delta seconds
 * @param {number} time - scene time
 */
export function tickEnemy(scene, e, dt, time) {
  scene.tickEnemy(e, dt, time);
}

/**
 * Handle a player shot colliding with an enemy.
 * @param {Level1Scene} scene
 * @param {Phaser.GameObjects.Arc} shot
 * @param {object} e
 */
export function hitEnemy(scene, shot, e) {
  scene.hitEnemy(shot, e);
}

/**
 * Resolve damage on an enemy against a kill list.
 * @param {Level1Scene} scene
 * @param {object} e
 * @param {string[]} killList
 */
export function resolveHit(scene, e, killList) {
  scene.resolveHit(e, killList);
}

/**
 * Kill an enemy immediately.
 * @param {Level1Scene} scene
 * @param {object} e
 */
export function killEnemy(scene, e) {
  scene.killEnemy(e);
}

/**
 * Return the counter hero name for a given enemy type.
 * @param {Level1Scene} scene
 * @param {string} type
 */
export function labelFor(scene, type) {
  return scene.labelFor(type);
}
