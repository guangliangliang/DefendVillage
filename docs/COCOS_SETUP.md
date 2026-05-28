# Cocos Creator Setup

This repository is prepared so you can import it directly into `Cocos Creator 3.8.x`.

## Minimum Manual Steps

1. Import the repo as a Creator project.
2. Create a scene.
3. Add a `Canvas`.
4. Add `GameBootstrap` to the `Canvas`.

The script creates the battlefield, HUD, enemies, towers, projectiles, and build tiles at runtime.

## Suggested Scene Structure

If you want to keep it tidy, use:

- `Canvas`
  - `RuntimeRoot`

You only need to attach `GameBootstrap` to `Canvas`. The runtime nodes are generated automatically.

## Why This Structure

The repo is still in the prototype phase, so the code avoids serialized Creator assets where possible.
That makes it much easier to move fast before final art and polished scenes exist.
