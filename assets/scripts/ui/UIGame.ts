import { _decorator, Component, Node, Button, Label } from 'cc';
import { GameManager } from '../core/GameManager';
import { SceneManager } from '../core/SceneManager';

const { ccclass, property } = _decorator;

@ccclass('UIGame')
export class UIGame extends Component {
    @property(Label)
    goldLabel: Label | null = null;

    @property(Label)
    hpLabel: Label | null = null;

    @property(Label)
    waveLabel: Label | null = null;

    @property(Button)
    pauseBtn: Button | null = null;

    @property(Button)
    speedBtn: Button | null = null;

    @property(Node)
    pausePanel: Node | null = null;

    @property(Node)
    gameOverPanel: Node | null = null;

    @property(Node)
    towerSelectPanel: Node | null = null;

    currentSpeed: number = 1;
    speedOptions: number[] = [1, 2, 3];

    onLoad() {
        if (this.pauseBtn) {
            this.pauseBtn.node.on(Button.EventType.CLICK, this.onPauseClick, this);
        }
        if (this.speedBtn) {
            this.speedBtn.node.on(Button.EventType.CLICK, this.onSpeedClick, this);
        }
        
        this.updateUI();
    }

    update(dt: number) {
        this.updateUI();
    }

    updateUI() {
        if (this.goldLabel) {
            this.goldLabel.string = GameManager.instance.gold.toString();
        }
        if (this.hpLabel) {
            this.hpLabel.string = GameManager.instance.villageHp.toString();
        }
        if (this.waveLabel && GameManager.instance.currentLevel) {
            const totalWaves = GameManager.instance.currentLevel.waves.length;
            this.waveLabel.string = `${GameManager.instance.currentWave}/${totalWaves}`;
        }
    }

    onPauseClick() {
        if (GameManager.instance.isPaused) {
            GameManager.instance.resumeGame();
            if (this.pausePanel) this.pausePanel.active = false;
        } else {
            GameManager.instance.pauseGame();
            if (this.pausePanel) this.pausePanel.active = true;
        }
    }

    onSpeedClick() {
        const currentIndex = this.speedOptions.indexOf(this.currentSpeed);
        const nextIndex = (currentIndex + 1) % this.speedOptions.length;
        this.currentSpeed = this.speedOptions[nextIndex];
        GameManager.instance.setGameSpeed(this.currentSpeed);
        
        const speedLabel = this.speedBtn?.getComponentInChildren(Label);
        if (speedLabel) {
            speedLabel.string = `${this.currentSpeed}x`;
        }
    }

    onResumeClick() {
        GameManager.instance.resumeGame();
        if (this.pausePanel) this.pausePanel.active = false;
    }

    onRestartClick() {
        if (GameManager.instance.currentLevelId) {
            GameManager.instance.startGame(GameManager.instance.currentLevelId);
        }
        if (this.pausePanel) this.pausePanel.active = false;
        if (this.gameOverPanel) this.gameOverPanel.active = false;
    }

    onQuitClick() {
        SceneManager.goToLevelSelect();
    }

    showGameOver(isWin: boolean) {
        if (this.gameOverPanel) {
            this.gameOverPanel.active = true;
            const resultLabel = this.gameOverPanel.getComponentInChildren(Label);
            if (resultLabel) {
                resultLabel.string = isWin ? '胜利！' : '失败！';
            }
        }
    }
}
