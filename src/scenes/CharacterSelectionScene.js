import { ButtonDTO } from '../dto/ButtonDTO';
import Button from '../utilities/Button';
import BackgroundLoader from '../utilities/BackgroundLoader';
import SoundManager from '../utilities/SoundManager';
import CharacterSelector from '../utilities/CharacterSelector';
import { textStyle1, textStyle2 } from '../utilities/TextStyle';
import { PlayerDTO } from '../dto/PlayerDTO';

export default class CharacterSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterSelectionScene' });
        this.characterSelector = null;
        this.backgroundLoader = null;
        this.soundManager = null;
    }

    preload() {
        // Load character sprites 
        this.load.image('rocket', 'assets/img/rocket.png');
        this.load.image('apple', 'assets/img/apple.png');
        this.load.image('ship', 'assets/img/ship.png');
        this.load.image('bgMenu', 'assets/img/bgMenu.png');

        // Load sounds
        this.soundManager = new SoundManager(this, ['bgMusic', 'scoreSound']);
        this.soundManager.preload();
    }

    create() {
        this.backgroundLoader = new BackgroundLoader(this, 'bgMenu', this.cameras.main.centerX, this.cameras.main.centerY);
        this.backgroundLoader.loadBackground();

        this.soundManager.play('bgMusic', true);

        this.add.text(this.cameras.main.centerX, 200, 'Pick your player', textStyle2)
            .setOrigin(0.5);

        const characters = [
            new PlayerDTO('rocket', 'Rocket', 100, 200, 0, 'rocket', 'A fast-moving rocket'),
            new PlayerDTO('apple', 'Apple', 150, 200, 0, 'apple', 'A healthy apple'),
            new PlayerDTO('ship', 'Ship', 200, 200, 0, 'ship', 'A strong ship')
        ];

        this.characterSelector = new CharacterSelector(this, characters);
        this.characterSelector.createCharacterButtons();

        const startButtonDTO = new ButtonDTO('startButton', 'Start Game', this.cameras.main.centerX, 600, () => {
            const selectedCharacter = this.characterSelector.getSelectedCharacter();
            if (selectedCharacter) {
                this.soundManager.stop('bgMusic');
                this.scene.start('GameScene', { character: selectedCharacter });
            } else {
                alert('Please select a character!');
            }
        });

        new Button(this, startButtonDTO);
    }
}
