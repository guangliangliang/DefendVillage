import { Vec2 } from 'cc';
import { MonsterType } from './MonsterData';

export interface WaveMonster {
    type: MonsterType;
    count: number;
    interval: number;
}

export interface WaveData {
    delay: number;
    monsters: WaveMonster[];
}

export interface LevelData {
    id: number;
    name: string;
    startGold: number;
    villageHp: number;
    pathPoints: Vec2[];
    villagePos: Vec2;
    waves: WaveData[];
}

export const Levels: LevelData[] = [
    {
        id: 1,
        name: '第一关 - 村庄入口',
        startGold: 200,
        villageHp: 10,
        villagePos: new Vec2(400, 50),
        pathPoints: [
            new Vec2(-50, 320),
            new Vec2(200, 320),
            new Vec2(200, 200),
            new Vec2(400, 200),
            new Vec2(400, 50),
        ],
        waves: [
            {
                delay: 2,
                monsters: [
                    { type: MonsterType.Wolf, count: 5, interval: 1 }
                ]
            },
            {
                delay: 5,
                monsters: [
                    { type: MonsterType.Wolf, count: 8, interval: 0.8 }
                ]
            },
            {
                delay: 5,
                monsters: [
                    { type: MonsterType.Wolf, count: 5, interval: 1 },
                    { type: MonsterType.Slime, count: 5, interval: 0.8 }
                ]
            }
        ]
    },
    {
        id: 2,
        name: '第二关 - 森林小路',
        startGold: 250,
        villageHp: 10,
        villagePos: new Vec2(450, 100),
        pathPoints: [
            new Vec2(-50, 200),
            new Vec2(100, 200),
            new Vec2(100, 350),
            new Vec2(300, 350),
            new Vec2(300, 100),
            new Vec2(450, 100),
        ],
        waves: [
            {
                delay: 2,
                monsters: [
                    { type: MonsterType.Wolf, count: 6, interval: 1 },
                    { type: MonsterType.Goblin, count: 4, interval: 0.8 }
                ]
            },
            {
                delay: 6,
                monsters: [
                    { type: MonsterType.Boar, count: 3, interval: 1.5 }
                ]
            },
            {
                delay: 5,
                monsters: [
                    { type: MonsterType.Wolf, count: 10, interval: 0.6 }
                ]
            }
        ]
    }
];
