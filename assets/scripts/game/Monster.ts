import { _decorator, Component, Vec3, Vec2, tween, UIOpacity, Color, Sprite, Graphics } from 'cc';
import { MonsterType, MonsterData, MonsterProperty } from '../data/MonsterData';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends Component {
    @property({ type: Enum(MonsterType) })
    monsterType: MonsterType = MonsterType.Wolf;

    @property(Sprite)
    bodySprite: Sprite | null = null;

    @property(Graphics)
    hpBar: Graphics | null = null;

    currentHp: number = 0;
    maxHp: number = 0;
    pathIndex: number = 0;
    pathPoints: Vec2[] = [];
    moveSpeed: number = 0;
    baseSpeed: number = 0;
    reward: number = 0;
    slowTimer: number = 0;
    isSlowed: boolean = false;

    onLoad() {
        
    }

    init(pathPoints: Vec2[]) {
        const data = MonsterData[this.monsterType];
        this.maxHp = data.maxHp;
        this.currentHp = this.maxHp;
        this.baseSpeed = data.speed;
        this.moveSpeed = data.speed;
        this.reward = data.reward;
        this.pathPoints = pathPoints;
        this.pathIndex = 0;
        this.slowTimer = 0;
        this.isSlowed = false;
        
        if (this.pathPoints.length > 0) {
            this.node.setPosition(this.pathPoints[0].x, this.pathPoints[0].y, 0);
        }
        
        this.updateHpBar();
    }

    update(dt: number) {
        if (GameManager.instance.isPaused) return;
        
        if (this.isSlowed) {
            this.slowTimer -= dt;
            if (this.slowTimer <= 0) {
                this.isSlowed = false;
                this.moveSpeed = this.baseSpeed;
            }
        }
        
        this.moveAlongPath(dt * GameManager.instance.gameSpeed);
    }

    moveAlongPath(dt: number) {
        if (this.pathIndex >= this.pathPoints.length) {
            this.reachEnd();
            return;
        }

        const target = this.pathPoints[this.pathIndex];
        const current = new Vec2(this.node.position.x, this.node.position.y);
        const direction = new Vec2();
        Vec2.subtract(direction, target, current);
        
        const distance = direction.length();
        if (distance < 5) {
            this.pathIndex++;
            return;
        }

        direction.normalize();
        const moveDistance = this.moveSpeed * dt;
        current.x += direction.x * moveDistance;
        current.y += direction.y * moveDistance;
        this.node.setPosition(current.x, current.y, 0);
    }

    takeDamage(damage: number) {
        this.currentHp -= damage;
        console.log('Monster takes damage:', damage, 'HP:', this.currentHp);
        this.updateHpBar();
        
        if (this.currentHp <= 0) {
            this.die();
        }
    }

    applySlow(slowAmount: number, duration: number) {
        this.isSlowed = true;
        this.slowTimer = duration;
        this.moveSpeed = this.baseSpeed * (1 - slowAmount);
    }

    die() {
        GameManager.instance.addGold(this.reward);
        console.log('Monster died, reward:', this.reward);
        
        tween(this.node)
            .to(0.2, { scale: new Vec3(0.1, 0.1, 0.1) })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }

    reachEnd() {
        GameManager.instance.damageVillage(1);
        console.log('Monster reached the village!');
        this.node.destroy();
    }

    updateHpBar() {
        if (!this.hpBar) return;
        
        this.hpBar.clear();
        
        const barWidth = 40;
        const barHeight = 5;
        const hpPercent = this.currentHp / this.maxHp;
        
        this.hpBar.fillColor = new Color(80, 80, 80, 255);
        this.hpBar.rect(-barWidth / 2, 15, barWidth, barHeight);
        this.hpBar.fill();
        
        this.hpBar.fillColor = new Color(255, 80, 80, 255);
        this.hpBar.rect(-barWidth / 2, 15, barWidth * hpPercent, barHeight);
        this.hpBar.fill();
    }
}
