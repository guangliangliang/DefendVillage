export class BattleState {
  gold = 0;
  lives = 0;
  currentWave = 0;
  totalWaves = 0;
  isVictory = false;
  isDefeat = false;

  constructor(startGold: number, startLives: number, totalWaves: number) {
    this.gold = startGold;
    this.lives = startLives;
    this.totalWaves = totalWaves;
  }

  canAfford(cost: number): boolean {
    return this.gold >= cost;
  }

  spend(cost: number): boolean {
    if (!this.canAfford(cost)) {
      return false;
    }

    this.gold -= cost;
    return true;
  }

  earn(amount: number): void {
    this.gold += amount;
  }

  loseLives(amount: number): void {
    this.lives = Math.max(0, this.lives - amount);
    if (this.lives <= 0) {
      this.isDefeat = true;
    }
  }

  setWave(index: number): void {
    this.currentWave = index;
  }

  markVictory(): void {
    this.isVictory = true;
  }
}
