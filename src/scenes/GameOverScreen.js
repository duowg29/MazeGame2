import { ButtonDTO } from '../dto/ButtonDTO';
import { textStyle1, textStyle2 } from '../utilities/TextStyle';

export default class GameOverScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScreen' });
        this.score = 0;
        this.selectedCharacter = null;
    }

    init(data) {
        this.score = data.score;        
        this.selectedCharacter = data.character;
    }

    create() {
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20, `Game Over!`, textStyle1)
            .setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 20, `Score: ${this.score}`, textStyle2)
            .setOrigin(0.5);

        const replayButton = new ButtonDTO('replayButton', 'Play Again', this.cameras.main.centerX - 50, this.cameras.main.centerY + 80, () => {
            this.scene.start('GameScene', { character: this.selectedCharacter });
        });

        this.add.text(this.cameras.main.centerX - 50, this.cameras.main.centerY + 80, replayButton.text, textStyle2)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', replayButton.onClick)
            .on('pointerover', function () { this.setStyle({ fill: '#ff0' }); })
            .on('pointerout', function () { this.setStyle({ fill: '#0f0' }); });

        const exitButton = new ButtonDTO('exitButton', 'Exit', this.cameras.main.centerX + 50, this.cameras.main.centerY + 80, () => {
            location.reload();
        });

        this.add.text(this.cameras.main.centerX + 50, this.cameras.main.centerY + 80, exitButton.text, textStyle2)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', exitButton.onClick)
            .on('pointerover', function () { this.setStyle({ fill: '#ff0' }); })
            .on('pointerout', function () { this.setStyle({ fill: '#f00' }); });
    }
}
