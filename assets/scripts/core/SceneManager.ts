import { Director } from 'cc';

export class SceneManager {
    static loadScene(sceneName: string) {
        console.log('Loading scene:', sceneName);
        Director.instance.loadScene(sceneName);
    }

    static goToStart() {
        this.loadScene('Start');
    }

    static goToLevelSelect() {
        this.loadScene('LevelSelect');
    }

    static goToGame() {
        this.loadScene('Game');
    }
}
