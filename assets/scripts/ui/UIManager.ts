import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    static instance: UIManager;

    onLoad() {
        if (UIManager.instance) {
            this.destroy();
            return;
        }
        UIManager.instance = this;
    }

    showPanel(panel: Node) {
        panel.active = true;
    }

    hidePanel(panel: Node) {
        panel.active = false;
    }
}
