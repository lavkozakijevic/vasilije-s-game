export class SaveSystem {
  constructor() {
    this.KEY = 'elemental-heroes-save';
  }

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return { bestTime: null, furthestCheckpoint: 0, heroUnlocks: ['fire', 'water', 'earth', 'stone', 'poison', 'rubber'] };
      return JSON.parse(raw);
    } catch (e) {
      return { bestTime: null, furthestCheckpoint: 0, heroUnlocks: ['fire', 'water', 'earth', 'stone', 'poison', 'rubber'] };
    }
  }

  saveCheckpoint(index) {
    const data = this.load();
    if (index > (data.furthestCheckpoint || 0)) {
      data.furthestCheckpoint = index;
      localStorage.setItem(this.KEY, JSON.stringify(data));
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
