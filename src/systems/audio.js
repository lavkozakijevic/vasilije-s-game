export class AudioManager {
  play(key) { console.log('[Audio] play:', key); }
  stop(key)  { console.log('[Audio] stop:', key); }
}

export const audioManager = new AudioManager();
