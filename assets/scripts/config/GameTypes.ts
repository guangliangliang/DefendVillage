export type TowerId = 'arrow' | 'cannon' | 'frost';
export type EnemyId = 'raider' | 'boar' | 'chief';
export type BuildAction = TowerId | 'sell';

export interface GridPoint {
  x: number;
  y: number;
}

export interface EnemyConfig {
  id: EnemyId;
  name: string;
  maxHp: number;
  speed: number;
  reward: number;
  damageToVillage: number;
  color: string;
  size: number;
}

export interface TowerLevelStats {
  cost: number;
  range: number;
  damage: number;
  attackInterval: number;
  projectileSpeed: number;
  splashRadius?: number;
  slowFactor?: number;
  slowDuration?: number;
}

export interface TowerConfig {
  id: TowerId;
  name: string;
  color: string;
  levels: TowerLevelStats[];
}

export interface WaveGroup {
  enemyId: EnemyId;
  count: number;
  interval: number;
  delayBefore?: number;
}

export interface WaveConfig {
  label: string;
  groups: WaveGroup[];
}

export interface LevelConfig {
  id: string;
  name: string;
  gridWidth: number;
  gridHeight: number;
  cellSize: number;
  startGold: number;
  startLives: number;
  interWaveDelay: number;
  path: GridPoint[];
  buildSpots: GridPoint[];
  waves: WaveConfig[];
}
