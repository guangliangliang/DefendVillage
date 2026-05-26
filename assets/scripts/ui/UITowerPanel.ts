import { _decorator, Component, Node, Button, Prefab, instantiate, Label, Vec3, Vec2, find } from 'cc';
import { TowerType, TowerData } from '../data/TowerData';
import { GameManager } from '../core/GameManager';
import { Tower } from '../game/Tower';

const { ccclass, property } = _decorator;

@ccclass('UITowerPanel')
export class UITowerPanel extends Component {
    @property(Node)
    towerButtonsContainer: Node | null = null;

    @property(Prefab)
    towerBtnPrefab: Prefab | null = null;

    @property(Prefab)
    towerPrefabs: Prefab[] = [];

    @property(Node)
    selectedTowerInfo: Node | null = null;

    selectedTowerType: TowerType | null = null;
    towerLayer: Node | null = null;
    isPlacing: boolean = false;
    previewNode: Node | null = null;

    onLoad() {
        this.towerLayer = find('GameLayer/TowerLayer');
        this.createTowerButtons();
    }

    createTowerButtons() {
        if (!this.towerButtonsContainer || !this.towerBtnPrefab) return;
        
        const towerTypes = Object.values(TowerType).filter(t => typeof t === 'number') as TowerType[];
        
        for (const type of towerTypes) {
            const data = TowerData[type];
            const btnNode = instantiate(this.towerBtnPrefab);
            this.towerButtonsContainer.addChild(btnNode);
            
            const nameLabel = btnNode.getChildByName('Name')?.getComponent(Label);
            if (nameLabel) nameLabel.string = data.name;
            
            const priceLabel = btnNode.getChildByName('Price')?.getComponent(Label);
            if (priceLabel) priceLabel.string = data.levels[0].price.toString();
            
            const btn = btnNode.getComponent(Button);
            if (btn) {
                btn.node.on(Button.EventType.CLICK, () => {
                    this.onTowerSelect(type);
                }, this);
            }
        }
    }

    onTowerSelect(type: TowerType) {
        const data = TowerData[type];
        if (!GameManager.instance.canAfford(data.levels[0].price)) {
            console.log('Not enough gold!');
            return;
        }
        
        this.selectedTowerType = type;
        this.isPlacing = true;
        console.log('Selected tower:', data.name);
    }

    onMapClick(worldPos: Vec2) {
        if (!this.isPlacing || !this.selectedTowerType) return;
        if (!this.towerLayer) return;
        
        const data = TowerData[this.selectedTowerType];
        const prefab = this.towerPrefabs[this.selectedTowerType];
        
        if (!prefab) {
            console.warn('No prefab for tower type:', this.selectedTowerType);
            return;
        }
        
        GameManager.instance.addGold(-data.levels[0].price);
        
        const towerNode = instantiate(prefab);
        towerNode.setPosition(worldPos.x, worldPos.y, 0);
        this.towerLayer.addChild(towerNode);
        
        this.isPlacing = false;
        this.selectedTowerType = null;
    }

    onTowerClick(tower: Tower) {
        if (this.selectedTowerInfo) {
            this.selectedTowerInfo.active = true;
            this.selectedTowerInfo.setPosition(tower.node.position);
        }
    }

    onUpgradeClick(tower: Tower) {
        tower.upgrade();
    }

    onSellClick(tower: Tower) {
        tower.sell();
        if (this.selectedTowerInfo) {
            this.selectedTowerInfo.active = false;
        }
    }

    cancelPlacement() {
        this.isPlacing = false;
        this.selectedTowerType = null;
        if (this.previewNode) {
            this.previewNode.destroy();
            this.previewNode = null;
        }
    }
}
