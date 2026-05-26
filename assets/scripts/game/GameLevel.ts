import { _decorator, Component, Node, Prefab, instantiate, Vec2, find } from 'cc';
import { GameManager } from '../core/GameManager';
import { LevelData, WaveData, WaveMonster } from '../data/LevelData';
import { Monster } from './Monster';
import { MapPath } from './MapPath';
import { Village } from './Village';

const { ccclass, property } = _decorator;

@ccclass('GameLevel')
export class GameLevel extends Component {
    @property(Node)
    monsterLayer: Node | null = null;

    @property(MapPath)
    mapPath: MapPath | null = null;

    @property(Village)
    village: Village | null = null;

    @property({ type: Prefab })
    monsterPrefabs: Prefab[] = [];

    levelData: LevelData | null = null;
    currentWave: number = 0;
    waveTimer: number = 0;
    waveInProgress: boolean = false;
    spawnTimers: { timer: number, monster: WaveMonster, spawned: number }[] = [];

    onLoad() {
        if (!this.monsterLayer) {
            this.monsterLayer = find('GameLayer/MonsterLayer');
        }
    }

    init(levelData: LevelData) {
        this.levelData = levelData;
        this.currentWave = 0;
        this.waveTimer = 0;
        this.waveInProgress = false;
        this.spawnTimers = [];
        
        if (this.mapPath && levelData.pathPoints) {
            this.mapPath.setPath(levelData.pathPoints);
        }
        
        if (this.village) {
            this.village.maxHp = levelData.villageHp;
            this.village.currentHp = levelData.villageHp;
            this.village.node.setPosition(levelData.villagePos.x, levelData.villagePos.y, 0);
        }
        
        console.log('GameLevel initialized:', levelData.name);
    }

    startWave(waveIndex: number) {
        if (!this.levelData || waveIndex >= this.levelData.waves.length) return;
        
        const wave = this.levelData.waves[waveIndex];
        this.waveInProgress = true;
        this.spawnTimers = wave.monsters.map(m => ({
            timer: 0,
            monster: m,
            spawned: 0
        }));
        
        console.log('Starting wave', waveIndex + 1);
    }

    update(dt: number) {
        if (GameManager.instance.isPaused || !this.levelData) return;
        
        if (!this.waveInProgress && this.currentWave < this.levelData.waves.length) {
            this.waveTimer += dt * GameManager.instance.gameSpeed;
            const wave = this.levelData.waves[this.currentWave];
            if (this.waveTimer >= wave.delay) {
                this.startWave(this.currentWave);
                this.currentWave++;
                this.waveTimer = 0;
            }
        }
        
        if (this.waveInProgress) {
            this.updateSpawning(dt * GameManager.instance.gameSpeed);
            
            if (this.checkWaveComplete()) {
                this.waveInProgress = false;
                GameManager.instance.onWaveComplete();
                
                if (this.currentWave >= this.levelData.waves.length) {
                    GameManager.instance.allWavesComplete = true;
                }
            }
        }
    }

    updateSpawning(dt: number) {
        for (let i = 0; i < this.spawnTimers.length; i++) {
            const spawner = this.spawnTimers[i];
            if (spawner.spawned >= spawner.monster.count) continue;
            
            spawner.timer += dt;
            if (spawner.timer >= spawner.monster.interval) {
                this.spawnMonster(spawner.monster.type);
                spawner.spawned++;
                spawner.timer = 0;
            }
        }
    }

    spawnMonster(type: number) {
        if (!this.monsterLayer || !this.levelData) return;
        
        const prefab = this.monsterPrefabs[type];
        if (!prefab) {
            console.warn('No prefab for monster type:', type);
            return;
        }
        
        const monsterNode = instantiate(prefab);
        const monster = monsterNode.getComponent(Monster);
        if (monster) {
            monster.init(this.levelData.pathPoints);
        }
        
        this.monsterLayer.addChild(monsterNode);
    }

    checkWaveComplete(): boolean {
        for (const spawner of this.spawnTimers) {
            if (spawner.spawned < spawner.monster.count) return false;
        }
        
        if (this.monsterLayer && this.monsterLayer.children.length > 0) return false;
        
        return true;
    }
}
