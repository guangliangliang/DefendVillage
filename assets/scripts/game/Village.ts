import { _decorator, Component, Node, Graphics, Color } from 'cc';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('Village')
export class Village extends Component {
    @property(Graphics)
    hpBar: Graphics | null = null;

    @property
    maxHp: number = 10;

    currentHp: number = 0;

    start() {
        this.currentHp = this.maxHp;
        this.updateHpBar();
    }

    takeDamage(damage: number) {
        this.currentHp -= damage;
        if (this.currentHp < 0) this.currentHp = 0;
        this.updateHpBar();
        
        if (this.currentHp <= 0) {
            this.onDestroyed();
        }
    }

    heal(amount: number) {
        this.currentHp += amount;
        if (this.currentHp > this.maxHp) this.currentHp = this.maxHp;
        this.updateHpBar();
    }

    updateHpBar() {
        if (!this.hpBar) return;
        
        this.hpBar.clear();
        
        const barWidth = 80;
        const barHeight = 10;
        const hpPercent = this.currentHp / this.maxHp;
        
        this.hpBar.fillColor = new Color(80, 80, 80, 255);
        this.hpBar.rect(-barWidth / 2, 40, barWidth, barHeight);
        this.hpBar.fill();
        
        this.hpBar.fillColor = new Color(100, 255, 100, 255);
        this.hpBar.rect(-barWidth / 2, 40, barWidth * hpPercent, barHeight);
        this.hpBar.fill();
    }

    onDestroyed() {
        console.log('Village destroyed!');
        GameManager.instance.gameOver(false);
    }
}
