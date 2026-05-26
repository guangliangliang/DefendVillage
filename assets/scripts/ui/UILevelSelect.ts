import { _decorator, Component, Node, Button, Prefab, instantiate, Label } from 'cc';
import { SceneManager } from '../core/SceneManager';
import { Levels } from '../data/LevelData';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('UILevelSelect')
export class UILevelSelect extends Component {
    @property(Node)
    levelGrid: Node | null = null;

    @property(Prefab)
    levelBtnPrefab: Prefab | null = null;

    @property(Button)
    backBtn: Button | null = null;

    onLoad() {
        if (this.backBtn) {
            this.backBtn.node.on(Button.EventType.CLICK, this.onBackClick, this);
        }
        
        this.createLevelButtons();
    }

    createLevelButtons() {
        if (!this.levelGrid || !this.levelBtnPrefab) return;
        
        for (const level of Levels) {
            const btnNode = instantiate(this.levelBtnPrefab);
            this.levelGrid.addChild(btnNode);
            
            const label = btnNode.getComponentInChildren(Label);
            if (label) {
                label.string = level.name;
            }
            
            const btn = btnNode.getComponent(Button);
            if (btn) {
                btn.node.on(Button.EventType.CLICK, () => {
                    this.onLevelClick(level.id);
                }, this);
            }
        }
    }

    onLevelClick(levelId: number) {
        console.log('Selected level:', levelId);
        GameManager.instance.startGame(levelId);
        SceneManager.goToGame();
    }

    onBackClick() {
        SceneManager.goToStart();
    }
}
