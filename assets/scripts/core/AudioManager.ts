import { _decorator, Component, AudioSource, resources, AudioClip } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    static instance: AudioManager;

    @property(AudioSource)
    bgmSource: AudioSource | null = null;

    @property(AudioSource)
    sfxSource: AudioSource | null = null;

    onLoad() {
        if (AudioManager.instance) {
            this.destroy();
            return;
        }
        AudioManager.instance = this;
    }

    playBGM(name: string) {
        if (!this.bgmSource) return;
        resources.load(`audio/${name}`, AudioClip, (err, clip) => {
            if (err) {
                console.error('Failed to load BGM:', err);
                return;
            }
            this.bgmSource!.clip = clip;
            this.bgmSource!.loop = true;
            this.bgmSource!.play();
        });
    }

    playSFX(name: string) {
        if (!this.sfxSource) return;
        resources.load(`audio/${name}`, AudioClip, (err, clip) => {
            if (err) {
                console.error('Failed to load SFX:', err);
                return;
            }
            this.sfxSource!.playOneShot(clip);
        });
    }

    stopBGM() {
        this.bgmSource?.stop();
    }
}
