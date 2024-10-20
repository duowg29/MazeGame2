import { MazeGenerator } from '../services/MazeGenerator';
import { Timer } from '../utilities/Timer';
import { PlayerDTO } from '../dto/PlayerDTO';
import { ButtonDTO } from '../dto/ButtonDTO';
import  Button  from '../utilities/Button';
import { PowerUp } from '../controllers/PowerUpManager';
import SoundManager from '../utilities/SoundManager';
import { textStyle1, textStyle2 } from '../utilities/TextStyle';
import { LevelDTO } from '../dto/LevelDTO'; 
import PlayerController from '../controllers/PlayerController'; 

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.mazeArray = [];
        this.score = 0;
        this.scoreText = null;
        this.soundManager = null;

        this.isSpacePressed = false;
        this.currentDirection = null;

        this.level = new LevelDTO('Level', 6, 6);
        this.maxLevelSize = 18;
        this.gameOver = false;
    }

    init(data) {
        this.selectedCharacter = data.character;
        if (!this.selectedCharacter) {
            console.error('selectedCharacter is undefined. Make sure it is passed correctly from the previous scene.');
        }
    }

    preload() {
        this.load.image('wall', 'assets/img/wall.png');
        this.load.image(this.selectedCharacter.avatar, 'assets/img/' + this.selectedCharacter.avatar + '.png');
        this.load.image('goal', 'assets/img/earth.png');
        this.load.image('scorePowerUp', 'assets/img/scorePowerUp.png');
        this.load.image('timePowerUp', 'assets/img/timePowerUp.png');
        this.soundManager = new SoundManager(this, ['gameMusic', 'scoreSound']);
        this.soundManager.preload();
    }

    create() {
        this.scoreText = this.add.text(10, 650, `Score: ${this.score}`, textStyle2);
        this.tipsText = this.add.text(150, 650, 'SPACE + MOVE OR HOLD MOVE = DASH', textStyle2);
        
        if (!this.soundManager.isPlaying('gameMusic')) {
            this.soundManager.play('gameMusic', true);
        }

        this.timer = new Timer(this, 10, this.endGame.bind(this));
        this.timer.start();

        this.input.keyboard.on('keydown', function(event) {
            if (event.keyCode >= Phaser.Input.Keyboard.KeyCodes.LEFT && event.keyCode <= Phaser.Input.Keyboard.KeyCodes.DOWN) {
                event.preventDefault(); 
            }
        });

        this.createNewLevel();
        this.playerController = new PlayerController(this, this.player, this.playerSprite, this.mazeArray);

        this.input.keyboard.on('keydown', this.playerController.handleKeyDown.bind(this.playerController), this);
        this.input.keyboard.on('keyup', this.playerController.handleKeyUp.bind(this.playerController), this);
    }

    update() {
        if (this.gameOver) return;  
        this.playerController.update();
    
        this.powerUps.collectPowerUp(this.player);
        MazeGenerator.drawMaze(this);
    }

    checkWin() {
        if (this.player.positionX === this.goal.x / 30 && this.player.positionY === this.goal.y / 30) {
            this.updateScore(1);
            this.soundManager.play('scoreSound', false);
            this.resetGame();
        }
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    createNewLevel() {
        this.mazeArray = MazeGenerator.generateMaze(this.level.rows, this.level.cols);
        MazeGenerator.drawMaze(this);

        const playerPos = PlayerController.getRandomPosition(this.mazeArray);
        const goalPos = PlayerController.getRandomPosition(this.mazeArray);
        this.goal = this.add.image(goalPos.x * 30, goalPos.y * 30, 'goal').setOrigin(0, 0).setDisplaySize(30, 30);

        this.player = new PlayerDTO('player', this.selectedCharacter.name, playerPos.x, playerPos.y, 0);
        this.playerSprite = this.add.sprite(this.player.positionX * 30, this.player.positionY * 30, this.selectedCharacter.avatar)
            .setOrigin(0, 0)
            .setDisplaySize(30, 30);

        this.powerUps = new PowerUp(this, this.mazeArray);
        this.powerUps.timer = this.timer;
    }

    resetGame() {        
        this.timer.reset(10);
        this.scene.restart({ character: this.selectedCharacter });

        this.children.list.forEach(child => {
            if (child && child.name === 'wall') {
                child.destroy();
            }
        });

        this.checkLevelUp(); 

        this.powerUps.collectPowerUp(this.player);

        this.powerUps.activePowerUps.forEach(powerUp => {
            if (powerUp && powerUp.sprite) {
                powerUp.sprite.destroy();
            }
        });
        this.powerUps.activePowerUps = [];
        this.mazeArray = MazeGenerator.generateMaze(10, 10);

        const playerPos = PlayerController.getRandomPosition(this.mazeArray);
        const goalPos = PlayerController.getRandomPosition(this.mazeArray);

        this.player.positionX = playerPos.x;
        this.player.positionY = playerPos.y;
        this.playerSprite.setPosition(this.player.positionX * 30, this.player.positionY * 30);
        if (this.goal) {
            this.goal.destroy();
        }
        this.goal = this.add.image(goalPos.x * 30, goalPos.y * 30, 'goal').setOrigin(0, 0).setDisplaySize(30, 30);

        this.powerUps = new PowerUp(this, this.mazeArray);
        this.powerUps.timer = this.timer;
    }

    checkLevelUp() {
        if (this.level.cols < this.maxLevelSize && this.level.rows < this.maxLevelSize) {
            this.level.cols += 1;
            this.level.rows += 1;
        }
        this.createNewLevel();
    }

    endGame() {
        this.gameOver = true;
        this.soundManager.stop('gameMusic');
        this.timer.stop();

        this.scene.start('GameOverScreen', { score: this.score, character: this.selectedCharacter });
    }

}