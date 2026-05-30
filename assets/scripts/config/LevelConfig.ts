import { EnemyConfig, LevelConfig, TowerConfig } from './GameTypes';

export const TOWER_CONFIGS: Record<string, TowerConfig> = {
  arrow: {
    id: 'arrow',
    name: 'Bottle',
    color: '#54d738',
    levels: [
      { cost: 100, range: 100, damage: 70, attackInterval: 0.5, projectileSpeed: 520 },
      { cost: 180, range: 120, damage: 80, attackInterval: 0.35, projectileSpeed: 560 },
      { cost: 260, range: 150, damage: 90, attackInterval: 0.25, projectileSpeed: 600 },
    ],
  },
  cannon: {
    id: 'cannon',
    name: 'Shit',
    color: '#c99a2e',
    levels: [
      { cost: 120, range: 80, damage: 10, attackInterval: 1.5, projectileSpeed: 300, slowFactor: 0.6, slowDuration: 4 },
      { cost: 220, range: 100, damage: 30, attackInterval: 1.2, projectileSpeed: 320, slowFactor: 0.45, slowDuration: 5 },
      { cost: 260, range: 120, damage: 50, attackInterval: 1, projectileSpeed: 340, slowFactor: 0.3, slowDuration: 6 },
    ],
  },
  frost: {
    id: 'frost',
    name: 'Fan',
    color: '#43b6e6',
    levels: [
      { cost: 160, range: 240, damage: 80, attackInterval: 1.5, projectileSpeed: 460 },
      { cost: 220, range: 120, damage: 130, attackInterval: 1.2, projectileSpeed: 500 },
      { cost: 260, range: 150, damage: 200, attackInterval: 1, projectileSpeed: 540 },
    ],
  },
};

export const ENEMY_CONFIGS: Record<string, EnemyConfig> = {
  raider: {
    id: 'raider',
    name: 'Raider',
    maxHp: 120,
    speed: 120,
    reward: 14,
    damageToVillage: 1,
    color: '#d66a5f',
    size: 18,
  },
  boar: {
    id: 'boar',
    name: 'Boar',
    maxHp: 230,
    speed: 100,
    reward: 22,
    damageToVillage: 1,
    color: '#92643b',
    size: 22,
  },
  chief: {
    id: 'chief',
    name: 'Chief',
    maxHp: 420,
    speed: 60,
    reward: 40,
    damageToVillage: 2,
    color: '#7d3f60',
    size: 26,
  },
};

export const LEVEL_001: LevelConfig = {
  id: 'level-001',
  name: 'Theme 1 - Level 1',
  gridWidth: 12,
  gridHeight: 8,
  cellSize: 80,
  startGold: 450,
  startLives: 10,
  interWaveDelay: 3.2,
  path: [
    { x: 120, y: 475 },
    { x: 120, y: 235 },
    { x: 360, y: 235 },
    { x: 360, y: 315 },
    { x: 600, y: 315 },
    { x: 600, y: 235 },
    { x: 840, y: 235 },
    { x: 840, y: 475 },
  ],
  buildSpots: [
    { x: 200, y: 440 },
    { x: 280, y: 280 },
    { x: 280, y: 120 },
    { x: 440, y: 520 },
    { x: 440, y: 360 },
    { x: 520, y: 120 },
    { x: 680, y: 440 },
    { x: 680, y: 280 },
    { x: 760, y: 120 },
    { x: 920, y: 360 },
  ],
  waves: [
    {
      label: 'Wave 01',
      groups: [
        { enemyId: 'raider', count: 6, interval: 0.8, delayBefore: 1.0 },
        { enemyId: 'boar', count: 2, interval: 1.2, delayBefore: 1.4 },
      ],
    },
    {
      label: 'Wave 02',
      groups: [
        { enemyId: 'raider', count: 8, interval: 0.65, delayBefore: 1.0 },
        { enemyId: 'boar', count: 4, interval: 1.0, delayBefore: 1.6 },
      ],
    },
    {
      label: 'Wave 03',
      groups: [
        { enemyId: 'raider', count: 4, interval: 0.6, delayBefore: 1.0 },
        { enemyId: 'boar', count: 5, interval: 0.9, delayBefore: 1.3 },
        { enemyId: 'chief', count: 1, interval: 1.0, delayBefore: 2.0 },
      ],
    },
    { label: 'Wave 04', groups: [{ enemyId: 'raider', count: 10, interval: 0.62, delayBefore: 1.0 }] },
    { label: 'Wave 05', groups: [{ enemyId: 'boar', count: 6, interval: 0.85, delayBefore: 1.0 }] },
    { label: 'Wave 06', groups: [{ enemyId: 'raider', count: 8, interval: 0.55, delayBefore: 1.0 }, { enemyId: 'boar', count: 4, interval: 0.9, delayBefore: 1.2 }] },
    { label: 'Wave 07', groups: [{ enemyId: 'raider', count: 12, interval: 0.48, delayBefore: 1.0 }] },
    { label: 'Wave 08', groups: [{ enemyId: 'boar', count: 8, interval: 0.74, delayBefore: 1.0 }] },
    { label: 'Wave 09', groups: [{ enemyId: 'raider', count: 10, interval: 0.45, delayBefore: 1.0 }, { enemyId: 'boar', count: 6, interval: 0.75, delayBefore: 1.2 }] },
    { label: 'Wave 10', groups: [{ enemyId: 'chief', count: 1, interval: 1.0, delayBefore: 1.0 }, { enemyId: 'raider', count: 8, interval: 0.48, delayBefore: 1.4 }] },
    { label: 'Wave 11', groups: [{ enemyId: 'boar', count: 10, interval: 0.64, delayBefore: 1.0 }] },
    { label: 'Wave 12', groups: [{ enemyId: 'raider', count: 14, interval: 0.4, delayBefore: 1.0 }] },
    { label: 'Wave 13', groups: [{ enemyId: 'boar', count: 8, interval: 0.58, delayBefore: 1.0 }, { enemyId: 'chief', count: 1, interval: 1.0, delayBefore: 1.6 }] },
    { label: 'Wave 14', groups: [{ enemyId: 'raider', count: 10, interval: 0.35, delayBefore: 1.0 }, { enemyId: 'boar', count: 8, interval: 0.55, delayBefore: 1.0 }] },
    { label: 'Wave 15', groups: [{ enemyId: 'chief', count: 2, interval: 1.5, delayBefore: 1.0 }, { enemyId: 'raider', count: 12, interval: 0.32, delayBefore: 1.2 }] },
  ],
};
