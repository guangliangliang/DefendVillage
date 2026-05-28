import { _decorator, Component, Layers, Node, Vec3, view } from 'cc';
import { ENEMY_CONFIGS, LEVEL_001, TOWER_CONFIGS } from '../config/LevelConfig';
import { BuildAction, GridPoint, LevelConfig, TowerId, TowerLevelStats } from '../config/GameTypes';
import { BattleState } from './BattleState';
import { Enemy } from './Enemy';
import { addCenteredLabel, createUiNode, drawCircle, drawRect } from './NodeFactory';
import { Projectile } from './Projectile';
import { Tower, TowerHost } from './Tower';
import { WaveController } from './WaveController';
import { BattleHUD, HudController } from '../ui/BattleHUD';

const { ccclass } = _decorator;

interface BuildSpotRecord {
  id: string;
  grid: GridPoint;
  node: Node;
  tower: Tower | null;
}

@ccclass('GameBootstrap')
export class GameBootstrap extends Component implements TowerHost, HudController {
  private readonly level: LevelConfig = LEVEL_001;
  private battleState!: BattleState;
  private waveController!: WaveController;
  private selectedAction: BuildAction = 'arrow';

  private mapLayer!: Node;
  private towerLayer!: Node;
  private enemyLayer!: Node;
  private projectileLayer!: Node;
  private hudLayer!: Node;
  private hud!: BattleHUD;

  private boardOrigin = new Vec3();
  private pathWorldPoints: Vec3[] = [];
  private buildSpots = new Map<string, BuildSpotRecord>();
  private enemies = new Set<Enemy>();
  private towers = new Set<Tower>();

  onLoad(): void {
    this.battleState = new BattleState(this.level.startGold, this.level.startLives, this.level.waves.length);
    this.waveController = new WaveController(
      this.level,
      (waveNumber, label) => {
        this.battleState.setWave(waveNumber);
        this.hud.setHint(`Wave ${waveNumber}: ${label}`);
        this.refreshHud();
      },
      (enemyId) => this.spawnEnemy(enemyId),
    );

    this.createLayers();
    this.computeBoardOrigin();
    this.createBattlefield();
    this.createHud();
    this.refreshHud();
  }

  update(dt: number): void {
    if (this.battleState.isVictory || this.battleState.isDefeat) {
      return;
    }

    this.waveController.update(dt);
    if (this.waveController.isFinished && this.enemies.size === 0) {
      this.battleState.markVictory();
      this.hud.showEndState(true);
    }
  }

  onSelectAction(action: BuildAction): void {
    this.selectedAction = action;
    const actionText = action === 'sell' ? 'Sell mode active.' : `Selected ${TOWER_CONFIGS[action].name}.`;
    this.hud.setHint(actionText);
    this.clearTowerSelection();
  }

  findTarget(origin: Vec3, range: number): Enemy | null {
    let closest: Enemy | null = null;
    let closestDistance = Number.MAX_SAFE_INTEGER;

    for (const enemy of this.enemies) {
      if (!enemy.isValid || enemy.isDead || enemy.hasEscaped) {
        continue;
      }

      const distance = Vec3.distance(origin, enemy.node.position);
      if (distance <= range && distance < closestDistance) {
        closest = enemy;
        closestDistance = distance;
      }
    }

    return closest;
  }

  spawnProjectile(origin: Vec3, target: Enemy, stats: TowerLevelStats, towerId: TowerId): void {
    const projectileNode = createUiNode(`${towerId}-projectile`, 16, 16);
    projectileNode.setParent(this.projectileLayer);
    projectileNode.setPosition(origin);
    drawCircle(projectileNode, 8, this.projectileColorForTower(towerId), '#ffffff');

    const projectile = projectileNode.addComponent(Projectile);
    projectile.setup(
      target,
      stats.projectileSpeed,
      stats.damage,
      stats.splashRadius ?? 0,
      stats.slowFactor,
      stats.slowDuration,
      (instance, hitTarget) => this.resolveProjectileImpact(instance, hitTarget),
    );
  }

