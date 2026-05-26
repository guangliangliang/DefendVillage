# 资源文件夹说明

这个文件夹将包含所有游戏资源，会在 Cocos Creator 中进一步组织。

## 计划结构

```
assets/
├── scripts/           # TypeScript 脚本
│   ├── core/         # 核心管理器
│   ├── data/         # 数据定义
│   ├── game/         # 游戏组件
│   └── ui/           # UI组件
├── resources/        # 动态加载的资源
│   ├── prefabs/      # 预制体
│   └── levels/       # 关卡配置
├── textures/         # 图片资源
├── audio/            # 音频资源
├── scenes/           # 场景文件
└── materials/        # 材质
```

## 注意

- 这个文件夹会在 Cocos Creator 中被自动管理
- 不要直接在这里创建或编辑文件，应该在 Cocos Creator 编辑器中进行
- Cocos Creator 会为每个资源生成对应的 .meta 文件
