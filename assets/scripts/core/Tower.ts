import { _decorator, Component, Graphics, Layers, Node, UITransform, Vec3 } from 'cc';
import { TowerConfig, TowerId, TowerLevelStats } from '../config/GameTypes';
import { Enemy } from './Enemy';
import { createSpriteNode, hexColor } from './NodeFactory';

const { ccclass } = _decorator;

export interface TowerHost {
  findTarget(origin: Vec3, range: number): Enemy | null;
  spawnProjectile(origin: Vec3, target: Enemy, stats: TowerLevelStats, towerId: TowerId): void;
}

@ccclass('Tower')
export class Tower extends Component {
  config!: TowerConfig;
  host!: TowerHost;
  levelIndex = 0;
  buildSpotId = '';
  totalSpent = 0;
  private cooldown = 0;
  private rangeRing!: Graphics;

  setup(config: TowerConfig, host: TowerHost, buildSpotId: string): void {
    this.config = config;
    this.host = host;
    this.buildSpotId = buildSpotId;
    this.levelIndex = 0;
    this.totalSpent = this.currentStats.cost;
    this.redraw();
  }

  get towerId(): TowerId {
    return this.config.id;
  }

  get currentStats(): TowerLevelStats {
    return this.config.levels[this.levelIndex];
  }

  get upgradeCost(): number | null {
    const next = this.config.levels[this.levelIndex + 1];
    return next ? next.cost : null;
  }

  canUpgrade(): boolean {
    return this.levelIndex < this.config.levels.length - 1;
  }

  upgrade(): void {
    if (!this.canUpgrade()) {
      return;
    }

    this.levelIndex += 1;
    this.totalSpent += this.currentStats.cost;
    this.redraw();
  }

  update(dt: number): void {
    this.cooldown -= dt;
    if (this.cooldown > 0) {
      return;
    }

    const stats = this.currentStats;
    const target = this.host.findTarget(this.node.position, stats.range);
    if (!target) {
      return;
    }

    this.cooldown = stats.attackInterval;
    this.host.spawnProjectile(this.node.position, target, stats, this.towerId);
  }

  setSelected(selected: boolean): void {
    if (this.rangeRing) {
      this.rangeRing.node.active = selected;
    }
  }

  private redraw(): void {
    this.node.destroyAllChildren();

    const bodySize = 64 + this.levelIndex * 6;
    const spriteNode = createSpriteNode('TowerSprite', bodySize, bodySize, `carrot/sprites/towers/${this.config.id}`);
    spriteNode.setParent(this.node);

    const ringNode = new Node('RangeRing');
    ringNode.layer = Layers.Enum.UI_2D;
    ringNode.setParent(this.node);
    ringNode.addComponent(UITransform);
    this.rangeRing = ringNode.addComponent(Graphics);
    this.rangeRing.clear();
    this.rangeRing.strokeColor = hexColor('#ffffff');
    this.rangeRing.lineWidth = 1.5;
    this.rangeRing.circle(0, 0, this.currentStats.range);
    this.rangeRing.stroke();
    ringNode.active = false;
  }
}
