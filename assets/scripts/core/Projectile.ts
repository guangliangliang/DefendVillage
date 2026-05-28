import { _decorator, Component, Node, Vec3 } from 'cc';
import { Enemy } from './Enemy';

const { ccclass } = _decorator;

@ccclass('Projectile')
export class Projectile extends Component {
  speed = 360;
  damage = 0;
  splashRadius = 0;
  slowFactor?: number;
  slowDuration?: number;
  target!: Enemy;
  onImpact!: (projectile: Projectile, target: Enemy) => void;

  setup(
    target: Enemy,
    speed: number,
    damage: number,
    splashRadius: number,
    slowFactor: number | undefined,
    slowDuration: number | undefined,
    onImpact: (projectile: Projectile, target: Enemy) => void,
  ): void {
    this.target = target;
    this.speed = speed;
    this.damage = damage;
    this.splashRadius = splashRadius;
    this.slowFactor = slowFactor;
    this.slowDuration = slowDuration;
    this.onImpact = onImpact;
  }

  update(dt: number): void {
    if (!this.target || !this.target.isValid || this.target.isDead || this.target.hasEscaped) {
      this.node.destroy();
      return;
    }

    const current = this.node.position.clone();
    const targetPosition = this.target.node.position.clone();
    const offset = targetPosition.subtract(current);
    const distance = offset.length();
    const step = this.speed * dt;

    if (distance <= step || distance <= 8) {
      this.onImpact(this, this.target);
      this.node.destroy();
      return;
    }

    offset.normalize().multiplyScalar(step);
    this.node.setPosition(current.add(offset));
  }
}