  private createLayers(): void {
    this.mapLayer = new Node('MapLayer');
    this.mapLayer.layer = Layers.Enum.UI_2D;
    this.mapLayer.setParent(this.node);
    this.towerLayer = new Node('TowerLayer');
    this.towerLayer.layer = Layers.Enum.UI_2D;
    this.towerLayer.setParent(this.node);
    this.enemyLayer = new Node('EnemyLayer');
    this.enemyLayer.layer = Layers.Enum.UI_2D;
    this.enemyLayer.setParent(this.node);
    this.projectileLayer = new Node('ProjectileLayer');
    this.projectileLayer.layer = Layers.Enum.UI_2D;
    this.projectileLayer.setParent(this.node);
    this.hudLayer = new Node('HudLayer');
    this.hudLayer.layer = Layers.Enum.UI_2D;
    this.hudLayer.setParent(this.node);
  }

  private computeBoardOrigin(): void {
    const visibleSize = view.getVisibleSize();
    const boardWidth = this.level.gridWidth * this.level.cellSize;
    const boardHeight = this.level.gridHeight * this.level.cellSize;
    this.boardOrigin = new Vec3(
      -visibleSize.width / 2 + (visibleSize.width - boardWidth) / 2 + this.level.cellSize / 2,
      visibleSize.height / 2 - (visibleSize.height - boardHeight) / 2 - this.level.cellSize / 2 - 24,
      0,
    );
  }

  private createBattlefield(): void {
    const backdrop = createUiNode('Backdrop', this.level.gridWidth * this.level.cellSize + 36, this.level.gridHeight * this.level.cellSize + 36);
    backdrop.setParent(this.mapLayer);
    backdrop.setPosition(this.gridToWorld({ x: (this.level.gridWidth - 1) / 2, y: (this.level.gridHeight - 1) / 2 }));
    drawRect(backdrop, this.level.gridWidth * this.level.cellSize + 36, this.level.gridHeight * this.level.cellSize + 36, '#273728', '#d4c5a1', 20);

    const pathKeys = new Set(this.level.path.map((p) => `${p.x},${p.y}`));
    const buildKeys = new Set(this.level.buildSpots.map((p) => `${p.x},${p.y}`));

    for (let y = 0; y < this.level.gridHeight; y += 1) {
      for (let x = 0; x < this.level.gridWidth; x += 1) {
        const key = `${x},${y}`;
        const tile = createUiNode(`Tile-${key}`, this.level.cellSize - 4, this.level.cellSize - 4);
        tile.setParent(this.mapLayer);
        tile.setPosition(this.gridToWorld({ x, y }));

        if (pathKeys.has(key)) {
          drawRect(tile, this.level.cellSize - 4, this.level.cellSize - 4, '#9e835d', '#d6c9ad', 10);
        } else if (buildKeys.has(key)) {
          drawRect(tile, this.level.cellSize - 4, this.level.cellSize - 4, '#41593b', '#c8d2a0', 10);
          const labelNode = createUiNode('BuildHint', 48, 20);
          labelNode.setParent(tile);
          labelNode.setPosition(0, 0);
          addCenteredLabel(labelNode, '+', 24, '#dff1bd');
        } else {
          drawRect(tile, this.level.cellSize - 4, this.level.cellSize - 4, '#334b2f', '#6e875f', 10);
        }
      }
    }

    this.pathWorldPoints = this.level.path.map((point) => this.gridToWorld(point));
    const corePosition = this.pathWorldPoints[this.pathWorldPoints.length - 1];
    const coreNode = createUiNode('VillageCore', this.level.cellSize - 16, this.level.cellSize - 16);
    coreNode.setParent(this.mapLayer);
    coreNode.setPosition(corePosition);
    drawRect(coreNode, this.level.cellSize - 16, this.level.cellSize - 16, '#775f3a', '#f0dfb2', 12);
    addCenteredLabel(coreNode, 'Core', 18);

    for (const spot of this.level.buildSpots) {
      const spotNode = createUiNode(`BuildSpot-${spot.x}-${spot.y}`, this.level.cellSize - 8, this.level.cellSize - 8);
      spotNode.setParent(this.towerLayer);
      spotNode.setPosition(this.gridToWorld(spot));

      const id = `${spot.x},${spot.y}`;
      const record: BuildSpotRecord = { id, grid: spot, node: spotNode, tower: null };
      this.buildSpots.set(id, record);

      spotNode.on(Node.EventType.TOUCH_END, () => {
        this.handleBuildSpotClick(record);
      });
    }
  }

  private createHud(): void {
    const hudNode = new Node('BattleHud');
    hudNode.layer = Layers.Enum.UI_2D;
    hudNode.setParent(this.hudLayer);
    this.hud = hudNode.addComponent(BattleHUD);
    this.hud.initialize(this);
  }

