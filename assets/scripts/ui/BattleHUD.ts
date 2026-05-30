import { _decorator, Component, Label, Node } from 'cc';
import { BuildAction } from '../config/GameTypes';
import { addCenteredLabel, createSpriteNode, createUiNode, drawRect } from '../core/NodeFactory';

const { ccclass } = _decorator;

export interface HudController {
  onSelectAction(action: BuildAction): void;
}

@ccclass('BattleHUD')
export class BattleHUD extends Component {
  private moneyDigits = new Node('MoneyDigits');
  private waveYellowDigits = new Node('WaveYellowDigits');
  private waveWhiteDigits = new Node('WaveWhiteDigits');
  private lifeAnchor = new Node('LifeAnchor');
  private messagePanel = createUiNode('MessagePanel', 520, 72);
  private messageText!: Label;
  private lastLives = -1;

  initialize(_controller: HudController): void {
    this.buildLayout();
  }

  setStats(gold: number, lives: number, wave: number, totalWaves: number): void {
    this.renderDigits(this.moneyDigits, Math.max(0, gold).toString(), 'white', 30, 24);
    const waveText = Math.max(1, wave) < 10 ? `0${Math.max(1, wave)}` : Math.max(1, wave).toString();
    this.renderDigits(this.waveYellowDigits, waveText, 'yellow', 36, 45);
    this.renderDigits(this.waveWhiteDigits, Math.max(totalWaves, 15).toString(), 'white', 30, 22);
    this.updateLife(lives);
  }

  setHint(_text: string): void {
  }

  showEndState(victory: boolean): void {
    this.messagePanel.active = true;
    this.messageText.string = victory ? 'Victory' : 'Defeat';
  }

  private buildLayout(): void {
    this.node.destroyAllChildren();

    const topBar = createSpriteNode('MenuBar', 960, 80, 'carrot/battle/menu_bg');
    topBar.setParent(this.node);
    topBar.setPosition(this.sourceX(480), this.sourceY(600));

    const centerPanel = createSpriteNode('WavePanel', 300, 80, 'carrot/battle/hud_center');
    centerPanel.setParent(this.node);
    centerPanel.setPosition(this.sourceX(480), this.sourceY(600));

    const speedButton = createSpriteNode('SpeedButton', 110, 80, 'carrot/battle/speed11');
    speedButton.setParent(this.node);
    speedButton.setPosition(this.sourceX(680), this.sourceY(600));

    const pauseButton = createSpriteNode('PauseButton', 60, 80, 'carrot/battle/pause01');
    pauseButton.setParent(this.node);
    pauseButton.setPosition(this.sourceX(790), this.sourceY(600));

    const menuButton = createSpriteNode('MenuButton', 60, 80, 'carrot/battle/menu01');
    menuButton.setParent(this.node);
    menuButton.setPosition(this.sourceX(870), this.sourceY(600));

    this.moneyDigits.setParent(this.node);
    this.moneyDigits.setPosition(this.sourceX(138), this.sourceY(610));

    this.waveYellowDigits.setParent(this.node);
    this.waveYellowDigits.setPosition(this.sourceX(377), this.sourceY(607));

    this.waveWhiteDigits.setParent(this.node);
    this.waveWhiteDigits.setPosition(this.sourceX(480), this.sourceY(608));

    this.lifeAnchor.setParent(this.node);
    this.lifeAnchor.setPosition(this.sourceX(919), this.sourceY(475));

    this.messagePanel.setParent(this.node);
    this.messagePanel.setPosition(0, 0);
    drawRect(this.messagePanel, 520, 72, '#123f52', '#bdf4ff', 18);
    this.messageText = addCenteredLabel(this.messagePanel, '', 36, '#fff6b8');
    this.messagePanel.active = false;
  }

  private renderDigits(parent: Node, value: string, color: 'white' | 'yellow', digitHeight: number, spacing: number): void {
    parent.destroyAllChildren();
    for (let index = 0; index < value.length; index += 1) {
      const digit = value[index];
      const node = createSpriteNode(`Digit-${color}-${digit}-${index}`, Math.round(digitHeight * 0.76), digitHeight, `carrot/battle/digits/${color}_${digit}`);
      node.setParent(parent);
      node.setPosition(index * spacing, 0);
    }
  }

  private updateLife(lives: number): void {
    const clampedLives = Math.min(10, Math.max(1, Math.floor(lives)));
    if (clampedLives === this.lastLives) {
      return;
    }

    this.lastLives = clampedLives;
    this.lifeAnchor.destroyAllChildren();
    const badge = createSpriteNode(`Life-${clampedLives}`, 80, 40, `carrot/battle/life_${clampedLives}`);
    badge.setParent(this.lifeAnchor);
  }

  private sourceX(value: number): number {
    return value - 480;
  }

  private sourceY(value: number): number {
    return value - 320;
  }
}
