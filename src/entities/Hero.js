/**
 * Hero entity helpers.
 * All logic lives on Level1Scene as methods; these are thin wrappers
 * exported for future decoupling / testing.
 */

/**
 * Apply a hero type to the scene.
 * @param {Level1Scene} scene
 * @param {string} k - hero key
 */
export function applyHero(scene, k) {
  scene.applyHero(k);
}

/**
 * Swap the active hero.
 * @param {Level1Scene} scene
 * @param {string} k - hero key
 */
export function swap(scene, k) {
  scene.swap(k);
}

/**
 * Build the player sprite and physics body on the scene.
 * @param {Level1Scene} scene
 */
export function buildPlayer(scene) {
  scene.buildPlayer();
}
