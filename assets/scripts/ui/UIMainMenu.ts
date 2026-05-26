import { _decorator, Component, Node, Button } from 'cc';
import { SceneManager } from '../core/SceneManager';

const { ccclass, property } = _decorator;

@ccclass('UIMainMenu')
export class UIMainMenu extends Component {
    @property(Button)
    startBtn: Button | null = null;

    @property(Button)
    settingBtn: Button | null = null;

    @property(Node)
    settingPanel: Node | null = null;

    onLoad() {
        if (this.startBtn) {
            this.startBtn.node.on(Button.EventType.CLICK, this.onStartClick, this);
        }
        if (this.settingBtn) {
            this.settingBtn.node.on(Button.EventType.CLICK, this.onSettingClick, this);
        }
    }

    onStartClick() {
        SceneManager.goToLevelSelect();
    }

    onSettingClick() {
        if (this.settingPanel) {
            this.settingPanel.active = !this.settingPanel.active;
        }
    }
}
