export default class SoundManager {
    constructor(scene, soundKeys) {
        this.scene = scene;
        this.soundKeys = Array.isArray(soundKeys) ? soundKeys : [soundKeys];
        this.sounds = {};
    }

    preload() {
        // Load từng soundKey
        this.soundKeys.forEach((key) => {
            this.scene.load.audio(key, `assets/audio/${key}.mp3`);
        });
    }

    play(soundKey, loop = false) {
        if (!this.sounds[soundKey]) {
            this.sounds[soundKey] = this.scene.sound.add(soundKey, { loop });
        }
        this.sounds[soundKey].play();
    }

    stop(soundKey) {
        if (this.sounds[soundKey]) {
            this.sounds[soundKey].stop();
        }
    }
    
    isPlaying(key) {
        const sound = this.scene.sound.get(key);
        return sound && sound.isPlaying;
    }
}