/**
 * Gate system helpers.
 * All logic lives on Level1Scene as methods; these are thin wrappers
 * exported for future decoupling / testing.
 */

/**
 * Build all gate barriers in the scene.
 * @param {Level1Scene} scene
 */
export function buildGates(scene) {
  scene.buildGates();
}

/**
 * Open a single gate (animate + remove collision).
 * @param {Level1Scene} scene
 * @param {object} gate
 */
export function openGate(scene, gate) {
  scene.openGate(gate);
}

/**
 * Check all gates for the current hero and open any that match.
 * @param {Level1Scene} scene
 */
export function checkGates(scene) {
  scene.checkGates();
}
