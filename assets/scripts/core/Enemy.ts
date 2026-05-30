import { _decorator, Component, Graphics, Layers, Node, UITransform, Vec3 } from 'cc';
import { EnemyConfig } from '../config/GameTypes';
import { createSpriteNode, createUiNode, hexColor } from './NodeFactory';

const { ccclass } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
  config!: EnemyConfig;
  path: Vec3[] = [];
  hp = 0;
  currentPathIndex = 0;
  currentSpeed = 0;
  slowTimer = 0;
  isDead = false;
  hasEscaped = false;

  private hpBar!: Graphics;
  private hpBarBg!: Graphics;
  private hpBarNode!: Node;
  private hpVisibleTimer = 0;
  private onDeathCallback!: (enemy: Enemy) => void;
  private onEscapeCallback!: (enemy: Enemy) => void;

  setup(
    config: EnemyConfig,
    path: Vec3[],
    onDeath: (enemy: Enemy) => void,
    onEscape: (enemy: Enemy) => void,
  ): void {
    this.config = config;
    this.path = path;
    this.hp = config.maxHp;
    this.currentSpeed = config.speed;
    this.onDeathCallback = onDeath;
    this.onEscapeCallback = onEscape;
    this.currentPathIndex = 0;

    this.node.setPosition(path[0]);
    const spriteSize = config.size * (config.id === 'chief' ? 4.2 : 3.4);
    const spriteNode = createSpriteNode('EnemySprite', spriteSize, spriteSize, `carrot/sprites/enemies/${config.id}`);
    spriteNode.setParent(this.node);

    const hpBgNode = createUiNode('HpBg', 52, 8);
    hpBgNode.setParent(this.node);
    hpBgNode.setPosition(0, spriteSize * 0.42);
    hpBgNode.active = false;
    this.hpBarNode = hpBgNode;
    this.hpBarBg = hpBgNode.addComponent(Graphics);
    this.hpBarBg.fillColor = hexColor('#2c1c13');
    this.hpBarBg.roundRect(-26, -4, 52, 8, 3);
    this.hpBarBg.fill();

    const hpNode = new Node('HpFill');
    hpNode.layer = Layers.Enum.UI_2D;
    hpNode.setParent(hpBgNode);
    hpNode.addComponent(UITransform);
    this.hpBar = hpNode.addComponent(Graphics);
    this.refreshHpBar();
  }

  update(dt: number): void {
    if (this.isDead || this.hasEscaped || this.path.length <= 1) {
      return;
    }

    if (this.hpVisibleTimer > 0) {
      this.hpVisibleTimer -= dt;
      if (this.hpVisibleTimer <= 0 && this.hpBarNode) {
        this.hpBarNode.active = false;
      }
    }

    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) {
        this.currentSpeed = this.config.speed;
      }
    }

    const nextIndex = this.currentPathIndex + 1;
    if (nextIndex >= this.path.length) {
      this.escape();
      return;
    }

    const currentPosition = this.node.position.clone();
    const target = this.path[nextIndex];
    const direction = target.clone().subtract(currentPosition);
    const distance = direction.length();
    const step = this.currentSpeed * dt;

    if (distance <= step) {
      this.node.setPosition(target);
      this.currentPathIndex = nextIndex;
      if (this.currentPathIndex >= this.path.length - 1) {
        this.escape();
      }
      return;
    }

    direction.normalize().multiplyScalar(step);
    this.node.setPosition(currentPosition.add(direction));
  }

  takeDamage(amount: number): void {
    if (this.isDead || this.hasEscaped) {
      return;
    }

    this.hp -= amount;
    this.hpVisibleTimer = 1.2;
    this.hpBarNode.active = true;
    this.refreshHpBar();
    if (this.hp <= 0) {
      this.die();
    }
  }

  applySlow(factor: number, duration: number): void {
    if (this.isDead || this.hasEscaped) {
      return;
    }

    this.currentSpeed = this.config.speed * factor;
    this.slowTimer = Math.max(this.slowTimer, duration);
  }

  private refreshHpBar(): void {
    if (!this.hpBar) {
      return;
    }

    const ratio = Math.max(0, this.hp) / this.config.maxHp;
    this.hpBar.clear();
    this.hpBar.fillColor = hexColor(ratio > 0.5 ? '#7cd66a' : ratio > 0.25 ? '#d6c25f' : '#d65f5f');
    this.hpBar.roundRect(-26, -4, 52 * ratio, 8, 3);
    this.hpBar.fill();
  }

  private die(): void {
    this.isDead = true;
    this.onDeathCallback(this);
    this.node.destroy();
  }

  private escape(): void {
    this.hasEscaped = true;
    this.onEscapeCallback(this);
    this.node.destroy();
  }
}
