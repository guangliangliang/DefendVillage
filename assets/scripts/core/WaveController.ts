import { LevelConfig } from '../config/GameTypes';

export class WaveController {
  private level: LevelConfig;
  private waveIndex = -1;
  private groupIndex = -1;
  private enemiesRemainingInGroup = 0;
  private spawnTimer = 0;
  private nextWaveTimer = 1.5;
  private waveActive = false;
  private allWavesQueued = false;

  constructor(
    level: LevelConfig,
    private readonly onWaveStart: (waveNumber: number, label: string) => void,
    private readonly onSpawnEnemy: (enemyId: string) => void,
  ) {
    this.level = level;
  }

  get currentWaveNumber(): number {
    return Math.max(0, this.waveIndex + 1);
  }

  get isFinished(): boolean {
    return this.allWavesQueued && !this.waveActive;
  }

  update(dt: number): void {
    if (this.allWavesQueued && !this.waveActive) {
      return;
    }

    if (!this.waveActive) {
      this.nextWaveTimer -= dt;
      if (this.nextWaveTimer <= 0) {
        this.startNextWave();
      }
      return;
    }

    this.spawnTimer -= dt;
    if (this.spawnTimer > 0) {
      return;
    }

    if (this.enemiesRemainingInGroup > 0) {
      const group = this.level.waves[this.waveIndex].groups[this.groupIndex];
      this.onSpawnEnemy(group.enemyId);
      this.enemiesRemainingInGroup -= 1;
      this.spawnTimer = group.interval;
      return;
    }

    this.groupIndex += 1;
    const nextGroup = this.level.waves[this.waveIndex].groups[this.groupIndex];
    if (nextGroup) {
      this.enemiesRemainingInGroup = nextGroup.count;
      this.spawnTimer = nextGroup.delayBefore ?? 0;
      return;
    }

    this.waveActive = false;
    if (this.waveIndex >= this.level.waves.length - 1) {
      this.allWavesQueued = true;
    } else {
      this.nextWaveTimer = this.level.interWaveDelay;
    }
  }

  private startNextWave(): void {
    this.waveIndex += 1;
    const wave = this.level.waves[this.waveIndex];
    if (!wave) {
      this.allWavesQueued = true;
      return;
    }

    this.waveActive = true;
    this.groupIndex = -1;
    this.enemiesRemainingInGroup = 0;
    this.spawnTimer = 0;
    this.onWaveStart(this.waveIndex + 1, wave.label);
  }
}