  private handleBuildSpotClick(record: BuildSpotRecord): void {
    if (this.battleState.isVictory || this.battleState.isDefeat) {
      return;
    }

    if (record.tower && this.selectedAction === 'sell') {
      this.sellTower(record);
      return;
    }

    if (!record.tower) {
      const config = TOWER_CONFIGS[this.selectedAction];
      if (!config) {
        this.hud.setHint('Choose a tower first.');
        return;
      }

      const buildCost = config.levels[0].cost;
      if (!this.battleState.spend(buildCost)) {
        this.hud.setHint('Not enough gold.');
        return;
      }

      const towerNode = new Node(`Tower-${record.id}`);
      towerNode.layer = Layers.Enum.UI_2D;
      towerNode.setParent(this.towerLayer);
      towerNode.setPosition(record.node.position);
      const tower = towerNode.addComponent(Tower);
      tower.setup(config, this, record.id);
      record.tower = tower;
      this.towers.add(tower);
      this.clearTowerSelection();
      tower.setSelected(true);
      this.refreshHud();
      this.hud.setHint(`${config.name} built.`);
      return;
    }

    if (record.tower) {
      this.clearTowerSelection();
      record.tower.setSelected(true);

      const upgradeCost = record.tower.upgradeCost;
      if (upgradeCost === null) {
        this.hud.setHint('Tower is already max level.');
        return;
      }

      if (!this.battleState.spend(upgradeCost)) {
        this.hud.setHint('Not enough gold to upgrade.');
        return;
      }

      record.tower.upgrade();
      this.refreshHud();
      this.hud.setHint(`${record.tower.config.name} upgraded.`);
    }
  }

  private sellTower(record: BuildSpotRecord): void {
    if (!record.tower) {
      return;
    }

    const refund = Math.floor(record.tower.totalSpent * 0.75);
    this.battleState.earn(refund);
    this.towers.delete(record.tower);
    record.tower.node.destroy();
    record.tower = null;
    this.refreshHud();
    this.hud.setHint(`Tower sold for ${refund} gold.`);
  }

  private spawnEnemy(enemyId: string): void {
    const config = ENEMY_CONFIGS[enemyId];
    const enemyNode = new Node(`Enemy-${enemyId}`);
    enemyNode.layer = Layers.Enum.UI_2D;
    enemyNode.setParent(this.enemyLayer);
    const enemy = enemyNode.addComponent(Enemy);
    enemy.setup(
      config,
      this.pathWorldPoints,
      (instance) => {
        this.enemies.delete(instance);
        this.battleState.earn(instance.config.reward);
        this.refreshHud();
      },
      (instance) => {
        this.enemies.delete(instance);
        this.battleState.loseLives(instance.config.damageToVillage);
        if (this.battleState.isDefeat) {
          this.hud.showEndState(false);
        }
        this.refreshHud();
      },
    );
    this.enemies.add(enemy);
  }

  private resolveProjectileImpact(projectile: Projectile, target: Enemy): void {
    if (projectile.splashRadius > 0) {
      for (const enemy of this.enemies) {
        if (!enemy.isValid || enemy.isDead || enemy.hasEscaped) {
          continue;
        }

        const distance = Vec3.distance(target.node.position, enemy.node.position);
        if (distance <= projectile.splashRadius) {
          enemy.takeDamage(projectile.damage);
        }
      }
    } else {
      target.takeDamage(projectile.damage);
    }

    if (projectile.slowFactor && projectile.slowDuration) {
      target.applySlow(projectile.slowFactor, projectile.slowDuration);
    }
  }

  private refreshHud(): void {
    this.hud.setStats(
      this.battleState.gold,
      this.battleState.lives,
      this.battleState.currentWave,
      this.battleState.totalWaves,
    );
  }

  private clearTowerSelection(): void {
    for (const tower of this.towers) {
      if (tower.isValid) {
        tower.setSelected(false);
      }
    }
  }

  private projectileColorForTower(towerId: TowerId): string {
    if (towerId === 'cannon') {
      return '#dca96d';
    }

    if (towerId === 'frost') {
      return '#93d8f3';
    }

    return '#f4e7cf';
  }

  private gridToWorld(point: GridPoint): Vec3 {
    return new Vec3(
      this.boardOrigin.x + point.x * this.level.cellSize,
      this.boardOrigin.y - point.y * this.level.cellSize,
      0,
    );
  }
}
