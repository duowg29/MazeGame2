import { ButtonDTO } from '../dto/ButtonDTO';
import Button from '../utilities/Button';
import { textStyle1, textStyle2 } from '../utilities/TextStyle';
import SoundManager from '../utilities/SoundManager';
import BackgroundLoader from '../utilities/BackgroundLoader';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.soundManager = null;
    }

    preload() {
        this.soundManager = new SoundManager(this, ['bgMusic']);
        this.soundManager.preload();
        
        this.load.image('bgMenu', 'assets/img/bgMenu.png')
    }

    create() {
        this.backgroundLoader = new BackgroundLoader(this, 'bgMenu', this.cameras.main.centerX, this.cameras.main.centerY);
        this.backgroundLoader.loadBackground();

        this.soundManager.play('bgMusic', true); 
        this.add.text(this.cameras.main.centerX, 200, 'Maze Game', textStyle1)
            .setOrigin(0.5);

        const startButtonDTO = new ButtonDTO('startButton', 'Start Game', this.cameras.main.centerX, 600, () => {
            this.soundManager.stop('bgMusic');
            this.scene.start('CharacterSelectionScene');
        });
        
        new Button(this, startButtonDTO);
    }
}