# 如何在 Cocos Creator 中使用本项目

## 第一步：打开项目

### 1.1 启动 Cocos Creator
下载并安装 [Cocos Creator 3.8 LTS](https://www.cocos.com/creator-download)

### 1.2 打开项目
1. 点击 **「打开其他项目」**
2. 选择文件夹：`F:\githubgll\DefendVillage`
3. 点击 **「选择文件夹」**
4. 等待项目初始化（首次打开会稍慢）

---

## 第二步：项目概览

打开后，你会看到：
```
Assets 面板（左下角）
├── scripts/          # 我们写的所有脚本
├── textures/         # 图片资源（含 carrot/）
├── audio/            # 音频资源（含 carrot/）
└── resources/        # 动态加载资源
```

---

## 第三步：创建第一个场景 (Start 场景)

### 3.1 创建场景
1. 在 **Assets** 面板，右键 `assets` 文件夹
2. 选择 **Create -> Scene**
3. 命名为 `Start`

### 3.2 编辑场景
双击 `Start.scene` 打开：

#### 创建 Canvas
1. 右键 **层级管理器**（左边）
2. **Create -> UI -> Canvas**

#### 添加背景
1. 右键 Canvas
2. **Create -> 2D Sprite**
3. 在 **属性检查器**（右边）：
   - 点击 SpriteFrame 旁边的圆圈
   - 在 `assets/textures/carrot/Themes/Theme1/` 找背景图

#### 添加标题
1. 右键 Canvas
2. **Create -> UI -> Label**
3. 属性检查器：
   - String: `保卫村庄`
   - Font Size: 60

#### 添加开始按钮
1. 右键 Canvas
2. **Create -> UI -> Button**
3. 在按钮下的 Label 改文字为「开始」

#### 挂载脚本
1. 选中 Canvas
2. 属性检查器底部：**Add Component -> User Scripts -> UIMainMenu**
3. 将开始按钮拖到 `StartBtn` 属性
4. 将设置按钮拖到 `SettingBtn` 属性

---

## 第四步：创建 Game 场景（核心场景）

### 4.1 创建 Game 场景
同样创建 `Game.scene`

### 4.2 搭建节点结构
```
Canvas
├── GameLayer
│   ├── Background        (Sprite - 地图背景)
│   ├── MapPath           (空节点 - 挂载 MapPath 脚本)
│   ├── TowerLayer        (空节点 - 放防御塔)
│   ├── MonsterLayer      (空节点 - 放怪物)
│   └── Village           (Sprite - 村庄图片，挂载 Village 脚本)
└── UILayer
    ├── GoldLabel         (Label - 显示金币)
    ├── HpLabel           (Label - 显示血量)
    ├── WaveLabel         (Label - 显示波次)
    ├── PauseBtn          (Button)
    ├── SpeedBtn          (Button)
    ├── TowerSelectPanel  (Panel - 塔选择)
    ├── PausePanel        (Panel - 暂停)
    └── GameOverPanel     (Panel - 游戏结束)
```

### 4.3 挂载核心脚本
1. 在层级管理器中创建一个空节点，命名为 `GameManager`
2. 添加组件：`GameManager`
3. 同样创建 `AudioManager` 和 `EventManager` 节点
4. 选中 Canvas 或单独的节点，添加 `GameLevel`, `UIGame`, `UITowerPanel`

---

## 第五步：创建防御塔预制体

### 5.1 创建稻草人塔
1. 在 **层级管理器** 创建空节点，命名 `Tower_Scarecrow`
2. 添加 `Sprite` 组件
3. 在 `assets/textures/carrot/Themes/Towers/` 找瓶子塔图片作为临时替代
4. 添加组件：**Add Component -> User Scripts -> Tower**
5. 在属性检查器中设置 `Tower Type` 为 `Scarecrow`
6. 将节点拖到 **Assets/resources/prefabs/towers/** 文件夹，成为预制体
7. 删除场景中的节点

### 5.2 重复创建其他塔
同样创建其他5种防御塔的预制体

---

## 第六步：创建怪物预制体

### 6.1 创建狼怪物
1. 创建节点 `Monster_Wolf`
2. 添加 Sprite（找个怪物图片）
3. 添加 `Monster` 组件
4. 设置 `Monster Type` 为 `Wolf`
5. 拖到 `assets/resources/prefabs/monsters/` 成为预制体

### 6.2 创建其他怪物
同样创建其他4种怪物预制体

---

## 第七步：配置 GameLevel 脚本

在 Game 场景中：
1. 选中挂载 `GameLevel` 的节点
2. 将 `MonsterLayer` 节点拖到 `Monster Layer` 属性
3. 将 `MapPath` 节点拖到 `Map Path` 属性
4. 将 `Village` 节点拖到 `Village` 属性
5. 在 `Monster Prefabs` 数组中，依次拖入6个怪物预制体

---

## 第八步：运行测试！

1. 点击编辑器顶部的 **▶ 运行** 按钮
2. 如果一切顺利，你会看到游戏运行！

---

## 常见问题

### Q: 找不到脚本？
A: 首次打开，Cocos Creator 可能需要时间编译 TypeScript，稍等几分钟，或者点击菜单栏 **开发者 -> 编译项目**

### Q: 图片显示不正常？
A: 保卫萝卜的图片是 .pvr.ccz.png 格式，Cocos Creator 可以直接读取，但建议转换为普通 .png 或 .jpg

### Q: 如何构建微信小游戏？
A: 菜单 **项目 -> 构建发布**，选「微信小游戏」，填 AppID，构建后用微信开发者工具打开

祝你开发愉快！🎉
