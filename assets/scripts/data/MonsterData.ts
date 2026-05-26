export enum MonsterType {
    Wolf = 0,
    Boar = 1,
    Goblin = 2,
    Slime = 3,
    BossBear = 4,
}

export interface MonsterProperty {
    id: MonsterType;
    name: string;
    maxHp: number;
    speed: number;
    reward: number;
    spriteFrame: string;
}

export const MonsterData: Record<MonsterType, MonsterProperty> = {
    [MonsterType.Wolf]: {
        id: MonsterType.Wolf,
        name: '狼',
        maxHp: 50,
        speed: 50,
        reward: 10,
        spriteFrame: '',
    },
    [MonsterType.Boar]: {
        id: MonsterType.Boar,
        name: '野猪',
        maxHp: 100,
        speed: 35,
        reward: 20,
        spriteFrame: '',
    },
    [MonsterType.Goblin]: {
        id: MonsterType.Goblin,
        name: '哥布林',
        maxHp: 40,
        speed: 60,
        reward: 15,
        spriteFrame: '',
    },
    [MonsterType.Slime]: {
        id: MonsterType.Slime,
        name: '史莱姆',
        maxHp: 30,
        speed: 45,
        reward: 8,
        spriteFrame: '',
    },
    [MonsterType.BossBear]: {
        id: MonsterType.BossBear,
        name: '大熊Boss',
        maxHp: 500,
        speed: 25,
        reward: 100,
        spriteFrame: '',
    },
};
