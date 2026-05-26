import { _decorator, Component, Node, Vec3, Vec2, tween } from 'cc';
import { Monster } from './Monster';

const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property
    speed: number = 300;

    @property
    damage: number = 10;

    target: Monster | null = null;
    targetPos: Vec2 | null = null;

    start() {
        
    }

    setTarget(target: Monster) {
        this.target = target;
    }

    setTargetPos(pos: Vec2) {
        this.targetPos = pos;
    }

    update(dt: number) {
        if (this.target && this.target.node) {
            const targetPos = new Vec2(this.target.node.position.x, this.target.node.position.y);
            this.moveTowards(targetPos, dt);
        } else if (this.targetPos) {
            this.moveTowards(this.targetPos, dt);
        } else {
            this.node.destroy();
        }
    }

    moveTowards(target: Vec2, dt: number) {
        const current = new Vec2(this.node.position.x, this.node.position.y);
        const direction = new Vec2();
        Vec2.subtract(direction, target, current);
        
        const distance = direction.length();
        if (distance < 10) {
            this.onHit();
            return;
        }

        direction.normalize();
        const moveDistance = this.speed * dt;
        current.x += direction.x * moveDistance;
        current.y += direction.y * moveDistance;
        this.node.setPosition(current.x, current.y, 0);
    }

    onHit() {
        if (this.target) {
            this.target.takeDamage(this.damage);
        }
        
        tween(this.node)
            .to(0.1, { scale: new Vec3(0.1, 0.1, 0.1) })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}
