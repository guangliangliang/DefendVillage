# DefendVillage

`DefendVillage` is a single-player tower defense starter built for `Cocos Creator 3.x`.

The repository intentionally starts with code-first scaffolding:

- no external art dependency
- no plugin dependency
- placeholder visuals rendered with `Graphics` and `Label`
- gameplay structure designed to migrate to WeChat or Douyin mini games later

## Current Scope

This starter includes:

- one playable level
- three tower types
- three enemy types
- wave spawning
- build, upgrade, and sell interactions
- HUD and victory or defeat state

## Open In Cocos Creator

1. Open `Cocos Creator 3.8.x`.
2. Choose `Import Project` and select this repository folder:
   `F:\githubgll\DefendVillage`
3. Let Creator generate the `.meta` files.
4. Create a new scene, for example `assets/scenes/Main.scene`.
5. Add a `Canvas` node if the scene is empty.
6. Attach the `GameBootstrap` script to the `Canvas` node.
7. Press preview or play.

## Controls

- Tap a tower button at the bottom to choose what to build.
- Tap a build tile to place that tower.
- Tap an occupied build tile while a tower mode is selected to upgrade it.
- Tap `Sell` and then tap a tower tile to sell it.

## Folder Notes

- `assets/scripts/config`: level and unit configs
- `assets/scripts/core`: gameplay components and systems
- `assets/scripts/ui`: HUD construction
- `docs`: setup and art notes

## Next Steps

- replace placeholder visuals with village art
- add multiple stages and progression
- add local save data
- add Creator scene assets and prefabs
- add mini-game platform adapters
