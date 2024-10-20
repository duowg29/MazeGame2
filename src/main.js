import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene';
import CharacterSelectionScene from './scenes/CharacterSelectionScene';
import GameScene from './scenes/GameScene';
import GameOverScreen from './scenes/GameOverScreen';

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 700,
    parent: 'gameContainer',
    scene: [MenuScene, CharacterSelectionScene, GameScene,  GameOverScreen],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
