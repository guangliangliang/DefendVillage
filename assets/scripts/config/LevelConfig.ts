import { EnemyConfig, LevelConfig, TowerConfig } from './GameTypes';

export const TOWER_CONFIGS: Record<string, TowerConfig> = {
  arrow: {
    id: 'arrow',
    name: 'Arrow Tower',
    color: '#c48b44',
    levels: [
      { cost: 100, range: 118, damage: 28, attackInterval: 0.8, projectileSpeed: 420 },
      { cost: 140, range: 132, damage: 42, attackInterval: 0.72, projectileSpeed: 450 },
      { cost: 200, range: 150, damage: 60, attackInterval: 0.62, projectileSpeed: 480 },
    ],
  },
  cannon: {
    id: 'cannon',
    name: 'Stone Thrower',
    color: '#8d5f40',
    levels: [
      { cost: 130, range: 105, damage: 56, attackInterval: 1.35, projectileSpeed: 300, splashRadius: 54 },
      { cost: 180, range: 115, damage: 82, attackInterval: 1.22, projectileSpeed: 320, splashRadius: 60 },
      { cost: 240, range: 128, damage: 118, attackInterval: 1.1, projectileSpeed: 340, splashRadius: 68 },
    ],
  },
  frost: {
    id: 'frost',
    name: 'Frost Well',
    color: '#5ba6c8',
    levels: [
      { cost: 120, range: 108, damage: 18, attackInterval: 1.1, projectileSpeed: 360, slowFactor: 0.65, slowDuration: 1.6 },
      { cost: 160, range: 122, damage: 28, attackInterval: 1.0, projectileSpeed: 380, slowFactor: 0.55, slowDuration: 2.1 },
      { cost: 220, range: 135, damage: 38, attackInterval: 0.92, projectileSpeed: 400, slowFactor: 0.45, slowDuration: 2.6 },
    ],
  },
};

export const ENEMY_CONFIGS: Record<string, EnemyConfig> = {
  raider: {
    id: 'raider',
    name: 'Raider',
    maxHp: 120,
    speed: 76,
    reward: 14,
    damageToVillage: 1,
    color: '#d66a5f',
    size: 18,
  },
  boar: {
    id: 'boar',
    name: 'Boar',
    maxHp: 230,
    speed: 58,
    reward: 22,
    damageToVillage: 1,
    color: '#92643b',
    size: 22,
  },
  chief: {
    id: 'chief',
    name: 'Chief',
    maxHp: 420,
    speed: 52,
    reward: 40,
    damageToVillage: 2,
    color: '#7d3f60',
    size: 26,
  },
};

export const LEVEL_001: LevelConfig = {
  id: 'level-001',
  name: 'Village Gate',
  gridWidth: 12,
  gridHeight: 8,
  cellSize: 72,
  startGold: 260,
  startLives: 10,
  interWaveDelay: 3.5,
  path: [
    { x: 0, y: 3 },
    { x: 1, y: 3 },
    { x: 1, y: 1 },
    { x: 4, y: 1 },
    { x: 4, y: 5 },
    { x: 7, y: 5 },
    { x: 7, y: 2 },
    { x: 10, y: 2 },
    { x: 10, y: 6 },
    { x: 11, y: 6 },
  ],
  buildSpots: [
    { x: 2, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 6 },
    { x: 5, y: 2 },
    { x: 5, y: 4 },
    { x: 6, y: 6 },
    { x: 8, y: 3 },
    { x: 8, y: 5 },
    { x: 9, y: 1 },
    { x: 9, y: 4 },
  ],
  waves: [
    {
      label: 'Scout Raid',
      groups: [
        { enemyId: 'raider', count: 6, interval: 0.8, delayBefore: 1.0 },
        { enemyId: 'boar', count: 2, interval: 1.2, delayBefore: 1.4 },
      ],
    },
    {
      label: 'Dust Trail',
      groups: [
        { enemyId: 'raider', count: 8, interval: 0.65, delayBefore: 1.0 },
        { enemyId: 'boar', count: 4, interval: 1.0, delayBefore: 1.6 },
      ],
    },
    {
      label: 'Chief Approaches',
      groups: [
        { enemyId: 'raider', count: 4, interval: 0.6, delayBefore: 1.0 },
        { enemyId: 'boar', count: 5, interval: 0.9, delayBefore: 1.3 },
        { enemyId: 'chief', count: 1, interval: 1.0, delayBefore: 2.0 },
      ],
    },
  ],
};
