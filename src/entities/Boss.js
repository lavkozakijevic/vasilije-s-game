/**
 * Boss entity helpers.
 * All logic lives on Level1Scene as methods; these are thin wrappers
 * exported for future decoupling / testing.
 */

/**
 * Build the boss sprite, physics, and HP bar on the scene.
 * @param {Level1Scene} scene
 */
export function buildBoss(scene) {
  scene.buildBoss();
}

/**
 * Tick boss AI for one frame.
 * @param {Level1Scene} scene
 * @param {number} time
 * @param {number} delta
 */
export function tickBoss(scene, time, delta) {
  scene.tickBoss(time, delta);
}

/**
 * Handle a player projectile hitting the boss.
 * @param {Level1Scene} scene
 * @param {Phaser.GameObjects.Arc} shot
 * @param {Phaser.GameObjects.Rectangle} b - boss body
 */
export function hitBoss(scene, shot, b) {
  scene.hitBoss(b);
}

/**
 * Apply damage to the boss.
 * @param {Level1Scene} scene
 */
export function damageBoss(scene) {
  scene.damageBoss();
}

/**
 * Trigger the boss defeat sequence.
 * @param {Level1Scene} scene
 */
export function defeatBoss(scene) {
  scene.defeatBoss();
}
