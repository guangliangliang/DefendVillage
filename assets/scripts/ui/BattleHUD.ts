import { _decorator, Component, Label, Node } from 'cc';
import { BuildAction } from '../config/GameTypes';
import { addCenteredLabel, createUiNode, drawRect } from '../core/NodeFactory';

const { ccclass } = _decorator;

export interface HudController {
  onSelectAction(action: BuildAction): void;
}

@ccclass('BattleHUD')
export class BattleHUD extends Component {
  private goldLabel = createUiNode('GoldLabel', 180, 30);
  private livesLabel = createUiNode('LivesLabel', 180, 30);
  private waveLabel = createUiNode('WaveLabel', 220, 30);
  private hintLabel = createUiNode('HintLabel', 560, 36);
  private controller!: HudController;
  private goldText!: Label;
  private livesText!: Label;
  private waveText!: Label;
  private hintText!: Label;

  initialize(controller: HudController): void {
    this.controller = controller;
    this.buildLayout();
  }

  setStats(gold: number, lives: number, wave: number, totalWaves: number): void {
    this.goldText.string = `Gold: ${gold}`;
    this.livesText.string = `Village: ${lives}`;
    this.waveText.string = `Wave: ${wave}/${totalWaves}`;
  }

  setHint(text: string): void {
    this.hintText.string = text;
  }

  showEndState(victory: boolean): void {
    this.setHint(victory ? 'Victory! The village survived.' : 'Defeat. The village fell.');
  }

  private buildLayout(): void {
    this.node.destroyAllChildren();

    const topBar = createUiNode('TopBar', 1180, 64);
    topBar.setParent(this.node);
    topBar.setPosition(0, 315);
    drawRect(topBar, 1180, 64, '#2a221f', '#8c775f', 14);

    this.goldLabel.setParent(topBar);
    this.goldLabel.setPosition(-420, 0);
    this.goldText = addCenteredLabel(this.goldLabel, 'Gold: 0', 24);

    this.livesLabel.setParent(topBar);
    this.livesLabel.setPosition(-190, 0);
    this.livesText = addCenteredLabel(this.livesLabel, 'Village: 0', 24);

    this.waveLabel.setParent(topBar);
    this.waveLabel.setPosition(90, 0);
    this.waveText = addCenteredLabel(this.waveLabel, 'Wave: 0/0', 24);

    this.hintLabel.setParent(this.node);
    this.hintLabel.setPosition(0, 270);
    drawRect(this.hintLabel, 560, 36, '#4d3d34', '#9f8a70', 10);
    this.hintText = addCenteredLabel(this.hintLabel, 'Choose a tower, then tap a build tile.', 18);

    const actions: Array<{ label: string; action: BuildAction; color: string; x: number }> = [
      { label: 'Arrow', action: 'arrow', color: '#9a6a3f', x: -270 },
      { label: 'Cannon', action: 'cannon', color: '#7e5940', x: -90 },
      { label: 'Frost', action: 'frost', color: '#4b8fa8', x: 90 },
      { label: 'Sell', action: 'sell', color: '#8d3d3d', x: 270 },
    ];

    for (const item of actions) {
      const button = createUiNode(`${item.label}Button`, 150, 56);
      button.setParent(this.node);
      button.setPosition(item.x, -316);
      drawRect(button, 150, 56, item.color, '#f2dfc4', 14);
      addCenteredLabel(button, item.label, 22);
      button.on(Node.EventType.TOUCH_END, () => {
        this.controller.onSelectAction(item.action);
      });
    }
  }
}
