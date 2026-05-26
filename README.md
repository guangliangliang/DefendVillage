# 保卫村庄 - Defend Village

一个基于 Cocos Creator 3.x 的塔防游戏，计划发布到微信小游戏。

## 项目结构

```
DefendVillage/
├── assets/                # 游戏资源文件夹
├── settings/              # Cocos Creator 项目设置
│   └── v2/
│       ├── project.json   # 项目配置
│       └── typescript.json # TypeScript 配置
├── project.json           # 项目标识文件
├── package.json
├── tsconfig.json
└── README.md
```

## 游戏元素

### 防御塔
1. **稻草人** - 基础防御塔
2. **弓箭手** - 远程快速攻击
3. **投石车** - 范围伤害
4. **农夫** - 减速敌人
5. **风车** - 持续范围伤害
6. **钟楼** - 增益周围防御塔

### 怪物
1. **狼** - 快速基础敌人
2. **野猪** - 高血量慢速
3. **哥布林** - 快速高奖励
4. **史莱姆** - 低血量但数量多
5. **大熊Boss** - 超厚血Boss

## 如何使用

### 1. 环境准备
- 安装 [Cocos Creator 3.x](https://www.cocos.com/creator) (推荐 3.8.x 版本)
- 确保已安装 Node.js 和 npm

### 2. 打开项目
1. 启动 Cocos Creator
2. 选择 "打开其他项目"
3. 选择此项目文件夹 `DefendVillage`
4. 等待 Cocos Creator 完成项目初始化（首次打开需要一些时间）

### 3. 开始开发
- Cocos Creator 会自动生成必要的元数据文件
- 在编辑器中创建场景（Start, LevelSelect, Game）
- 创建预制体和绑定组件
- 点击 "运行" 按钮测试游戏

## 下一步

- [ ] 在 Cocos Creator 中打开项目
- [ ] 创建场景和节点结构
- [ ] 添加美术资源
- [ ] 配置预制体
- [ ] 测试游戏
- [ ] 构建微信小游戏

## License

MIT
