/**
 * HUD system helpers.
 * All logic lives on Level1Scene as methods; these are thin wrappers
 * exported for future decoupling / testing.
 */

/** @param {Level1Scene} scene */
export function buildHUD(scene)      { scene.buildHUD(); }

/** @param {Level1Scene} scene */
export function drawHearts(scene)    { scene.drawHearts(); }

/** @param {Level1Scene} scene */
export function refreshBar(scene)    { scene.refreshBar(); }

/** @param {Level1Scene} scene */
export function refreshDmg(scene)    { scene.refreshDmg(); }

/** @param {Level1Scene} scene */
export function refreshSaves(scene)  { scene.refreshSaves(); }

/** @param {Level1Scene} scene */
export function updateTimer(scene)   { scene.updateTimer(); }

/** @param {Level1Scene} scene */
export function updateHint(scene)    { scene.updateHint(0); }

/** @param {Level1Scene} scene */
export function buildMenu(scene)     { scene.buildMenu(); }

/** @param {Level1Scene} scene */
export function toggleMenu(scene)    { scene.toggleMenu(); }
