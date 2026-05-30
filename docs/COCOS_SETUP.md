# Cocos Creator Setup

This repository now includes the minimum `Cocos Creator 3.8.x` project skeleton files so it can be opened as a Creator project.

## Recommended Version

Use `Cocos Creator 3.8.8`.

## Minimum Manual Steps

1. Open the folder in `Cocos Creator 3.8.8`.
2. Wait for Creator to generate `.meta`, `library`, `local`, and `temp`.
3. Create a scene, for example `assets/scenes/Main.scene`.
4. Add a `Canvas` node to that scene.
5. Attach `GameBootstrap` to the `Canvas`.
6. Save the scene and press preview.

The script creates the battlefield, HUD, enemies, towers, projectiles, and build tiles at runtime.

## Suggested Scene Structure

- `Canvas`
- `Canvas/GameBootstrap`

Attaching `GameBootstrap` to the `Canvas` node is enough. The runtime nodes are generated automatically.

## Why The Scene Is Still Manual

The project code is ready, but Creator scene serialization depends on Creator-generated asset metadata UUIDs.
Those UUIDs are created on first import, so the safest approach is to let Creator generate them locally and then attach `GameBootstrap` once in the editor.
