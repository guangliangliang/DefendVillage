import { _decorator, Component, Vec2 } from 'cc';
import { Levels, LevelData } from '../data/LevelData';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    static instance: GameManager;

    @property
    startGold: number = 200;
    
    @property
    maxVillageHp: number = 10;

    gold: number = 0;
    villageHp: number = 0;
    currentLevelId: number = 1;
    isPaused: boolean = false;
    gameSpeed: number = 1;
    currentLevel: LevelData | null = null;
    currentWave: number = 0;
    waveInProgress: boolean = false;
    allWavesComplete: boolean = false;

    onLoad() {
        if (GameManager.instance) {
            this.destroy();
            return;
        }
        GameManager.instance = this;
    }

    startGame(levelId: number) {
        this.currentLevelId = levelId;
        this.currentLevel = Levels.find(l => l.id === levelId) || null;
        if (!this.currentLevel) {
            console.error('Level not found:', levelId);
            return;
        }
        
        this.gold = this.currentLevel.startGold;
        this.villageHp = this.currentLevel.villageHp;
        this.currentWave = 0;
        this.isPaused = false;
        this.gameSpeed = 1;
        this.waveInProgress = false;
        this.allWavesComplete = false;
        
        console.log('Game started, level:', this.currentLevel.name);
    }

    addGold(amount: number) {
        this.gold += amount;
        console.log('Gold:', this.gold);
    }

    canAfford(amount: number): boolean {
        return this.gold >= amount;
    }

    damageVillage(damage: number) {
        this.villageHp -= damage;
        console.log('Village HP:', this.villageHp);
        if (this.villageHp <= 0) {
            this.gameOver(false);
        }
    }

    startNextWave() {
        if (!this.currentLevel) return;
        if (this.currentWave >= this.currentLevel.waves.length) {
            this.allWavesComplete = true;
            return;
        }
        
        this.waveInProgress = true;
        console.log('Starting wave', this.currentWave + 1);
        this.currentWave++;
    }

    onWaveComplete() {
        this.waveInProgress = false;
        if (this.allWavesComplete && this.checkNoMonstersLeft()) {
            this.gameOver(true);
        }
    }

    checkNoMonstersLeft(): boolean {
        return true;
    }

    pauseGame() {
        this.isPaused = true;
    }

    resumeGame() {
        this.isPaused = false;
    }

    setGameSpeed(speed: number) {
        this.gameSpeed = speed;
    }

    gameOver(isWin: boolean) {
        console.log('Game Over, isWin:', isWin);
    }
}
