import { Vec2 } from 'cc';

export enum TowerType {
    Scarecrow = 0,
    Archer = 1,
    Catapult = 2,
    Farmer = 3,
    Windmill = 4,
    BellTower = 5,
}

export interface TowerLevel {
    price: number;
    damage: number;
    range: number;
    attackSpeed: number;
    spriteFrame: string;
}

export interface TowerProperty {
    id: TowerType;
    name: string;
    description: string;
    levels: TowerLevel[];
}

export const TowerData: Record<TowerType, TowerProperty> = {
    [TowerType.Scarecrow]: {
        id: TowerType.Scarecrow,
        name: '稻草人',
        description: '基础防御塔，攻击附近的敌人',
        levels: [
            { price: 50, damage: 10, range: 100, attackSpeed: 1.0, spriteFrame: '' },
            { price: 100, damage: 20, range: 120, attackSpeed: 1.0, spriteFrame: '' },
            { price: 180, damage: 35, range: 140, attackSpeed: 0.9, spriteFrame: '' },
        ]
    },
    [TowerType.Archer]: {
        id: TowerType.Archer,
        name: '弓箭手',
        description: '远程攻击，攻速快',
        levels: [
            { price: 80, damage: 15, range: 150, attackSpeed: 0.6, spriteFrame: '' },
            { price: 150, damage: 25, range: 170, attackSpeed: 0.55, spriteFrame: '' },
            { price: 250, damage: 40, range: 190, attackSpeed: 0.5, spriteFrame: '' },
        ]
    },
    [TowerType.Catapult]: {
        id: TowerType.Catapult,
        name: '投石车',
        description: '范围伤害，攻击多个敌人',
        levels: [
            { price: 120, damage: 25, range: 130, attackSpeed: 1.5, spriteFrame: '' },
            { price: 220, damage: 45, range: 150, attackSpeed: 1.4, spriteFrame: '' },
            { price: 350, damage: 70, range: 170, attackSpeed: 1.3, spriteFrame: '' },
        ]
    },
    [TowerType.Farmer]: {
        id: TowerType.Farmer,
        name: '农夫',
        description: '减速敌人，控制型防御塔',
        levels: [
            { price: 100, damage: 8, range: 110, attackSpeed: 1.2, spriteFrame: '' },
            { price: 180, damage: 12, range: 130, attackSpeed: 1.1, spriteFrame: '' },
            { price: 280, damage: 18, range: 150, attackSpeed: 1.0, spriteFrame: '' },
        ]
    },
    [TowerType.Windmill]: {
        id: TowerType.Windmill,
        name: '风车',
        description: '持续范围伤害',
        levels: [
            { price: 150, damage: 5, range: 100, attackSpeed: 0.3, spriteFrame: '' },
            { price: 260, damage: 8, range: 120, attackSpeed: 0.28, spriteFrame: '' },
            { price: 400, damage: 12, range: 140, attackSpeed: 0.25, spriteFrame: '' },
        ]
    },
    [TowerType.BellTower]: {
        id: TowerType.BellTower,
        name: '钟楼',
        description: '增益周围防御塔',
        levels: [
            { price: 200, damage: 0, range: 150, attackSpeed: 2.0, spriteFrame: '' },
            { price: 350, damage: 0, range: 180, attackSpeed: 1.8, spriteFrame: '' },
            { price: 500, damage: 0, range: 210, attackSpeed: 1.5, spriteFrame: '' },
        ]
    },
};
