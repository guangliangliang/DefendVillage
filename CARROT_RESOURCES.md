# 保卫萝卜资源说明

已成功将保卫萝卜的游戏资源复制到项目中！

## 资源位置

```
assets/
├── textures/carrot/       # 图片资源
│   ├── Themes/
│   │   ├── Towers/        # 防御塔精灵表
│   │   ├── Theme1/        # 主题1资源
│   │   ├── Theme2/        # 主题2资源
│   │   ├── Items/         # UI和物品
│   │   └── scene/         # 场景资源
└── audio/carrot/          # 音频资源
    ├── Main/
    ├── Items/
    ├── Towers/
    └── Monsters/
```

## 防御塔对应关系 (Towers/)

| 文件夹 | 说明 |
|--------|------|
| TBottle | 瓶子塔 |
| TShit | 便便塔 |
| TFan | 风扇塔 |
| TStar | 星星塔 |
| TBall | 球塔 |
| TFireBottle | 汽油瓶塔 |
| TBlueStar | 蓝星塔 |
| TSun | 太阳塔 |
| TRocket | 火箭塔 |
| TArrow | 弓箭塔 |
| TMushroom | 蘑菇塔 |
| TAnchor | 锚塔 |
| ... | 其他 |

## 注意

这些是 Cocos2d-html5 格式的资源（使用 .plist 和 .pvr.ccz.png），在 Cocos Creator 3.x 中：

1. Cocos Creator 可以直接使用 .png 图片
2. 对于精灵表 (.plist)，需要在编辑器中重新配置
3. 建议将常用的图片提取出来单独使用

## 快速开始

1. 在 Cocos Creator 中打开项目
2. 浏览 assets/textures/carrot/ 文件夹
3. 将需要的图片拖入场景中使用
