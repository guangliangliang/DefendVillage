import { _decorator, Component, Node, Vec3, Vec2, instantiate, Prefab, find, UITransform, Graphics, Color } from 'cc';
import { TowerType, TowerData, TowerProperty } from '../data/TowerData';
import { GameManager } from '../core/GameManager';
import { Monster } from './Monster';

const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component {
    @property({ type: Enum(TowerType) })
    towerType: TowerType = TowerType.Scarecrow;

    @property
    currentLevel: number = 1;

    @property(Prefab)
    bulletPrefab: Prefab | null = null;

    @property(Node)
    rangeIndicator: Node | null = null;

    attackTimer: number = 0;
    currentTarget: Monster | null = null;
    property: TowerProperty | null = null;
    monsterLayer: Node | null = null;

    onLoad() {
        this.property = TowerData[this.towerType];
        this.monsterLayer = find('GameLayer/MonsterLayer');
        this.updateRangeIndicator();
    }

    start() {
        
    }

    update(dt: number) {
        if (GameManager.instance.isPaused) return;
        
        this.updateTarget();
        if (this.currentTarget) {
            this.attackTimer += dt * GameManager.instance.gameSpeed;
            if (this.attackTimer >= this.getAttackInterval()) {
                this.attack();
                this.attackTimer = 0;
            }
        }
    }

    updateTarget() {
        const monsters = this.getAllMonstersInRange();
        if (monsters.length > 0) {
            this.currentTarget = monsters[0];
        } else {
            this.currentTarget = null;
        }
    }

    getAllMonstersInRange(): Monster[] {
        const result: Monster[] = [];
        if (!this.monsterLayer) return result;
        
        const range = this.getRange();
        const towerPos = new Vec2(this.node.position.x, this.node.position.y);
        
        for (let i = 0; i < this.monsterLayer.children.length; i++) {
            const monsterNode = this.monsterLayer.children[i];
            const monster = monsterNode.getComponent(Monster);
            if (!monster) continue;
            
            const monsterPos = new Vec2(monsterNode.position.x, monsterNode.position.y);
            const distance = Vec2.distance(towerPos, monsterPos);
            
            if (distance <= range) {
                result.push(monster);
            }
        }
        
        return result;
    }

    getAttackInterval(): number {
        if (!this.property) return 1;
        const levelData = this.property.levels[this.currentLevel - 1];
        return levelData.attackSpeed;
    }

    getDamage(): number {
        if (!this.property) return 0;
        const levelData = this.property.levels[this.currentLevel - 1];
        return levelData.damage;
    }

    getRange(): number {
        if (!this.property) return 100;
        const levelData = this.property.levels[this.currentLevel - 1];
        return levelData.range;
    }

    attack() {
        if (!this.currentTarget) return;
        
        this.currentTarget.takeDamage(this.getDamage());
        
        if (this.bulletPrefab) {
            const bulletNode = instantiate(this.bulletPrefab);
            bulletNode.setPosition(this.node.position);
            this.node.parent?.addChild(bulletNode);
        }
    }

    upgrade(): boolean {
        if (!this.property) return false;
        if (this.currentLevel >= this.property.levels.length) return false;
        
        const nextLevelData = this.property.levels[this.currentLevel];
        if (!GameManager.instance.canAfford(nextLevelData.price)) return false;
        
        GameManager.instance.addGold(-nextLevelData.price);
        this.currentLevel++;
        this.updateRangeIndicator();
        console.log('Tower upgraded to level', this.currentLevel);
        return true;
    }

    sell() {
        if (!this.property) return;
        const levelData = this.property.levels[this.currentLevel - 1];
        const sellPrice = Math.floor(levelData.price * 0.6);
        GameManager.instance.addGold(sellPrice);
        console.log('Tower sold for', sellPrice);
        this.node.destroy();
    }

    getUpgradePrice(): number {
        if (!this.property) return 0;
        if (this.currentLevel >= this.property.levels.length) return 0;
        return this.property.levels[this.currentLevel].price;
    }

    getSellPrice(): number {
        if (!this.property) return 0;
        const levelData = this.property.levels[this.currentLevel - 1];
        return Math.floor(levelData.price * 0.6);
    }

    showRange(show: boolean) {
        if (this.rangeIndicator) {
            this.rangeIndicator.active = show;
        }
    }

    updateRangeIndicator() {
        if (!this.rangeIndicator) return;
        
        const graphics = this.rangeIndicator.getComponent(Graphics);
        if (!graphics) return;
        
        graphics.clear();
        graphics.circle(0, 0, this.getRange());
        graphics.strokeColor = new Color(100, 200, 255, 100);
        graphics.lineWidth = 2;
        graphics.stroke();
    }
}
