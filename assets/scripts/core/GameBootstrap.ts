import { _decorator, Component, Layers, Node, Vec3, profiler } from 'cc';
import { ENEMY_CONFIGS, LEVEL_001, TOWER_CONFIGS } from '../config/LevelConfig';
import { BuildAction, GridPoint, LevelConfig, TowerId, TowerLevelStats } from '../config/GameTypes';
import { BattleState } from './BattleState';
import { Enemy } from './Enemy';
import { addCenteredLabel, createSpriteNode, createUiNode, drawRect } from './NodeFactory';
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
  private buildMenuLayer!: Node;
  private hudLayer!: Node;
  private menuLayer!: Node;
  private hud!: BattleHUD;
  private battleStarted = false;
  private selectedStage = 1;
  private activeBuildRecord: BuildSpotRecord | null = null;

  private pathWorldPoints: Vec3[] = [];
  private buildSpots = new Map<string, BuildSpotRecord>();
  private enemies = new Set<Enemy>();
  private towers = new Set<Tower>();

  onLoad(): void {
    profiler.hideStats();
    this.createLayers();
    this.showMainMenu();
  }

  update(dt: number): void {
    if (!this.battleStarted) {
      return;
    }

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
    const projectileNode = createSpriteNode(`${towerId}-projectile`, 30, 30, `carrot/sprites/projectiles/${towerId}`);
    projectileNode.setParent(this.projectileLayer);
    projectileNode.setPosition(origin);

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
    this.buildMenuLayer = new Node('BuildMenuLayer');
    this.buildMenuLayer.layer = Layers.Enum.UI_2D;
    this.buildMenuLayer.setParent(this.node);
    this.hudLayer = new Node('HudLayer');
    this.hudLayer.layer = Layers.Enum.UI_2D;
    this.hudLayer.setParent(this.node);
    this.menuLayer = new Node('MenuLayer');
    this.menuLayer.layer = Layers.Enum.UI_2D;
    this.menuLayer.setParent(this.node);
  }

  private createBattlefield(): void {
    const boardWidth = 960;
    const boardHeight = 640;
    const boardCenter = new Vec3(0, 0, 0);

    const base = createSpriteNode('ThemeBase', boardWidth, boardHeight, 'carrot/theme1/bg1/base');
    base.setParent(this.mapLayer);
    base.setPosition(boardCenter);

    const pathArt = createSpriteNode('ThemePath', boardWidth, boardHeight, 'carrot/theme1/bg1/path');
    pathArt.setParent(this.mapLayer);
    pathArt.setPosition(boardCenter);

    this.addDecoration('CloudLeft', 200, 280, 80, 80, 'carrot/battle/cloud01');
    this.addDecoration('CloudRight', 760, 280, 80, 80, 'carrot/battle/cloud01');
    this.addDecoration('PlanetLeft', 360, 360, 80, 80, 'carrot/battle/cloud03');
    this.addDecoration('PlanetRight', 600, 360, 80, 80, 'carrot/battle/cloud03');
    this.addDecoration('CloudTopLeft', 360, 480, 80, 80, 'carrot/battle/cloud05');
    this.addDecoration('CloudTopRight', 640, 480, 80, 80, 'carrot/battle/cloud05');
    this.addDecoration('Balloon', 480, 505, 160, 160, 'carrot/battle/cloud07');
    this.addDecoration('Rainbow', 480, 185, 160, 80, 'carrot/battle/cloud04');
    this.addDecoration('StartSign', 120, 475, 93, 73, 'carrot/battle/start_sign');

    this.pathWorldPoints = this.level.path.map((point) => this.gridToWorld(point));
    const corePosition = this.sourceToWorld(837, 427);
    const coreShadow = createSpriteNode('VillageCoreShadow', 45, 17, 'carrot/battle/carrot_shadow');
    coreShadow.setParent(this.mapLayer);
    coreShadow.setPosition(corePosition.x, corePosition.y);

    const coreNode = createSpriteNode('VillageCore', 86, 86, 'carrot/sprites/ui/carrot');
    coreNode.setParent(this.mapLayer);
    coreNode.setPosition(corePosition);

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

  private showMainMenu(): void {
    this.menuLayer.active = true;
    this.menuLayer.destroyAllChildren();

    const background = createSpriteNode('MainMenuBg', 960, 640, 'carrot/menu/main_bg_full');
    background.setParent(this.menuLayer);

    const title = createSpriteNode('MainMenuTitle', 960, 640, 'carrot/menu/main_title_cn');
    title.setParent(this.menuLayer);

    const adventureButton = createSpriteNode('AdventureButton', 300, 160, 'carrot/menu/adventure_btn');
    adventureButton.setParent(this.menuLayer);
    adventureButton.setPosition(this.sourceToWorld(177, 80));
    adventureButton.on(Node.EventType.TOUCH_END, () => this.showStageSelect());

    const bossButton = createSpriteNode('BossButton', 300, 160, 'carrot/menu/boss_btn');
    bossButton.setParent(this.menuLayer);
    bossButton.setPosition(this.sourceToWorld(480, 80));

    const nestButton = createSpriteNode('NestButton', 300, 160, 'carrot/menu/nest_btn');
    nestButton.setParent(this.menuLayer);
    nestButton.setPosition(this.sourceToWorld(783, 80));

    const bossLock = createSpriteNode('BossLock', 100, 100, 'carrot/menu/locked');
    bossLock.setParent(this.menuLayer);
    bossLock.setPosition(this.sourceToWorld(613, 60));

    const nestLock = createSpriteNode('NestLock', 100, 100, 'carrot/menu/locked');
    nestLock.setParent(this.menuLayer);
    nestLock.setPosition(this.sourceToWorld(918, 60));

    const settingButton = createSpriteNode('SettingButton', 66, 66, 'carrot/menu/setting_btn');
    settingButton.setParent(this.menuLayer);
    settingButton.setPosition(this.sourceToWorld(250, 222));

    const helpButton = createSpriteNode('HelpButton', 66, 66, 'carrot/menu/help_btn');
    helpButton.setParent(this.menuLayer);
    helpButton.setPosition(this.sourceToWorld(710, 222));

    const bird = createSpriteNode('MainMenuBird', 200, 100, 'carrot/menu/bird');
    bird.setParent(this.menuLayer);
    bird.setPosition(this.sourceToWorld(205, 455));
  }

  private showStageSelect(): void {
    this.menuLayer.active = true;
    this.menuLayer.destroyAllChildren();

    const background = createSpriteNode('StageSelectBg', 960, 640, 'carrot/menu/stage_bg');
    background.setParent(this.menuLayer);

    const titlePanel = createUiNode('StageTitlePanel', 520, 54);
    titlePanel.setParent(this.menuLayer);
    titlePanel.setPosition(0, 260);
    drawRect(titlePanel, 520, 54, '#1f4f6c', '#b9f0ff', 16);
    addCenteredLabel(titlePanel, 'Select Stage', 28, '#f7fbff');

    const stages = [
      { id: 1, resource: 'carrot/menu/stage_01', x: -280, y: 72 },
      { id: 2, resource: 'carrot/menu/stage_02', x: 0, y: 72 },
      { id: 3, resource: 'carrot/menu/stage_03', x: 280, y: 72 },
    ];

    for (const stage of stages) {
      const selected = stage.id === this.selectedStage;
      const frame = createUiNode(`Stage${stage.id}Frame`, 252, 170);
      frame.setParent(this.menuLayer);
      frame.setPosition(stage.x, stage.y);
      drawRect(frame, 252, 170, selected ? '#ffcf43' : '#0e2d3f', selected ? '#fff2a6' : '#5fa7bd', 18);

      const card = createSpriteNode(`Stage${stage.id}Card`, 236, 156, stage.resource);
      card.setParent(frame);
      card.on(Node.EventType.TOUCH_END, () => {
        this.selectedStage = stage.id;
        this.showStageSelect();
      });
    }

    const towers = createSpriteNode('StageTowerPreview', 250, 130, 'carrot/menu/stage_towers_01');
    towers.setParent(this.menuLayer);
    towers.setPosition(-245, -142);

    const waves = createSpriteNode('StageWaveCount', 140, 56, 'carrot/menu/waves_15');
    waves.setParent(this.menuLayer);
    waves.setPosition(60, -142);

    const playButton = createSpriteNode('StagePlayButton', 220, 92, 'carrot/menu/play_btn');
    playButton.setParent(this.menuLayer);
    playButton.setPosition(290, -186);
    playButton.on(Node.EventType.TOUCH_END, () => this.startBattle());

    const backButton = createSpriteNode('StageBackButton', 72, 72, 'carrot/menu/back_btn');
    backButton.setParent(this.menuLayer);
    backButton.setPosition(-430, 270);
    backButton.on(Node.EventType.TOUCH_END, () => this.showMainMenu());
  }

  private startBattle(): void {
    this.menuLayer.destroyAllChildren();
    this.menuLayer.active = false;
    this.battleStarted = true;
    this.selectedAction = 'arrow';
    this.mapLayer.destroyAllChildren();
    this.towerLayer.destroyAllChildren();
    this.enemyLayer.destroyAllChildren();
    this.projectileLayer.destroyAllChildren();
    this.buildMenuLayer.destroyAllChildren();
    this.hudLayer.destroyAllChildren();
    this.activeBuildRecord = null;
    this.buildSpots.clear();
    this.enemies.clear();
    this.towers.clear();

    this.battleState = new BattleState(this.level.startGold, this.level.startLives, this.level.waves.length);
    this.waveController = new WaveController(
      this.level,
      (waveNumber, label) => {
        this.battleState.setWave(waveNumber);
        this.hud.setHint(`Stage ${this.selectedStage} - Wave ${waveNumber}: ${label}`);
        this.refreshHud();
      },
      (enemyId) => this.spawnEnemy(enemyId),
    );

    this.createBattlefield();
    this.createHud();
    this.hud.setHint(`Stage ${this.selectedStage} ready.`);
    this.refreshHud();
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
      this.showBuildMenu(record);
      return;
    }

    if (record.tower) {
      this.clearBuildMenu();
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

  private showBuildMenu(record: BuildSpotRecord): void {
    this.clearBuildMenu();
    this.clearTowerSelection();
    this.activeBuildRecord = record;

    const selectedTile = createSpriteNode('SelectedBuildTile', 80, 80, 'carrot/battle/select_01');
    selectedTile.setParent(this.buildMenuLayer);
    selectedTile.setPosition(record.node.position);

    const options: Array<{ towerId: TowerId; resource: string; x: number }> = [
      { towerId: 'arrow', resource: 'bottle', x: -43 },
      { towerId: 'cannon', resource: 'shit', x: 43 },
    ];
    const yOffset = record.grid.y > 400 ? -88 : 70;

    for (const option of options) {
      const config = TOWER_CONFIGS[option.towerId];
      const canAfford = this.battleState.canAfford(config.levels[0].cost);
      const resourceState = canAfford ? 'enabled' : 'disabled';
      const button = createSpriteNode(
        `Build-${option.resource}-${resourceState}`,
        80,
        80,
        `carrot/battle/towers/${option.resource}_${resourceState}`,
      );
      button.setParent(this.buildMenuLayer);
      button.setPosition(record.node.position.x + option.x, record.node.position.y + yOffset);

      if (canAfford) {
        button.on(Node.EventType.TOUCH_END, () => {
          this.buildTower(record, option.towerId);
        });
      }
    }
  }

  private buildTower(record: BuildSpotRecord, towerId: TowerId): void {
    if (record.tower || record !== this.activeBuildRecord) {
      this.clearBuildMenu();
      return;
    }

    const config = TOWER_CONFIGS[towerId];
    const buildCost = config.levels[0].cost;
    if (!this.battleState.spend(buildCost)) {
      this.showBuildMenu(record);
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
    this.clearBuildMenu();
    this.clearTowerSelection();
    tower.setSelected(true);
    this.refreshHud();
  }

  private clearBuildMenu(): void {
    this.buildMenuLayer.destroyAllChildren();
    this.activeBuildRecord = null;
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

  private gridToWorld(point: GridPoint): Vec3 {
    return this.sourceToWorld(point.x, point.y);
  }

  private sourceToWorld(sourceX: number, sourceY: number): Vec3 {
    return new Vec3(sourceX - 480, sourceY - 320, 0);
  }

  private addDecoration(name: string, sourceX: number, sourceY: number, width: number, height: number, resourcePath: string): void {
    const decoration = createSpriteNode(name, width, height, resourcePath);
    decoration.setParent(this.mapLayer);
    decoration.setPosition(this.sourceToWorld(sourceX, sourceY));
  }
}
