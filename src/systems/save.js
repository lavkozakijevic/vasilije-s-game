export class SaveSystem {
  constructor() {
    this.KEY = 'elemental-heroes-save';
  }

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return { bestTime: null, heroUnlocks: ['fire', 'water', 'earth', 'stone', 'poison', 'rubber'] };
      return JSON.parse(raw);
    } catch (e) {
      return { bestTime: null, heroUnlocks: ['fire', 'water', 'earth', 'stone', 'poison', 'rubber'] };
    }
  }

  saveTime(seconds) {
    const data = this.load();
    if (data.bestTime === null || seconds < data.bestTime) {
      data.bestTime = seconds;
      localStorage.setItem(this.KEY, JSON.stringify(data));
    }
  }
}

export const saveSystem = new SaveSystem();
