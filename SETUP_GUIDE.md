# 项目搭建指南

## 步骤 1: 安装 Cocos Creator

下载并安装 [Cocos Creator 3.8 LTS](https://www.cocos.com/creator-download)

## 步骤 2: 打开项目

1. 启动 Cocos Creator
2. 选择「打开其他项目」
3. 选择本项目文件夹 `DefendVillage`
4. 等待项目初始化完成

## 步骤 3: 创建场景

### Start 场景 (开始菜单)
```
Canvas
├── Background (Sprite)
├── Title (Label: "保卫村庄")
├── StartBtn (Button)
└── SettingBtn (Button)
```
- 挂载 `UIMainMenu.ts` 脚本

### LevelSelect 场景 (关卡选择)
```
Canvas
├── Background
├── Title (Label: "选择关卡")
├── LevelGrid (Layout)
└── BackBtn (Button)
```
- 挂载 `UILevelSelect.ts` 脚本
- 创建关卡按钮预制体

### Game 场景 (游戏主场景)
```
Canvas
├── GameLayer
│   ├── Background (地图背景)
│   ├── MapPath (挂载 MapPath.ts)
│   ├── TowerLayer (防御塔容器)
│   ├── MonsterLayer (怪物容器)
│   └── Village (村庄，挂载 Village.ts)
└── UILayer
    ├── GoldLabel
    ├── HpLabel
    ├── WaveLabel
    ├── PauseBtn
    ├── SpeedBtn
    ├── TowerSelectPanel
    ├── PausePanel
    └── GameOverPanel
```
- 挂载 `GameManager.ts` (常驻节点)
- 挂载 `AudioManager.ts` (常驻节点)
- 挂载 `GameLevel.ts`
- 挂载 `UIGame.ts`
- 挂载 `UITowerPanel.ts`

## 步骤 4: 创建预制体

### 防御塔预制体
为每种防御塔创建一个预制体，挂载 `Tower.ts` 脚本

### 怪物预制体
为每种怪物创建一个预制体，挂载 `Monster.ts` 脚本

### 子弹预制体
创建子弹预制体，挂载 `Bullet.ts` 脚本

## 步骤 5: 添加资源

- 将美术图片放入 `assets/textures/`
- 将音频文件放入 `assets/audio/`
- 在编辑器中配置 SpriteFrame

## 步骤 6: 测试运行

点击编辑器顶部的「运行」按钮测试游戏！

## 步骤 7: 构建微信小游戏

1. 菜单: 项目 -> 构建发布
2. 选择平台: 微信小游戏
3. 填写 AppID
4. 点击「构建」
5. 用微信开发者工具打开构建后的项目
